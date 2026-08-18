#!/usr/bin/env node
// Two built stylesheets, and whether moving rules between files changed
// anything a browser could see: a rule lost or altered, or two rules that can
// set the same property on one element at equal specificity swapping order.
//
//   pnpm css-move-guard <before.css> <after.css> [--allow-removed] [--json out]

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseRules } from "./css-home-audit.mjs";

// ── Pure decision layer ─────────────────────────────────────────────────

/** (ids, classes+attributes+pseudo-classes, elements+pseudo-elements) of one selector. */
export function specificity(selector) {
  const s = selector.replace(/:(?:not|is|where|has)\(([^)]*)\)/g, " $1");
  let ids = 0;
  let classes = 0;
  let els = 0;
  for (const m of s.matchAll(/(::[\w-]+)|(#[\w-]+)|(\.[\w-]+|\[[^\]]+\]|:[\w-]+(?:\([^)]*\))?)|((?:^|[\s>+~,])(?:[a-z][\w-]*))|(\*)/gi)) {
    if (m[1]) els++;
    else if (m[2]) ids++;
    else if (m[3]) classes++;
    else if (m[4]) els++;
  }
  return [ids, classes, els];
}

/**
 * What a selector's last compounds land on, one entry per branch: each class
 * with its `--modifier` stripped, because a block and its modifiers sit on the
 * same element; the tag name when the compound has no class; "*" for the
 * universal selector. A pseudo-element is kept as a suffix, since `::before`
 * rules only ever meet other `::before` rules.
 */
export function targetsOf(selector) {
  const out = new Set();
  for (const branch of selector.split(",")) {
    const compounds = branch.trim().split(/\s*[>+~]\s*|\s+/).filter(Boolean);
    const last = compounds[compounds.length - 1] || "";
    const pseudo = last.match(/::[\w-]+/)?.[0] || "";
    const classes = [...last.matchAll(/\.([A-Za-z0-9_-]+)/g)].map((m) => m[1].split("--")[0]);
    if (classes.length === 0) {
      const tag = last.match(/^[a-zA-Z][\w-]*/)?.[0];
      out.add(`${tag || "*"}${pseudo}`);
    }
    for (const c of classes) out.add(`${c}${pseudo}`);
  }
  return out;
}

/** Whether two target sets can name one element. "*" meets any target with the same pseudo-element. */
export function targetsMeet(a, b) {
  for (const t of a) {
    if (b.has(t)) return true;
    const pseudo = t.match(/::[\w-]+$/)?.[0] || "";
    if (t === `*${pseudo}` || b.has(`*${pseudo}`)) {
      for (const u of b) if ((u.match(/::[\w-]+$/)?.[0] || "") === pseudo) return true;
    }
  }
  return false;
}

/** The property families a declaration block sets: `border-color` and `border` both read as "border". */
export function familiesOf(declarations) {
  const out = new Set();
  for (const d of declarations.split(";")) {
    const name = d.split(":")[0].trim();
    if (name) out.add(name.replace(/^-webkit-|^-moz-/, "").split("-")[0]);
  }
  return out;
}

/** property -> value of a declaration block. */
export function declarationMap(declarations) {
  const out = new Map();
  for (const d of declarations.split(";")) {
    const at = d.indexOf(":");
    if (at !== -1) out.set(d.slice(0, at).trim(), d.slice(at + 1).trim());
  }
  return out;
}

/**
 * Whether two rules at equal specificity could set the same property on the
 * same element to different values. Two rules that agree on every property
 * they share can swap freely.
 */
export function mayCollide(x, y) {
  if (!targetsMeet(x.targets, y.targets)) return false;
  let sharedFamily = false;
  for (const f of x.families) if (y.families.has(f)) sharedFamily = true;
  if (!sharedFamily) return false;
  const dx = declarationMap(x.r.declarations);
  const dy = declarationMap(y.r.declarations);
  const sameKeys = [...dx.keys()].filter((k) => dy.has(k));
  const familyOnly = [...x.families].some((f) => y.families.has(f) && ![...dx.keys()].some((k) => dy.has(k) && k.split("-")[0] === f));
  if (familyOnly) return true;
  return sameKeys.some((k) => dx.get(k) !== dy.get(k));
}

const key = (r) => `${r.atRule || ""} || ${r.selector} || ${r.declarations}`;

/**
 * @param {string} before css
 * @param {string} after css
 */
export function guard(before, after) {
  const a = parseRules(before);
  const b = parseRules(after);
  const countA = new Map();
  const countB = new Map();
  for (const r of a) countA.set(key(r), (countA.get(key(r)) || 0) + 1);
  for (const r of b) countB.set(key(r), (countB.get(key(r)) || 0) + 1);
  const removed = [...countA.keys()].filter((k) => (countB.get(k) || 0) < countA.get(k));
  const added = [...countB.keys()].filter((k) => (countA.get(k) || 0) < countB.get(k));

  // Order among rules that could meet on one element at equal specificity.
  const positionB = new Map();
  b.forEach((r, i) => {
    const k = key(r);
    if (!positionB.has(k)) positionB.set(k, []);
    positionB.get(k).push(i);
  });
  const reordered = [];
  // A `> *` rule can meet anything in principle and almost nothing in practice;
  // its swaps are reported for the render diff to settle rather than failing here.
  const universalReorders = [];
  const info = a.map((r) => ({
    r,
    k: key(r),
    spec: specificity(r.selector.split(",")[0]).join(","),
    targets: targetsOf(r.selector),
    families: familiesOf(r.declarations),
  }));
  for (let i = 0; i < info.length; i++) {
    for (let j = i + 1; j < info.length; j++) {
      const x = info[i];
      const y = info[j];
      if (x.spec !== y.spec || (x.r.atRule || "") !== (y.r.atRule || "")) continue;
      if (!mayCollide(x, y)) continue;
      const px = positionB.get(x.k);
      const py = positionB.get(y.k);
      if (!px || !py) continue;
      if (Math.min(...px) > Math.max(...py)) {
        const universal = [...x.targets, ...y.targets].some((t) => t.startsWith("*"));
        (universal ? universalReorders : reordered).push({ first: x.r.selector, second: y.r.selector, spec: x.spec });
      }
    }
  }
  return { removed, added, reordered, universalReorders, before: a.length, after: b.length };
}

export function summarize({ removed, added, reordered, universalReorders = [], before, after }, allowRemoved = false) {
  const lines = [`  ${before} rules before, ${after} after.`];
  if (universalReorders.length) lines.push(`  NOTE     ${universalReorders.length} equal-specificity swaps involve a universal selector; settle them with a render diff.`);
  for (const r of removed.slice(0, 40)) lines.push(`  ${allowRemoved ? "REMOVED " : "LOST    "} ${r}`);
  if (removed.length > 40) lines.push(`  ... ${removed.length - 40} more`);
  for (const r of added.slice(0, 40)) lines.push(`  ADDED    ${r}`);
  if (added.length > 40) lines.push(`  ... ${added.length - 40} more`);
  for (const r of reordered.slice(0, 40)) lines.push(`  REORDER  (${r.spec}) "${r.first}" now follows "${r.second}"`);
  if (reordered.length > 40) lines.push(`  ... ${reordered.length - 40} more`);
  const ok = (allowRemoved || removed.length === 0) && reordered.length === 0;
  lines.push(ok ? "  PASS  no lost rules and no equal-specificity reorder." : "  FAIL  the move changed what a browser could see.");
  return { ok, text: lines.join("\n") };
}

// ── Impure shell ────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const [beforePath, afterPath] = args;
  const allowRemoved = args.includes("--allow-removed");
  const result = guard(readFileSync(beforePath, "utf-8"), readFileSync(afterPath, "utf-8"));
  const { ok, text } = summarize(result, allowRemoved);
  console.log(text);
  const jsonAt = args.indexOf("--json");
  if (jsonAt !== -1) writeFileSync(args[jsonAt + 1], JSON.stringify(result, null, 2));
  process.exit(ok ? 0 : 1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

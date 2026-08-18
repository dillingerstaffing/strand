#!/usr/bin/env node
// CSS usage: which rules in the stylesheets can never match markup that any
// known source emits, and (with --write) their removal.
//
// A strand class is USED when a source in the corpus mentions it literally,
// or composes it at runtime from a prefix (`strand-btn--${variant}`); a
// `data-strand-*` attribute likewise. A selector branch is DEAD when any
// strand class or attribute it needs is unused; a rule dies when every branch
// does; an at-rule block dies when every rule inside it does. Branches with
// no strand class are not ours to judge and stay. Branches that also carry a
// non-strand class are kept and listed for review.
//
// The corpus is every source in this repository that can emit markup (the
// component packages, the vanilla runtime, the docs site, the examples), plus
// any consumer roots passed in, so a rule a real site depends on is never
// judged from the library alone.
//
//   pnpm css-usage                              gate: library sources + consumer-usage.json
//   pnpm css-usage --write                      also delete what is unused
//   pnpm css-usage --corpus <dir>...            add consumer roots for this run
//   pnpm css-usage --export-consumer <name> --corpus <dir>...
//                                               record a consumer's usage in consumer-usage.json
//
// consumer-usage.json is written from inside each consumer's checkout, so the
// gate can run here without knowing where any consumer lives.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { splitComments } from "./component-audit.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const UI = join(ROOT, "packages/strand-ui/src");
const CONSUMER_USAGE = join(ROOT, "consumer-usage.json");

const CORPUS_ROOTS = [
  "packages/strand-ui/src",
  "packages/strand-vue/src",
  "packages/strand-svelte/src",
  "packages/cli/src",
  "packages/strand-examples/agent-dashboard/src",
  "docs/src",
  // The design language and the migration guides are contracts: a class the
  // specification prescribes or a guide maps to is in use.
  "docs/design-language.md",
  "docs/migration",
  "examples",
];
const CORPUS_EXT = new Set([".html", ".js", ".mjs", ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".css", ".md"]);
const SKIP_DIR = new Set(["node_modules", "dist", "generated", "vendor", "__snapshots__", "__tests__", "test-results", "assets", "tests", ".git"]);
const SKIP_FILE = /\.(test|spec|e2e|fixtures)\.[a-z]+$|\.snap$|\.d\.ts$|strand-(ui|tokens|reset|base|fonts)\.css$|strand-ui(\.min)?\.js$/;

// ── Pure decision layer ─────────────────────────────────────────────────

const CLASS_TOKEN = /strand-[a-z0-9]+(?:[-_]+[a-z0-9]+)*/g;
const ATTR_TOKEN = /data-strand-[a-z0-9]+(?:-[a-z0-9]+)*/g;
const PREFIX_PATTERNS = [
  /(strand-[a-z0-9_-]*)\$\{/g, // template literal
  /(strand-[a-z0-9_-]*)\{(?!\{)/g, // svelte class="strand-x--{size}"
  /(strand-[a-z0-9_-]*)["'`]\s*\+/g, // string concatenation
];

function commentFree(file, text) {
  if (/\.(js|mjs|jsx|ts|tsx)$/.test(file)) return splitComments(text).code;
  return text.replace(/<!--[\s\S]*?-->/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");
}

/** The text of one class expression starting at `from`: a quoted string, or a balanced brace or paren group. */
function classExpression(code, from) {
  const open = code[from];
  const close = { "{": "}", "(": ")", '"': '"', "'": "'", "`": "`" }[open];
  if (!close) return "";
  if (open === "{" || open === "(") {
    let depth = 0;
    for (let i = from; i < code.length; i++) {
      if (code[i] === open) depth++;
      else if (code[i] === close && --depth === 0) return code.slice(from, i + 1);
    }
    return code.slice(from);
  }
  // A template literal may nest `${...}` with its own quotes; walk it by depth too.
  if (open === "`") {
    let depth = 0;
    for (let i = from + 1; i < code.length; i++) {
      if (code[i] === "$" && code[i + 1] === "{") depth++;
      else if (code[i] === "}" && depth > 0) depth--;
      else if (code[i] === "`" && depth === 0) return code.slice(from, i + 1);
    }
    return code.slice(from);
  }
  const end = code.indexOf(close, from + 1);
  return end === -1 ? code.slice(from) : code.slice(from, end + 1);
}

/** A class token as the move guard sees it: the block or element, modifier stripped. */
const targetOf = (cls) => cls.split("--")[0];

/**
 * The pairs of blocks that the sources put on ONE element: every class
 * expression (`class="..."`, `className={...}`, `class=${...}`, `cx(...)`) with
 * two or more distinct targets, plus a class handed to a component paired with
 * the block that component renders (`componentBlocks`: Name -> block).
 * @param {{file: string, text: string}[]} sources
 * @param {Record<string, string>} componentBlocks
 * @returns {[string, string][]} sorted unordered pairs
 */
export function collectPairs(sources, componentBlocks = {}) {
  const pairs = new Set();
  const record = (targets) => {
    const list = [...new Set(targets)].sort();
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) pairs.add(`${list[i]} ${list[j]}`);
  };
  const componentNames = Object.keys(componentBlocks);
  const OPENERS = /\b(?:class(?:Name)?\s*=\s*|cx\()/g;
  for (const { file, text } of sources) {
    const code = commentFree(file, text);
    // A component only counts where the file imports it by name; `<Tag>` as a
    // local polymorphic alias is not the Tag component.
    const imported = new Set(componentNames.filter((n) => new RegExp(`import[^;]*\\b${n}\\b[^;]*from`).test(code)));
    for (const m of code.matchAll(OPENERS)) {
      const at = m.index + m[0].length;
      const start = m[0].startsWith("cx(") ? at - 1 : code[at] === "$" && code[at + 1] === "{" ? at + 1 : at;
      const expr = classExpression(code, start);
      const targets = [...expr.matchAll(CLASS_TOKEN)].map((t) => targetOf(t[0]));
      // The element that carries the expression may be a component that renders its own block.
      if (componentNames.length && !m[0].startsWith("cx(")) {
        const tagStart = code.lastIndexOf("<", m.index);
        const tag = tagStart === -1 ? "" : code.slice(tagStart, m.index);
        const name = tag.match(/^<\$?\{?([A-Z][A-Za-z0-9]*)/)?.[1];
        if (name && imported.has(name)) targets.push(componentBlocks[name]);
      }
      if (targets.length >= 2) record(targets);
    }
  }
  return [...pairs].sort().map((p) => p.split(" "));
}

/**
 * Every strand class, dynamic prefix and data attribute the sources mention.
 * @param {{file: string, text: string}[]} sources
 */
export function collectUsage(sources) {
  const literals = new Set();
  const prefixes = new Set();
  const attributes = new Set();
  for (const { file, text } of sources) {
    const code = commentFree(file, text);
    for (const m of code.matchAll(CLASS_TOKEN)) literals.add(m[0]);
    for (const m of code.matchAll(ATTR_TOKEN)) attributes.add(m[0]);
    for (const re of PREFIX_PATTERNS) {
      // Only a partial token composes a class: `strand-btn--${v}` does,
      // `strand-btn${on ? " strand-btn--on" : ""}` merely appends a literal.
      for (const m of code.matchAll(re)) if (/[-_]$/.test(m[1])) prefixes.add(m[1]);
    }
  }
  return { literals, prefixes, attributes };
}

/** Fold recorded consumer usage into a usage set. */
export function mergeUsage(usage, recorded) {
  for (const c of recorded.classes || []) usage.literals.add(c);
  for (const p of recorded.prefixes || []) usage.prefixes.add(p);
  for (const a of recorded.attributes || []) usage.attributes.add(a);
  return usage;
}

/** A class is used when mentioned literally or produced by a dynamic prefix. */
export function isUsed(cls, usage) {
  if (usage.literals.has(cls)) return true;
  for (const p of usage.prefixes) if (cls.startsWith(p) && cls.length > p.length) return true;
  return false;
}

/** The strand classes, data attributes and foreign classes one selector branch needs. */
export function selectorClasses(branch) {
  // A class inside :not() is a condition the element must lack; the branch
  // still matches without it, so it does not make the branch dead.
  const needed = branch.replace(/:not\([^)]*\)/g, "");
  const classes = [...needed.matchAll(/\.(strand-[A-Za-z0-9_-]+)/g)].map((m) => m[1]);
  const foreignClasses = [...needed.matchAll(/\.((?!strand-)[A-Za-z_][\w-]*)/g)].map((m) => m[1]);
  const attributes = [...needed.matchAll(/\[(data-strand-[a-z0-9-]+)/g)].map((m) => m[1]);
  return { classes, attributes, foreignClasses };
}

/** "live", "dead", or "review" for one selector branch. */
export function branchVerdict(branch, usage) {
  const { classes, attributes, foreignClasses } = selectorClasses(branch);
  for (const c of classes) if (!isUsed(c, usage)) return "dead";
  for (const a of attributes) if (!usage.attributes.has(a) && !usage.literals.has(a)) return "dead";
  if (classes.length === 0 && attributes.length === 0) return "live";
  return foreignClasses.length ? "review" : "live";
}

/** Split a selector list on top-level commas only. */
function branches(selector) {
  const out = [];
  let depth = 0;
  let buf = "";
  for (const ch of selector) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(buf.trim());
      buf = "";
      continue;
    }
    buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

/** Top-level blocks of a stylesheet, each with the whitespace and comments that lead it. */
function segments(css) {
  const out = [];
  let depth = 0;
  let start = 0;
  let inComment = false;
  for (let i = 0; i < css.length; i++) {
    if (!inComment && css.startsWith("/*", i)) {
      inComment = true;
      i++;
      continue;
    }
    if (inComment) {
      if (css.startsWith("*/", i)) {
        inComment = false;
        i++;
      }
      continue;
    }
    const ch = css[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        out.push(css.slice(start, i + 1));
        start = i + 1;
      }
    } else if (ch === ";" && depth === 0) {
      out.push(css.slice(start, i + 1));
      start = i + 1;
    }
  }
  return { blocks: out, tail: css.slice(start) };
}

const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "");

function pruneBlocks(css, usage, atRule, removed, review) {
  const { blocks, tail } = segments(css);
  const kept = [];
  for (const block of blocks) {
    const bare = stripComments(block).trim();
    if (!bare) continue;
    if (!bare.includes("{")) {
      kept.push(block); // @import, @layer statement, @charset
      continue;
    }
    const prelude = bare.slice(0, bare.indexOf("{")).trim();
    if (prelude.startsWith("@")) {
      if (/^@(keyframes|font-face|property|counter-style|page)/.test(prelude)) {
        kept.push(block);
        continue;
      }
      const open = block.indexOf("{");
      const close = block.lastIndexOf("}");
      const inner = pruneBlocks(block.slice(open + 1, close), usage, prelude, removed, review);
      if (stripComments(inner).trim()) kept.push(`${block.slice(0, open + 1)}${inner}${block.slice(close)}`);
      continue;
    }
    const live = [];
    for (const b of branches(prelude)) {
      const verdict = branchVerdict(b, usage);
      if (verdict === "dead") removed.push({ selector: b, atRule });
      else live.push(b);
      if (verdict === "review") review.push({ selector: b, atRule });
    }
    if (live.length === 0) continue;
    if (live.length === branches(prelude).length) {
      kept.push(block);
      continue;
    }
    // Rewrite the selector list to the surviving branches, keeping the lead.
    const lead = block.slice(0, block.indexOf(prelude.split(/\s+/)[0]));
    const body = block.slice(block.indexOf("{"));
    const separator = prelude.includes(",\n") ? ",\n" : ", ";
    kept.push(`${lead}${live.join(separator)} ${body}`);
  }
  return kept.join("") + tail;
}

/**
 * Remove every dead branch, rule and emptied at-rule block.
 * @returns {{css: string, removed: {selector: string, atRule: string|null}[], review: {selector: string, atRule: string|null}[]}}
 */
export function prune(css, usage) {
  const removed = [];
  const review = [];
  const out = pruneBlocks(css, usage, null, removed, review);
  return { css: out, removed, review };
}

/** Keyframe names no rule in the stylesheet animates. */
export function unusedKeyframes(css) {
  const bare = stripComments(css);
  const defined = [...bare.matchAll(/@keyframes\s+([A-Za-z0-9_-]+)/g)].map((m) => m[1]);
  const used = new Set();
  for (const m of bare.matchAll(/animation(?:-name)?\s*:\s*([^;}]+)/g)) {
    for (const t of m[1].split(/[\s,]+/)) if (defined.includes(t)) used.add(t);
  }
  return defined.filter((n) => !used.has(n));
}

export function summarize(rows, totalRules) {
  if (rows.length === 0) return { ok: false, text: "  FAIL  scanned zero stylesheets." };
  const lines = [];
  let removed = 0;
  const reviewClasses = new Map();
  for (const r of rows) {
    removed += r.removed.length;
    if (r.removed.length) lines.push(`  ${r.file.padEnd(52)} ${r.removed.length} unused`);
    for (const x of r.removed.slice(0, 200)) lines.push(`      ${x.atRule ? `${x.atRule} :: ` : ""}${x.selector}`);
    for (const x of r.review) {
      const { foreignClasses } = selectorClasses(x.selector);
      for (const c of foreignClasses) reviewClasses.set(c, (reviewClasses.get(c) || 0) + 1);
    }
  }
  if (reviewClasses.size) {
    lines.push("");
    lines.push("  branches kept for review because they carry a non-strand class:");
    for (const [c, n] of [...reviewClasses.entries()].sort((a, b) => b[1] - a[1])) lines.push(`      .${c} (${n})`);
  }
  lines.push("");
  lines.push(`  ${rows.length} stylesheets, ${totalRules} rules: ${removed} selector branches match nothing any known source emits.`);
  return { ok: removed === 0, text: lines.join("\n") };
}

// ── Impure shell ────────────────────────────────────────────────────────

function walk(dir, out) {
  if (!existsSync(dir)) return;
  if (statSync(dir).isFile()) {
    out.push(dir);
    return;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIR.has(entry.name)) walk(join(dir, entry.name), out);
      continue;
    }
    if (!CORPUS_EXT.has(extname(entry.name))) continue;
    if (SKIP_FILE.test(entry.name)) continue;
    out.push(join(dir, entry.name));
  }
}

function corpusFiles(extraRoots) {
  const files = [];
  for (const r of CORPUS_ROOTS) walk(join(ROOT, r), files);
  for (const r of extraRoots) walk(r, files);
  return files;
}

function stylesheets() {
  const out = [];
  const componentsDir = join(UI, "components");
  for (const d of readdirSync(componentsDir, { withFileTypes: true }).filter((e) => e.isDirectory())) {
    const p = join(componentsDir, d.name, `${d.name}.css`);
    if (existsSync(p)) out.push(p);
  }
  for (const f of ["typography.css", "utilities.css", "static.css"]) {
    const p = join(UI, f);
    if (existsSync(p)) out.push(p);
  }
  out.push(join(ROOT, "packages/tokens/css/base.css"));
  return out;
}

/**
 * Component name -> the block its root element renders, read from the Preact
 * fixture snapshots, so a class handed to `<Link className=...>` is known to
 * land beside `strand-link`.
 */
export function componentBlocks() {
  const out = {};
  const componentsDir = join(UI, "components");
  if (!existsSync(componentsDir)) return out;
  for (const d of readdirSync(componentsDir, { withFileTypes: true }).filter((e) => e.isDirectory())) {
    const snap = join(componentsDir, d.name, "__snapshots__", `${d.name}.test.tsx.snap`);
    if (!existsSync(snap)) continue;
    const m = readFileSync(snap, "utf-8").match(/exports\[`renders > [^`]*`\] = `"<[a-z][^>]*?class="(strand-[a-z0-9_-]+)/);
    if (m) out[d.name] = m[1].split("--")[0];
  }
  return out;
}

/** The block pairs the library's own sources compose on one element. */
export function libraryPairs() {
  return collectPairs(readSources(corpusFiles([])), componentBlocks());
}

function readSources(files) {
  // Only markup-emitting sources decide usage; a stylesheet naming a class as
  // context is not a use, so library stylesheets are excluded.
  return files.filter((f) => !f.endsWith(".css") || f.includes("/docs/") || f.includes("/examples/")).map((f) => ({ file: f, text: readFileSync(f, "utf-8") }));
}

function exportConsumer(name, roots) {
  const files = [];
  for (const r of roots) walk(r, files);
  const usage = collectUsage(readSources(files));
  const record = existsSync(CONSUMER_USAGE) ? JSON.parse(readFileSync(CONSUMER_USAGE, "utf-8")) : { description: "", consumers: {} };
  record.description =
    "Strand classes, dynamic class prefixes, data attributes and the class pairs composed on one element that each known consumer emits, recorded from inside that consumer's checkout with `pnpm css-usage --export-consumer <name> --corpus <dir>...`. The css-usage gate reads the classes so a rule a real site depends on is never judged from the library alone; css-move-guard reads the pairs so two blocks a site composes on one element are known to meet.";
  const pairs = collectPairs(readSources(files), componentBlocks());
  record.consumers[name] = {
    classes: [...usage.literals].sort(),
    prefixes: [...usage.prefixes].sort(),
    attributes: [...usage.attributes].sort(),
    pairs,
  };
  writeFileSync(CONSUMER_USAGE, `${JSON.stringify(record, null, "\t")}\n`);
  console.log(`  recorded ${usage.literals.size} classes, ${usage.prefixes.size} prefixes, ${usage.attributes.size} attributes, ${pairs.length} class pairs for "${name}" from ${files.length} sources.`);
}

function main() {
  const args = process.argv.slice(2);
  const write = args.includes("--write");
  const extra = [];
  let exportName = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--corpus") extra.push(resolve(args[++i]));
    if (args[i] === "--export-consumer") exportName = args[++i];
  }
  for (const p of (process.env.STRAND_CONSUMERS || "").split(":").filter(Boolean)) extra.push(resolve(p));
  if (exportName) {
    exportConsumer(exportName, extra);
    return;
  }

  const sources = readSources(corpusFiles(extra));
  const usage = collectUsage(sources);
  const recorded = existsSync(CONSUMER_USAGE) ? JSON.parse(readFileSync(CONSUMER_USAGE, "utf-8")).consumers || {} : {};
  for (const r of Object.values(recorded)) mergeUsage(usage, r);
  const short = [...usage.prefixes].filter((p) => p.length <= "strand-".length + 1);

  console.log("\n── CSS usage ──\n");
  console.log(`  corpus: ${sources.length} sources, ${Object.keys(recorded).length} recorded consumers, ${extra.length} consumer roots: ${usage.literals.size} classes, ${usage.prefixes.size} dynamic prefixes, ${usage.attributes.size} attributes.`);
  if (short.length) console.log(`  WARN  dynamic prefixes ${short.map((p) => `"${p}"`).join(", ")} keep almost everything alive; narrow the source that composes them.`);

  const rows = [];
  let totalRules = 0;
  for (const path of stylesheets()) {
    const css = readFileSync(path, "utf-8");
    totalRules += (stripComments(css).match(/\{/g) || []).length;
    const { css: out, removed, review } = prune(css, usage);
    rows.push({ file: relative(ROOT, path), removed, review });
    if (write && removed.length) writeFileSync(path, out);
  }
  const { ok, text } = summarize(rows, totalRules);
  console.log(text);
  if (!ok && !write) console.log("  FAIL  delete them (pnpm css-usage --write), or record the consumer that uses them.");
  if (write) {
    for (const path of stylesheets()) {
      const kf = unusedKeyframes(readFileSync(path, "utf-8"));
      if (kf.length) console.log(`  keyframes without an animator in ${relative(ROOT, path)}: ${kf.join(", ")}`);
    }
    console.log(`\n  wrote ${rows.filter((r) => r.removed.length).length} stylesheets.`);
  }
  const jsonAt = args.indexOf("--json");
  if (jsonAt !== -1) writeFileSync(args[jsonAt + 1], `${JSON.stringify({ rows, literals: [...usage.literals].sort(), prefixes: [...usage.prefixes].sort() }, null, 2)}\n`);
  process.exit(ok || write ? 0 : 1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

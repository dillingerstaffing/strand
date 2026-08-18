#!/usr/bin/env node
// Every `cf: <slug>` pointer in source resolves to docs/cf/<slug>.md, and
// every article is pointed at by at least one source file.
//
//   pnpm cf-check

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CF = join(ROOT, "docs/cf");
const SCAN = ["packages/strand-ui/src", "packages/strand-vue/src", "packages/strand-svelte/src", "packages/tokens", "scripts"];
const EXT = /\.(tsx?|mjs|js|css|vue|svelte)$/;

// ── Pure decision layer ─────────────────────────────────────────────────

/** Every slug a source names, in order of appearance. */
export function pointersIn(source) {
  return [...source.matchAll(/\bcf:\s*([a-z0-9][a-z0-9-]*)/g)].map((m) => m[1]);
}

/**
 * @param {Map<string, string[]>} pointersByFile file -> slugs
 * @param {Set<string>} articles slugs that exist
 */
export function classify(pointersByFile, articles) {
  const dangling = [];
  const referenced = new Set();
  for (const [file, slugs] of pointersByFile) {
    for (const slug of slugs) {
      referenced.add(slug);
      if (!articles.has(slug)) dangling.push({ file, slug });
    }
  }
  const orphans = [...articles].filter((a) => !referenced.has(a) && a !== "README").sort();
  return { dangling, orphans, referenced: [...referenced].sort() };
}

export function summarize({ dangling, orphans, referenced }, articleCount) {
  const lines = [`  ${articleCount} articles, ${referenced.length} referenced.`];
  for (const d of dangling) lines.push(`  DANGLING  ${d.file} points at cf: ${d.slug}, which has no article.`);
  for (const o of orphans) lines.push(`  ORPHAN    docs/cf/${o}.md is pointed at by nothing.`);
  const ok = dangling.length === 0 && orphans.length === 0;
  lines.push(ok ? "  PASS  every pointer resolves and every article is used." : "  FAIL  add the article, or delete the pointer or the article.");
  return { ok, text: lines.join("\n") };
}

// ── Impure shell ────────────────────────────────────────────────────────

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    // The checker's own tests carry pointer-shaped fixtures.
    if (entry === "node_modules" || entry === "dist" || entry === "__tests__" || entry.startsWith(".")) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (EXT.test(entry)) yield p;
  }
}

function main() {
  console.log("\n── Invariant pointers ──\n");
  const articles = new Set(
    existsSync(CF) ? readdirSync(CF).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")) : [],
  );
  const pointersByFile = new Map();
  for (const root of SCAN) {
    const abs = join(ROOT, root);
    if (!existsSync(abs)) continue;
    for (const file of walk(abs)) {
      const slugs = pointersIn(readFileSync(file, "utf-8"));
      if (slugs.length) pointersByFile.set(relative(ROOT, file), slugs);
    }
  }
  const { ok, text } = summarize(classify(pointersByFile, articles), articles.size - (articles.has("README") ? 1 : 0));
  console.log(text);
  process.exit(ok ? 0 : 1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

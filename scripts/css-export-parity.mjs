#!/usr/bin/env node
// Every component stylesheet in the bundle must belong to something a
// consumer can actually use.
//
// The gap this closes: the two pipelines disagree about what a component is.
// CSS is GLOB-INCLUDED -- packages/strand-ui/vite.config.ts walks
// components/<Dir>/ and concatenates <Dir>.css into dist/css/strand-ui.css
// with no reference to exports at all. JavaScript is EXPORT-GATED, by
// packages/strand-ui/src/index.ts. So a component that is written but not
// exported ships its stylesheet to every consumer on every page while its
// component is absent from the bundle, and nothing notices.
//
// That is not hypothetical. CommandPalette landed with 13 rules, 1,218 bytes
// gzipped, in a 54 KB gzipped bundle: about 2.2% of the CSS every consumer
// downloads, for a component none of them could import. It reached a
// downstream repo's main branch inside a commit about something else, which
// is exactly how a cost like this becomes permanent -- nobody is looking at a
// diff of the generated bundle.
//
// THE DISTINCTION THAT MAKES THIS CHECK CORRECT, and the reason it is not a
// one-line "every CSS has an export": a CSS-ONLY primitive is legitimate and
// this system has one. Banner ships Banner.css and Banner.test.tsx and NO
// component, deliberately, because its consumer injects the markup
// server-side (an HTMLRewriter writing .strand-banner into the document
// before first paint) and never mounts a component at all. For the CSS-only
// and Bulma/Bootstrap consumer types the classes ARE the API. A naive guard
// would have condemned Banner, and whoever ran it would have either deleted a
// working primitive or, more likely, disabled the check.
//
// So the invariant is: every component stylesheet in the bundle is EITHER
// backed by an exported component OR declared css-only. Declaring is cheap
// and deliberate; forgetting is what costs bytes.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const COMPONENTS_DIR = join(ROOT, "packages/strand-ui/src/components");
const INDEX_TS = join(ROOT, "packages/strand-ui/src/index.ts");
const MANIFEST = join(ROOT, "parity-manifest.json");

// ── Pure decision layer ─────────────────────────────────────────────────

/**
 * Which component directories does index.ts re-export?
 * Matches the one form this file uses: `from "./components/<Dir>/index.js"`.
 */
export function parseExportedComponents(indexSource) {
  const re = /from\s+"\.\/components\/([A-Za-z0-9_]+)\/index\.js"/g;
  const found = new Set();
  let m = re.exec(indexSource);
  while (m !== null) {
    found.add(m[1]);
    m = re.exec(indexSource);
  }
  return found;
}

/**
 * Decide the fate of every component that contributes CSS.
 *
 * @param {{name: string, gzipBytes: number}[]} cssComponents
 *   Components that DO contribute a stylesheet to the bundle.
 * @param {Set<string>} exported     Components re-exported from index.ts.
 * @param {Set<string>} declaredCssOnly  Components declared css-only.
 * @returns {{orphans: object[], cssOnly: string[], backed: string[], staleDeclarations: string[]}}
 */
export function classifyCssComponents(cssComponents, exported, declaredCssOnly) {
  const orphans = [];
  const cssOnly = [];
  const backed = [];

  for (const c of cssComponents) {
    if (exported.has(c.name)) {
      backed.push(c.name);
      continue;
    }
    if (declaredCssOnly.has(c.name)) {
      cssOnly.push(c.name);
      continue;
    }
    orphans.push(c);
  }

  // A declaration that names an EXPORTED component is stale rather than
  // harmless: it says "this ships CSS with no component" about something that
  // now has one, so it would keep a future orphan of the same name invisible.
  const staleDeclarations = [...declaredCssOnly].filter((n) => exported.has(n));

  return { orphans, cssOnly, backed, staleDeclarations };
}

/** Human-readable verdict. Pure, so it is testable without a filesystem. */
export function summarize({ orphans, cssOnly, backed, staleDeclarations }, bundleGzip) {
  const lines = [];
  lines.push(
    `  ${backed.length} component stylesheets backed by an export, ${cssOnly.length} declared css-only.`,
  );
  for (const s of staleDeclarations) {
    lines.push(
      `  STALE  ${s} is declared css-only but IS exported. Remove it from cssOnlyComponents.`,
    );
  }
  for (const o of orphans) {
    const pct = bundleGzip ? ((o.gzipBytes / bundleGzip) * 100).toFixed(1) : "?";
    lines.push(
      `  ORPHAN ${o.name}: ships ${o.gzipBytes} B gzipped (${pct}% of the bundle) and is neither exported nor declared css-only.`,
    );
  }
  const ok = orphans.length === 0 && staleDeclarations.length === 0;
  lines.push(
    ok
      ? "  PASS  every component stylesheet is reachable by some consumer."
      : "  FAIL  export the component, or declare it in parity-manifest.json#/cssOnlyComponents with a reason.",
  );
  return { ok, text: lines.join("\n") };
}

// ── Impure shell ────────────────────────────────────────────────────────

function readCssComponents() {
  const dirs = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const out = [];
  for (const name of dirs) {
    // Mirror vite.config.ts exactly: <Dir>/<Dir>.css is the glob it uses.
    const cssPath = join(COMPONENTS_DIR, name, `${name}.css`);
    if (!existsSync(cssPath)) continue;
    const raw = readFileSync(cssPath);
    out.push({ name, gzipBytes: gzipSync(raw).length });
  }
  return out;
}

function main() {
  console.log("\n── CSS / export parity ──\n");

  const cssComponents = readCssComponents();
  // An empty scan is a failure, not a pass. If the glob or the path ever
  // moves, this check would otherwise report success having inspected
  // nothing, which is the failure mode it exists to prevent in others.
  if (cssComponents.length === 0) {
    console.error(
      `  FAIL  no component stylesheets found under ${COMPONENTS_DIR}. The layout of this package changed and this check is no longer measuring anything.`,
    );
    process.exit(1);
  }

  const exported = parseExportedComponents(readFileSync(INDEX_TS, "utf-8"));
  if (exported.size === 0) {
    console.error(
      "  FAIL  parsed zero exports from index.ts. The export form changed and this check would pass everything.",
    );
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(MANIFEST, "utf-8"));
  const declared = new Set(
    (manifest.cssOnlyComponents || []).map((e) => (typeof e === "string" ? e : e.name)),
  );

  const bundlePath = join(ROOT, "packages/strand-ui/dist/css/strand-ui.css");
  const bundleGzip = existsSync(bundlePath)
    ? gzipSync(readFileSync(bundlePath)).length
    : 0;

  const result = classifyCssComponents(cssComponents, exported, declared);
  const { ok, text } = summarize(result, bundleGzip);
  console.log(text);
  console.log("");
  process.exit(ok ? 0 : 1);
}

if (process.argv[1] && process.argv[1].endsWith("css-export-parity.mjs")) {
  main();
}

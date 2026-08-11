#!/usr/bin/env node
// Every component a consumer can import has a test, in every package that
// ships it.
//
// The gap this closes, stated as what it cost rather than as a principle:
// CommandPalette was published to npm across every consumer type with ZERO
// tests on its canonical Preact implementation, while every other component in
// that package carried one. The result was a live, user-facing defect. A
// keyboard user could not type into the command palette, because Dialog
// focuses the first focusable element in its panel and that is its own close
// button, so a visitor opened a search overlay and typed into a button. Two
// reviewers looked at that release. Both checked parity, docs, bundle size and
// the tests that DID exist, and neither noticed the absence of a file.
//
// An absence is the hardest thing to see in a diff, which is why it needs a
// machine rather than a habit.
//
// This is the sibling of css-export-parity.mjs and the same shape: two things
// that should imply each other, with nothing checking. There it was stylesheet
// and export; here it is export and test.
//
// THE ESCAPE HATCH IS THE IMPORTANT HALF, and it is not a concession. Some
// components have no behaviour jsdom can evaluate. ActionDock is a positioning
// primitive: fixed to the viewport, carrying a safe-area inset, revealed by an
// attribute. jsdom reports zero for every box, so a jsdom test of it could
// only assert that classes are spelled correctly, which is a test that passes
// while the dock sits off screen. Its real contract is asserted in the layout
// tier, against real Chromium, where a PAIR of bounds proves it is inside the
// thumb zone rather than merely below its start.
//
// Demanding a jsdom test there would produce a worthless one, and a rule that
// forces people to write worthless tests is a rule that gets deleted. So a
// component may instead DECLARE the tier that covers it, and the declaration
// names that tier so a reader can go and check.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseExportedComponents } from "./css-export-parity.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = join(ROOT, "parity-manifest.json");

// Each framework package, and what a test file looks like there.
const PACKAGES = [
  { name: "strand-ui", dir: "packages/strand-ui/src/components", suffixes: [".test.tsx", ".test.ts"] },
  { name: "strand-vue", dir: "packages/strand-vue/src/components", suffixes: [".test.ts"] },
  { name: "strand-svelte", dir: "packages/strand-svelte/src/components", suffixes: [".test.ts"] },
];

// ── Pure decision layer ─────────────────────────────────────────────────

/**
 * Decide which shipped components lack a test.
 *
 * @param {{pkg: string, name: string, hasTest: boolean}[]} components
 * @param {Map<string, string>} declared  component -> tier that covers it
 * @returns {{untested: object[], covered: object[], tested: object[], staleDeclarations: string[]}}
 */
export function classifyComponentTests(components, declared) {
  const untested = [];
  const covered = [];
  const tested = [];

  for (const c of components) {
    if (c.hasTest) {
      tested.push(c);
      continue;
    }
    if (declared.has(c.name)) {
      covered.push({ ...c, tier: declared.get(c.name) });
      continue;
    }
    untested.push(c);
  }

  // A declaration for a component that is tested everywhere it ships is stale.
  // Not cosmetic: it would keep a future untested port of the same component
  // invisible, which is exactly the hole this check exists to close.
  const namesMissingSomewhere = new Set(components.filter((c) => !c.hasTest).map((c) => c.name));
  const staleDeclarations = [...declared.keys()].filter((n) => !namesMissingSomewhere.has(n));

  return { untested, covered, tested, staleDeclarations };
}

/** Human-readable verdict. Pure, so it is testable without a filesystem. */
export function summarize({ untested, covered, tested, staleDeclarations }) {
  const lines = [];
  lines.push(`  ${tested.length} component implementations tested, ${covered.length} covered by a browser tier.`);
  for (const s of staleDeclarations) {
    lines.push(
      `  STALE  ${s} is declared browser-tier-only but is tested everywhere it ships. Remove it from browserTierOnlyComponents.`,
    );
  }
  for (const u of untested) {
    lines.push(`  UNTESTED  ${u.pkg} ships ${u.name} with no test file.`);
  }
  const ok = untested.length === 0 && staleDeclarations.length === 0;
  lines.push(
    ok
      ? "  PASS  every shipped component implementation is tested or declared."
      : "  FAIL  add a test, or declare it in parity-manifest.json#/browserTierOnlyComponents naming the tier that covers it.",
  );
  return { ok, text: lines.join("\n") };
}

// ── Impure shell ────────────────────────────────────────────────────────

function collectComponents(exported) {
  const out = [];
  for (const pkg of PACKAGES) {
    const base = join(ROOT, pkg.dir);
    if (!existsSync(base)) continue;
    for (const name of readdirSync(base, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)) {
      // strand-ui is the canonical package and its exports are the source of
      // truth for "a consumer can import this". The other packages mirror it,
      // so a directory there is itself the shipping signal.
      if (pkg.name === "strand-ui" && !exported.has(name)) continue;
      const files = readdirSync(join(base, name));
      const hasTest = files.some((f) => pkg.suffixes.some((s) => f.endsWith(s)));
      out.push({ pkg: pkg.name, name, hasTest });
    }
  }
  return out;
}

function main() {
  console.log("\n── Component test parity ──\n");

  const exported = parseExportedComponents(
    readFileSync(join(ROOT, "packages/strand-ui/src/index.ts"), "utf-8"),
  );
  if (exported.size === 0) {
    console.error(
      "  FAIL  parsed zero exports from index.ts. The export form changed and this check would inspect nothing.",
    );
    process.exit(1);
  }

  const components = collectComponents(exported);
  // An empty scan is a failure, not a pass. If the package layout moves, this
  // check would otherwise report success having looked at nothing, which is
  // the failure mode it exists to catch in others.
  if (components.length === 0) {
    console.error("  FAIL  found no component directories. The package layout changed.");
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(MANIFEST, "utf-8"));
  const declared = new Map(
    (manifest.browserTierOnlyComponents || []).map((e) =>
      typeof e === "string" ? [e, "unspecified"] : [e.name, e.tier || "unspecified"],
    ),
  );

  const result = classifyComponentTests(components, declared);
  const { ok, text } = summarize(result);
  console.log(text);
  console.log("");
  process.exit(ok ? 0 : 1);
}

if (process.argv[1] && process.argv[1].endsWith("component-test-parity.mjs")) {
  main();
}

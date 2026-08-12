#!/usr/bin/env node
// The published performance budget must be a number something enforces.
//
// THE DEFECT THIS CLOSES IS NOT THE NUMBER. It is the claim of enforcement.
// docs/design-language.md 16.1 records "Total library size | < 50KB gzipped |
// **Build step validation**", and no build step validated it. `measure-bundle`
// wrote the measured figure into parity-manifest.json and exited 0 whatever it
// found, so the artifact drifted from 63 to 66 to 71 to 77 to 78 KB across a
// single day while a specification asserted both a limit and a gate. A budget
// nothing checks is a comment, and a comment that says "enforced" is worse
// than no comment.
//
// WHY THE BUDGET IS NOW TWO NUMBERS, which is the substantive change:
//
//   1. A TOTAL CEILING answers "what does a consumer download". It is the
//      honest consumer-facing figure and it must be raised deliberately.
//   2. A PER-COMPONENT AVERAGE answers "is the library still efficient". It
//      is the one that stays flat as the library grows.
//
// The second exists because the first, alone, is not a quality signal on a
// growing library. Measured: the CSS bundle is ~1.11 KB gzipped per component
// today. At the 31 components the library had when the 50 KB figure was
// written, that same efficiency produces roughly 47 KB -- under budget. So the
// library did not become wasteful, it became larger, and a total-only budget
// on a growing library has exactly two outcomes: it is raised on a schedule
// nobody reads, or it caps the library's size forever without saying so.
//
// A total-only budget also cannot see the failure that matters. One component
// shipping 12 KB of sloppy CSS moves a 78 KB total by 15% and looks like
// ordinary growth; it moves the per-component average immediately.
//
// Both are ratchets. Exceeding either fails, and raising either is an edit to
// this file in the same commit as the change that needs it, with the reason.
//
// Usage: pnpm test:bundle-budget

import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
// The artifact list comes from measure-bundle rather than being restated
// here. Two lists of "what the library ships" is the same shape as every
// other defect found today: a second derivation of one fact, correct until
// one of them moves. The gate must measure exactly what the manifest
// publishes, or the published number and the enforced number are different
// numbers with the same name.
import { measure } from "./measure-bundle.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");

/**
 * The budget. Raising a number here is a deliberate act and belongs in the
 * same commit as whatever needed the room, with the reason in the message.
 *
 * Headroom is stated rather than implied: a budget sitting exactly on the
 * measurement fails on the next whitespace change and gets switched off.
 */
export const BUDGET = {
  // Every consumer downloads the whole stylesheet: CSS is glob-concatenated
  // rather than tree-shaken, so this figure is the per-page cost and does NOT
  // fall when a consumer imports three components. That is why it is the
  // number worth guarding, and why the lever that would genuinely reduce it
  // is per-component CSS entry points, which the library does not have yet.
  totalGzKb: 85,
  // Gzipped CSS per component in the parity contract. The efficiency
  // invariant. Today ~1.11; the ceiling leaves room for a genuinely complex
  // primitive without leaving room for a careless one.
  cssKbPerComponent: 1.35,
  // The largest SINGLE component stylesheet, gzipped.
  //
  // An average cannot do this job, and I found that out by writing a test
  // that assumed it could: 12 KB of sloppy CSS in one component, spread
  // across 59 others, moves the average to 1.29 and passes a 1.35 ceiling.
  // Averages hide outliers, which is the whole reason outlier checks exist.
  //
  // Today's largest is InstrumentViewport at ~11.2 KB, and that figure is a
  // symptom rather than a baseline: it still contains nine foreign blocks
  // (the search overlay, the detail panel, the map pins and others) that
  // belong in components of their own. This ceiling is expected to FALL when
  // that debt is paid, and lowering it then is part of paying it.
  cssKbLargestComponent: 12,
};

// ── Pure decision layer ─────────────────────────────────────────────────

/**
 * Compare a measurement against the budget.
 *
 * @param {{totalGzBytes: number, cssGzBytes: number, componentCount: number}} m
 * @param {typeof BUDGET} budget
 */
export function evaluate(m, budget = BUDGET) {
  const failures = [];
  const readings = [];

  // A measurement of zero is a broken measurement, not a very good result.
  // This check exists to catch a budget nobody enforces; reporting success
  // because a path moved would be the same failure wearing a different hat.
  if (!(m.totalGzBytes > 0) || !(m.cssGzBytes > 0) || !(m.componentCount > 0)) {
    return {
      ok: false,
      failures: [
        "measured zero bytes or zero components, so nothing was actually checked",
      ],
      readings: [],
    };
  }

  const totalKb = m.totalGzBytes / 1024;
  readings.push({
    name: "total artifact",
    value: totalKb,
    limit: budget.totalGzKb,
    unit: "KB gz",
  });
  if (totalKb > budget.totalGzKb) {
    failures.push(
      `total artifact is ${totalKb.toFixed(1)} KB gzipped, over the ${budget.totalGzKb} KB ceiling`,
    );
  }

  if (m.largestComponentGzBytes != null) {
    const largestKb = m.largestComponentGzBytes / 1024;
    readings.push({
      name: `largest (${m.largestComponentName ?? "?"})`,
      value: largestKb,
      limit: budget.cssKbLargestComponent,
      unit: "KB gz",
    });
    if (largestKb > budget.cssKbLargestComponent) {
      failures.push(
        `${m.largestComponentName ?? "one component"} ships ${largestKb.toFixed(1)} KB gzipped of CSS, over the ${budget.cssKbLargestComponent} KB single-component ceiling. An average cannot catch this: spread across the rest of the library it barely moves.`,
      );
    }
  }

  const perComponent = m.cssGzBytes / m.componentCount / 1024;
  readings.push({
    name: "css per component",
    value: perComponent,
    limit: budget.cssKbPerComponent,
    unit: "KB gz",
  });
  if (perComponent > budget.cssKbPerComponent) {
    failures.push(
      `css is ${perComponent.toFixed(2)} KB gzipped per component across ${m.componentCount} components, over the ${budget.cssKbPerComponent} KB average. A total under its ceiling does not excuse this: it is the reading that says whether the library is still efficient.`,
    );
  }

  return { ok: failures.length === 0, failures, readings };
}

/** Human-readable verdict. Pure, so it is testable without a filesystem. */
export function summarize({ ok, failures, readings }) {
  const lines = [];
  for (const r of readings) {
    const pct = ((r.value / r.limit) * 100).toFixed(0);
    lines.push(
      `  ${r.name.padEnd(20)} ${r.value.toFixed(2).padStart(7)} ${r.unit}  of ${r.limit} (${pct}%)`,
    );
  }
  for (const f of failures) lines.push(`  OVER BUDGET  ${f}`);
  lines.push(
    ok
      ? "  PASS  the artifact is inside its published budget."
      : "  FAIL  raise the budget in scripts/bundle-budget-check.mjs, in this commit, with the reason -- or make the artifact smaller.",
  );
  return { ok, text: lines.join("\n") };
}

// ── Impure shell ────────────────────────────────────────────────────────

async function main() {
  console.log("\n── Bundle budget ──\n");

  const manifestJson = await readFile(
    resolve(REPO_ROOT, "parity-manifest.json"),
    "utf8",
  );
  const measured = measure();
  const cssGzBytes = measured.files["strand-ui.css"].gzipped_bytes;
  const totalGzBytes = measured.total_gz_bytes;
  const componentCount = JSON.parse(manifestJson).components.length;

  // Per-component sizes come from the SOURCE stylesheets, because the bundle
  // is concatenated and a component's contribution cannot be recovered from
  // it after the fact.
  const componentsDir = resolve(REPO_ROOT, "packages/strand-ui/src/components");
  let largestComponentGzBytes = 0;
  let largestComponentName = null;
  for (const dir of await readdir(componentsDir)) {
    let buf;
    try {
      buf = await readFile(resolve(componentsDir, dir, `${dir}.css`));
    } catch {
      continue;
    }
    const gz = gzipSync(buf).length;
    if (gz > largestComponentGzBytes) {
      largestComponentGzBytes = gz;
      largestComponentName = dir;
    }
  }

  const result = evaluate({
    totalGzBytes,
    cssGzBytes,
    componentCount,
    largestComponentGzBytes,
    largestComponentName,
  });
  const { ok, text } = summarize(result);
  console.log(text);
  console.log("");
  process.exit(ok ? 0 : 1);
}

if (process.argv[1] && process.argv[1].endsWith("bundle-budget-check.mjs")) {
  await main();
}

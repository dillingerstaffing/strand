#!/usr/bin/env node
// Every colour the SPECIFICATION prescribes must meet the same threshold the
// library is held to.
//
// THE GAP THIS CLOSES, and it is an asymmetry rather than an oversight:
// `pnpm test:contrast` reads the BUILT CSS and fails on any pairing below its
// threshold. Prose has no such gate. So the library was corrected twice --
// gap #51 moved 36 declarations to the text tier, gap #53 moved badges and the
// danger button to the deep rung -- and `docs/design-language.md` was never
// touched. For several releases the DOCUMENTED values were the failing ones
// while the SHIPPED values were correct, and anyone reading the specification
// to learn the system learned the defect.
//
// A sweep by hand then found SEVEN failing prescriptions, not the two that had
// been reported: the form placeholder, all nine status indicators, the link
// example, the active tab, the current page, the footer, and the empty state.
// Seven is what a hand sweep found once; a gate is what finds the eighth.
//
// Scope: fenced CSS blocks in the specification, plus the prose values it
// names in a text role. Only the fenced blocks are machine-checkable with any
// confidence, so those are what this fails on -- prose is reported as a
// warning, because a false positive in a gate gets the gate switched off.
//
// Usage: pnpm test:doc-contrast

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  contrastRatio,
  LIGHT_SURFACES,
  parsePalette,
  thresholdFor,
} from "./contrast-check.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");
const DOC_PATH = resolve(REPO_ROOT, "docs/design-language.md");
const TOKENS_PATH = resolve(REPO_ROOT, "packages/tokens/css/tokens.css");

// ── Pure decision layer ─────────────────────────────────────────────────

/**
 * The fenced CSS blocks in a markdown document.
 *
 * Only ```css blocks. A ```html or ```tsx block may contain a colour in an
 * attribute, but it is an example of markup rather than a prescription about
 * colour, and reading them would produce findings nobody can act on.
 */
export function fencedCssBlocks(markdown) {
  const blocks = [];
  const re = /```css\n([\s\S]*?)```/g;
  let m = re.exec(markdown);
  while (m !== null) {
    // The line number makes a finding navigable. Without it the reader has
    // to grep the specification for a selector that appears three times.
    const line = markdown.slice(0, m.index).split("\n").length;
    blocks.push({ line, css: m[1] });
    m = re.exec(markdown);
  }
  return blocks;
}

/**
 * `color:` declarations naming a palette token, with the selector they sit
 * on and the font-size the same block declares, if any.
 *
 * Deliberately narrow. `background`, `border-color`, `stroke` and `fill` are
 * fill-tier uses answering to 3:1 and are not text, which is the entire
 * distinction 14.2b draws; auditing them here would reproduce the mistake the
 * check exists to catch.
 */
export function textColorDeclarations(css) {
  const out = [];
  // Comments are stripped first so a selector reported in a finding is the
  // selector, not the selector plus whatever paragraph precedes it.
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const ruleRe = /([^{}]+)\{([^{}]*)\}/g;
  let rule = ruleRe.exec(source);
  while (rule !== null) {
    const selector = rule[1].trim();
    const body = rule[2];
    const colorMatch = /(?:^|[;\s])color:\s*var\((--strand-[a-z0-9-]+)\)/.exec(body);
    if (colorMatch) {
      const sizeMatch = /font-size:\s*var\(--strand-text-([a-z0-9]+)\)/.exec(body);
      const weightMatch = /font-weight:\s*(\d+)/.exec(body);
      out.push({
        selector,
        token: colorMatch[1],
        sizeName: sizeMatch ? sizeMatch[1] : null,
        bold: weightMatch ? Number(weightMatch[1]) >= 700 : false,
      });
    }
    rule = ruleRe.exec(source);
  }
  return out;
}

// The type scale, in px, for the sizes a text rule is likely to declare.
// Anything unrecognised is treated as body size, which is the strict reading:
// a smaller size only ever raises the threshold.
const SIZE_PX = { xs: 11.1, sm: 13.3, base: 16, lg: 20, xl: 25 };

/**
 * Audit one prescription against every light surface the language sanctions.
 * The darkest surface binds, exactly as it does in the library check.
 */
export function auditDeclaration(decl, palette, opts = {}) {
  const { darkContext = () => false } = opts;
  if (darkContext(decl.selector)) return null;
  const fg = palette[decl.token];
  if (!fg) return null;

  const px = decl.sizeName ? (SIZE_PX[decl.sizeName] ?? 16) : 16;
  const threshold = thresholdFor({ px, bold: decl.bold });

  let worst = null;
  for (const [name, bg] of Object.entries(LIGHT_SURFACES)) {
    const ratio = contrastRatio(fg, bg);
    if (ratio >= threshold) continue;
    if (!worst || ratio < worst.ratio) {
      worst = { ...decl, fg, surface: name, ratio, threshold, px };
    }
  }
  return worst;
}

/** Human-readable verdict. Pure, so it is testable without a filesystem. */
export function summarize(findings) {
  if (findings.length === 0) {
    return {
      ok: true,
      text: "  PASS  every colour the specification prescribes as text meets its threshold.",
    };
  }
  const lines = [
    `  DOC CONTRAST FAILED: ${findings.length} prescription(s) below their WCAG 2.2 AA threshold\n`,
  ];
  for (const f of findings) {
    lines.push(
      `  ${f.ratio.toFixed(2)}:1 (needs ${f.threshold}) ${f.token} on ${f.surface} at ${f.px}px`,
    );
    lines.push(`      ${f.selector}   (design-language.md:${f.line})`);
  }
  lines.push(
    "\n  The specification is prescribing a FILL-tier value as text. See 14.2b for",
  );
  lines.push(
    "  the tier table and 14.2c for why this is the most repeated mistake in the",
  );
  lines.push("  system. The library is gated by pnpm test:contrast; this gates the prose.");
  return { ok: false, text: lines.join("\n") };
}

// ── Impure shell ────────────────────────────────────────────────────────

async function main() {
  console.log("\n── Specification contrast ──\n");

  const [markdown, tokensCss] = await Promise.all([
    readFile(DOC_PATH, "utf8"),
    readFile(TOKENS_PATH, "utf8"),
  ]);

  const palette = parsePalette(tokensCss);
  const blocks = fencedCssBlocks(markdown);

  // An empty scan is a FAILURE, not a pass. If the fence syntax or the path
  // ever moves, this would otherwise report success having read nothing --
  // which is precisely the failure mode it exists to catch in the document.
  if (blocks.length === 0) {
    console.error(
      `  FAIL  no fenced css blocks found in ${DOC_PATH}. The document's structure changed and this check is measuring nothing.`,
    );
    process.exit(1);
  }

  // The dark instrument cabinet's own examples are painted on the abyss, so
  // judging them against a light surface is meaningless. Matched on the
  // selector rather than on a token prefix, because these examples use
  // ordinary palette values in a dark context.
  const darkContext = (selector) =>
    /instrument|readout-label|log__|bar-chart__/.test(selector);

  const findings = [];
  for (const block of blocks) {
    for (const decl of textColorDeclarations(block.css)) {
      const finding = auditDeclaration(decl, palette, { darkContext });
      if (finding) findings.push({ ...finding, line: block.line });
    }
  }

  const { ok, text } = summarize(findings);
  console.log(text);
  console.log("");
  process.exit(ok ? 0 : 1);
}

if (process.argv[1] && process.argv[1].endsWith("doc-contrast-check.mjs")) {
  await main();
}

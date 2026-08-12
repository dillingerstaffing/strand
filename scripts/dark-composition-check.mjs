#!/usr/bin/env node
// Every text primitive, composed inside every dark surface, measured.
//
// WHY `pnpm test:contrast` CANNOT FIND THIS, which is the whole point of a
// second check rather than more pairs in the first one:
//
// A shipped card rendered its heading at ~1.2:1 — gray-800 on the abyss,
// very nearly invisible, on the most prominent element in the product. The
// declaration was never wrong. `.strand-heading--sm { color: gray-800 }` is
// correct, and correct on every light surface the language sanctions, so a
// per-declaration audit passes it and is right to.
//
// The failing pair did not exist in any stylesheet. It came into existence
// when a consumer put a heading inside a dark card. **Contrast is a property
// of a PAIRING, and a pairing created by COMPOSITION cannot be found by
// reading declarations.** The dark cascade is what is supposed to handle it,
// and that cascade is a hand-maintained enumeration: it covered nine text
// roles, every one of them verified, and `.strand-heading` was not in the set
// anybody thought to list. Nothing failed. It simply was not asked.
//
// So this check does not read CSS. It renders each text-setting class inside
// each dark surface in real Chromium and measures the computed colour against
// the background actually painted behind it — walking up for the first
// non-transparent ancestor, exactly as a user's eye resolves it. An element
// that paints its own light background inside a dark card is a light island
// (DL 9.6) and is judged against its own ground, which is why the measurement
// has to be the painted one rather than the surface's.
//
// Usage: pnpm test:dark-composition

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");

/** The dark surfaces the language sanctions (DL 9.3). */
export const DARK_SURFACES = [
  { name: "instrument viewport", className: "strand-instrument-viewport" },
  { name: "feature surface", className: "strand-feature-surface" },
];

// ── Pure decision layer ─────────────────────────────────────────────────

/**
 * The text primitives a consumer may legitimately drop onto ANY surface.
 *
 * DECLARED, not inferred, and that decision is the difference between a
 * check people run and one they switch off. The first version measured
 * every class in the sheet that sets a colour: 188 classes, 376 pairings,
 * **232 failures**. Almost all were compositions nobody would ever write --
 * a bare `.strand-checkbox__control` floating inside a viewport, a
 * breadcrumb separator with no breadcrumb. A guard that reports 232 things
 * reports nothing, and the real finding would have been lost among them.
 *
 * These are the classes whose whole job is to render text in a context
 * they do not control, so a consumer putting one inside a dark card is
 * doing the intended thing. A component-internal class (`__element`) only
 * appears inside its own component's markup, and whether THAT component
 * works on dark is a question about the component, not about this pairing.
 *
 * Adding to this list is deliberate. `.strand-heading` was missing from the
 * dark cascade, shipped at 1.2:1 on the live site, and is the reason the
 * check exists.
 */
export const COMPOSABLE_TEXT = [
  "strand-heading",
  "strand-headline",
  "strand-title",
  "strand-overline",
  "strand-lead",
  "strand-text-secondary",
  "strand-value",
  "strand-prose",
  "strand-link",
  "strand-tag",
  "strand-chip",
  "strand-badge",
  "strand-status-chip",
  "strand-code-inline",
  "strand-step-indicator",
];

/**
 * Classes that set a text colour in their own right, narrowed to the
 * composable set above and their modifiers.
 *
 * Single-compound rules only. A descendant rule like
 * `.strand-instrument-viewport .strand-overline` is the CASCADE doing its
 * job, not a class defining itself, and collecting it would make the check
 * assert that the fix is present rather than that the result is legible.
 */
export function textColorClasses(css, scope = COMPOSABLE_TEXT) {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const found = new Set();
  for (const [, selector, body] of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!/(?:^|[;\s])color\s*:/.test(body)) continue;
    for (const branch of selector.split(",")) {
      const trimmed = branch.trim();
      // A combinator means the rule is scoping something else's class.
      if (/[\s>+~]/.test(trimmed)) continue;
      const m = /^\.(strand-[a-zA-Z0-9_-]+)/.exec(trimmed);
      if (!m) continue;
      const base = m[1].split("--")[0];
      // A modifier of a composable primitive is composable; an __element
      // of one belongs to its component's internals.
      if (scope.includes(base) && !m[1].includes("__")) found.add(m[1]);
    }
  }
  return [...found].sort();
}

const lin = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

/** Relative luminance from an `rgb(r, g, b)` string. */
export function luminanceOf(rgb) {
  const m = /rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(rgb);
  if (!m) return null;
  const [r, g, b] = [1, 2, 3].map((i) => Number(m[i]));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function ratioOf(fg, bg) {
  const a = luminanceOf(fg);
  const b = luminanceOf(bg);
  if (a === null || b === null) return null;
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/**
 * Judge one measured pair. Large text answers to 3:1 and normal text to
 * 4.5:1 (14.2), so the measured font size decides the threshold rather
 * than a guess.
 */
export function judge({ className, surface, color, background, fontPx, bold }) {
  const large = fontPx >= 24 || (bold && fontPx >= 18.66);
  const threshold = large ? 3 : 4.5;
  const ratio = ratioOf(color, background);
  if (ratio === null) return null;
  if (ratio >= threshold) return null;
  return { className, surface, color, background, fontPx, ratio, threshold };
}

export function summarize(findings) {
  if (findings.length === 0) {
    return {
      ok: true,
      text: "  PASS  every text primitive is legible on every dark surface.",
    };
  }
  const lines = [
    `  DARK COMPOSITION FAILED: ${findings.length} pairing(s) below their threshold\n`,
  ];
  for (const f of findings) {
    lines.push(
      `  ${f.ratio.toFixed(2)}:1 (needs ${f.threshold})  .${f.className} on the ${f.surface}`,
    );
    lines.push(`      ${f.color} on ${f.background} at ${f.fontPx}px`);
  }
  lines.push(
    "\n  The class is not wrong: it is correct on a light surface, which is why",
  );
  lines.push(
    "  test:contrast passes it. The dark cascade for that surface does not cover",
  );
  lines.push("  it. Add it there, or give the element its own light ground (DL 9.6).");
  return { ok: false, text: lines.join("\n") };
}

// ── Impure shell ────────────────────────────────────────────────────────

async function main() {
  console.log("\n── Dark-surface composition ──\n");

  const [tokens, css] = await Promise.all([
    readFile(resolve(REPO_ROOT, "packages/tokens/css/tokens.css"), "utf8"),
    readFile(resolve(REPO_ROOT, "packages/strand-ui/dist/css/strand-ui.css"), "utf8"),
  ]);

  const classes = textColorClasses(css);
  // An empty scan is a failure rather than a very good result.
  if (classes.length === 0) {
    console.error(
      "  FAIL  found no text-colour classes in the built stylesheet, so nothing was measured.",
    );
    process.exit(1);
  }

  const body = DARK_SURFACES.map(
    (s) => `<div class="${s.className}" data-surface="${s.name}">${classes
      .map(
        (c) =>
          `<span class="${c}" data-cls="${c}">The quick brown fox 0123</span>`,
      )
      .join("")}</div>`,
  ).join("");

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.setContent(
    `<!doctype html><html><head><style>${tokens}\n${css}</style></head><body>${body}</body></html>`,
  );

  const measured = await page.evaluate(() => {
    const out = [];
    for (const surface of document.querySelectorAll("[data-surface]")) {
      for (const el of surface.querySelectorAll("[data-cls]")) {
        const cs = getComputedStyle(el);
        // The background a user actually sees behind this text: the first
        // ancestor that paints one. An element with its own light ground
        // inside a dark card is a light island and is judged against it.
        let bg = "rgba(0, 0, 0, 0)";
        let n = el;
        while (n && (bg === "rgba(0, 0, 0, 0)" || bg === "transparent")) {
          bg = getComputedStyle(n).backgroundColor;
          n = n.parentElement;
        }
        out.push({
          className: el.getAttribute("data-cls"),
          surface: surface.getAttribute("data-surface"),
          color: cs.color,
          background: bg,
          fontPx: Number.parseFloat(cs.fontSize),
          bold: Number.parseInt(cs.fontWeight, 10) >= 700,
        });
      }
    }
    return out;
  });
  await browser.close();

  if (measured.length === 0) {
    console.error("  FAIL  rendered nothing, so the check measured nothing.");
    process.exit(1);
  }

  const findings = measured.map(judge).filter(Boolean);
  const { ok, text } = summarize(findings);
  console.log(
    `  ${classes.length} text classes x ${DARK_SURFACES.length} dark surfaces = ${measured.length} pairings measured\n`,
  );
  console.log(text);
  console.log("");
  process.exit(ok ? 0 : 1);
}

if (process.argv[1]?.endsWith("dark-composition-check.mjs")) {
  await main();
}

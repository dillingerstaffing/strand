import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// ── Skip link (SC 2.4.1 Bypass Blocks) ──
//
// .strand-sr-only cannot build one: it has no focus reveal, so a skip link
// composed from it stays invisible when focused, which defeats it for exactly
// the users it exists for. Landmarks already satisfy 2.4.1 as a technique,
// but landmarks only serve assistive tech -- a sighted keyboard user has no
// bypass without this.
//
// Measured need, on the Weekly Ship list at 250 events (about five years at a
// weekly cadence): 1,260 tab stops and 46 phone screens from the top of the
// page to the footer. One skip link collapses that to two.
//
// Guarded as source because the library ships CSS and jsdom has no layout.
// The reveal itself was verified in a real browser with a genuine Tab press
// (top -54 off-screen before, top 16 and inside the viewport after,
// :focus-visible matching), which is the part a source guard cannot prove.
describe("skip link reveals itself on focus", () => {
  const css = readFileSync(resolve(__dirname, "../../static.css"), "utf8");

  const ruleFor = (selector: string) =>
    css.match(new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`))?.[1];

  const base = ruleFor(".strand-skip-link");
  const focus = ruleFor(".strand-skip-link:focus-visible");

  it("finds both rules (guards the parse)", () => {
    expect(base, "no .strand-skip-link rule").toBeDefined();
    expect(focus, "no :focus-visible rule").toBeDefined();
  });

  it("is out of sight until focused, and returns on focus", () => {
    // The whole primitive is this pair. If either half goes, it is either
    // permanently visible chrome or an invisible control.
    expect(base).toMatch(/transform:\s*translateY\(/);
    expect(base).not.toMatch(/transform:\s*translateY\(0\)/);
    expect(focus).toMatch(/transform:\s*translateY\(0\)/);
  });

  it("lands in the viewport rather than at the top of the document", () => {
    // absolute would scroll away with the page; a reader who tabs after
    // scrolling would focus a control they cannot see.
    expect(base).toMatch(/position:\s*fixed/);
  });

  it("clears the banner and both nav layers", () => {
    const z = Number(base?.match(/z-index:\s*(\d+)/)?.[1]);
    expect(z).toBeGreaterThan(101);
  });

  it("carries a visible focus indicator of its own (SC 2.4.11)", () => {
    expect(focus).toMatch(/outline:\s*2px\s+solid/);
  });

  it("is not animated, so it needs no reduced-motion reset", () => {
    // A transition here would require a matching reduced-motion rule at
    // matching specificity. ScrollReveal.css documents how that goes wrong;
    // the cheapest correct answer is to not animate at all.
    expect(base).not.toContain("transition");
  });
});

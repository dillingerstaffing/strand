import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { snapshotStylesheet } from "../../test/stylesheet.js";

snapshotStylesheet(resolve(__dirname, "./SkipLink.css"));

// cf: skip-link
describe("skip link reveals itself on focus", () => {
  const css = readFileSync(resolve(__dirname, "./SkipLink.css"), "utf8");
  const ruleFor = (selector: string) => css.match(new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`))?.[1];
  const base = ruleFor(".strand-skip-link");
  const focus = ruleFor(".strand-skip-link:focus-visible");

  it("finds both rules (guards the parse)", () => {
    expect(base, "no .strand-skip-link rule").toBeDefined();
    expect(focus, "no :focus-visible rule").toBeDefined();
  });

  it("is out of sight until focused, and returns on focus", () => {
    expect(base).toMatch(/transform:\s*translateY\(/);
    expect(base).not.toMatch(/transform:\s*translateY\(0\)/);
    expect(focus).toMatch(/transform:\s*translateY\(0\)/);
  });

  it("lands in the viewport rather than at the top of the document", () => {
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
    expect(base).not.toContain("transition");
  });
});

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Banner ships as CSS only -- there is no Banner.tsx, because a consumer
// composes the markup and the library owns the presentation. So this file
// guards the stylesheet rather than a rendered tree.

// ── Measure cap (source guard) ──
//
// The banner is the only full-bleed text in the language, so without a cap
// its line length is whatever the viewport is: measured at 1440 it ran
// ~1408px / ~211 characters against DL 4.6's 60-75. A consumer cannot fix
// that without a page-local override, which is what made it a library gap.
//
// Pinned as source rather than rendered geometry because jsdom has no layout,
// and because the invariant is about the declared cap rather than any one
// page's width.
describe("Banner text carries a measure cap", () => {
  const css = readFileSync(resolve(__dirname, "Banner.css"), "utf8");

  const textRule = css.match(/\.strand-banner__text\s*\{([^}]*)\}/)?.[1];

  it("finds the rule at all (guards the parse)", () => {
    expect(textRule).toBeDefined();
  });

  it("caps the line length inside DL 4.6's 60-75ch band", () => {
    const ch = textRule?.match(/max-width:\s*(\d+)ch/);
    expect(ch, "no ch-based max-width on .strand-banner__text").toBeTruthy();
    const value = Number(ch?.[1]);
    expect(value).toBeGreaterThanOrEqual(60);
    expect(value).toBeLessThanOrEqual(75);
  });

  it("keeps the capped text centred under the banner's text-align", () => {
    // Without auto side margins the cap would left-align the text in a
    // full-bleed bar, which looks like a bug rather than a measure.
    expect(textRule).toMatch(/margin:\s*0\s+auto/);
  });
});

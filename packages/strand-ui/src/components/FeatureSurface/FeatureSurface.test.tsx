/*! Strand UI | MIT License | dillingerstaffing.com */

// The CASCADE is this primitive's contract, and jsdom cannot evaluate a
// cascade any more than it can lay out. What is asserted here is the class
// surface a consumer programs against; the contrast values themselves are
// gated by pnpm test:contrast against the built CSS, which is the tier that
// can actually resolve them.

import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { FeatureSurface } from "./FeatureSurface.js";

describe("FeatureSurface", () => {
  it("paints the feature surface", () => {
    const { container } = render(<FeatureSurface />);
    expect(container.querySelector(".strand-feature-surface")).not.toBeNull();
  });

  // Not InstrumentViewport. The two are different roles, not shades, and a
  // consumer reaching for the wrong one gets the wrong text cascade with it.
  it("is not the instrument viewport", () => {
    const { container } = render(<FeatureSurface />);
    expect(container.querySelector(".strand-instrument-viewport")).toBeNull();
  });

  it("is a div by default", () => {
    const { container } = render(<FeatureSurface />);
    expect(container.querySelector(".strand-feature-surface")?.tagName).toBe("DIV");
  });

  it("renders as a semantic element when asked", () => {
    // The one card a view is built around is usually an article or a
    // section, and a div would drop that from the accessibility tree.
    const { container } = render(<FeatureSurface as="article" />);
    expect(container.querySelector(".strand-feature-surface")?.tagName).toBe("ARTICLE");
  });

  it("carries a consumer class without dropping its own", () => {
    const { container } = render(<FeatureSurface className="x" />);
    const el = container.querySelector(".strand-feature-surface");
    expect(el?.classList.contains("x")).toBe(true);
    expect(el?.classList.contains("strand-feature-surface")).toBe(true);
  });

  // ── Padding tiers (Gap #102) ──

  it("pads itself by default, so an unchanged consumer is unchanged", () => {
    const { container } = render(<FeatureSurface />);
    expect(
      container.querySelector(".strand-feature-surface")?.classList.contains(
        "strand-feature-surface--pad-md",
      ),
    ).toBe(true);
  });

  it("hands the inset to its children when asked", () => {
    // The case this exists for: a two-pane card whose divider runs the full
    // height needs the PANES to pad, so the surface must not.
    const { container } = render(<FeatureSurface padding="none" />);
    const el = container.querySelector(".strand-feature-surface");
    expect(el?.classList.contains("strand-feature-surface--pad-none")).toBe(true);
    expect(el?.classList.contains("strand-feature-surface--pad-md")).toBe(false);
  });

  it("offers the same tiers as Card", () => {
    // A tier present on one surface primitive and absent on the other is a
    // hole rather than a distinction, and that is what this gap was.
    for (const tier of ["none", "sm", "md", "lg", "xl"] as const) {
      const { container } = render(<FeatureSurface padding={tier} />);
      expect(
        container.querySelector(`.strand-feature-surface--pad-${tier}`),
      ).not.toBeNull();
    }
  });

  it("renders its children", () => {
    const { container } = render(
      <FeatureSurface>
        <span class="strand-overline">Next ship</span>
      </FeatureSurface>,
    );
    expect(container.textContent).toContain("Next ship");
  });

  // The guard the instrument viewport already has, mirrored here because this
  // surface shipped without it and the alert cascade was the part that got
  // missed. A variant covered nowhere renders its light-surface colour on a
  // dark ground, which is how --success measured 1.52 on the viewport before
  // its own fix; --success is the RSVP affirmation, so it is the most-seen.
  it("every alert variant with a light-surface status colour has an on-dark rule", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const read = (rel: string) => readFileSync(resolve(__dirname, rel), "utf8");

    const alertCss = read("../Alert/Alert.css");
    const surfaceCss = read("./FeatureSurface.css");

    const lightVariants = [
      ...alertCss.matchAll(/\.strand-alert--([a-z]+)\s+\.strand-alert__status\s*\{/g),
    ].map((m) => m[1]);
    const darkVariants = [
      ...surfaceCss.matchAll(
        /\.strand-feature-surface\s+\.strand-alert--([a-z]+)\s+\.strand-alert__status\s*[,{]/g,
      ),
    ].map((m) => m[1]);

    // Guards the parse: without this, two empty lists would compare equal and
    // the assertion would pass while checking nothing.
    expect(lightVariants.length).toBeGreaterThanOrEqual(4);
    expect([...new Set(darkVariants)].sort()).toEqual([...new Set(lightVariants)].sort());
  });

  it("washes the alert panel itself, not only its status prefix", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const css = readFileSync(resolve(__dirname, "./FeatureSurface.css"), "utf8");
    expect(css).toMatch(/\.strand-feature-surface\s+\.strand-alert\s*\{/);
  });
});

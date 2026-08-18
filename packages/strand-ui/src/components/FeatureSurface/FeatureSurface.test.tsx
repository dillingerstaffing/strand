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

  // ── Padding tiers (Gap #102) ──

  it("pads itself by default, so an unchanged consumer is unchanged", () => {
    const { container } = render(<FeatureSurface />);
    expect(
      container.querySelector(".strand-feature-surface")?.classList.contains(
        "strand-feature-surface--pad-md",
      ),
    ).toBe(true);
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

  // The surface recolours the primitives inside it through their tokens
  // (cf: surface-tokens); this guards the set for the alert family, the
  // part that was missed when the surface first shipped.
  it("sets the alert wash and every alert status colour on dark", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const read = (rel: string) => readFileSync(resolve(__dirname, rel), "utf8");
    const blocks = [...read("./FeatureSurface.css").matchAll(/\.strand-feature-surface\s*\{([^}]*)\}/g)].map((m) => m[1]);
    const block = blocks.find((b) => b.includes("--strand-alert-bg")) ?? "";
    expect(block).toMatch(/--strand-alert-bg:/);
    expect(block).toMatch(/--strand-alert-color:/);
    const variants = [...read("../Alert/Alert.css").matchAll(/var\((--strand-alert-[a-z]+-status-color),/g)].map((m) => m[1]);
    expect(variants.length).toBeGreaterThanOrEqual(4);
    for (const v of variants) expect(block, `${v} is not set on the feature surface`).toMatch(new RegExp(`${v}:`));
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./FeatureSurface.fixtures.js";

snapshotFixtures(FeatureSurface, fixtures);

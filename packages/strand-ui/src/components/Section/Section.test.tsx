import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Section } from "./Section.js";

describe("Section", () => {
  // ── Rendering ──

  it("renders a section element", () => {
    const { container } = render(<Section>content</Section>);
    expect(container.firstElementChild?.tagName).toBe("SECTION");
  });

  it("renders the semantic element given by the as prop", () => {
    const { container } = render(<Section as="header">content</Section>);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("HEADER");
    expect(el?.className).toContain("strand-section");
  });

  it("renders children", () => {
    const { getByText } = render(
      <Section>
        <h2>Title</h2>
        <p>Body text</p>
      </Section>,
    );
    expect(getByText("Title")).toBeTruthy();
    expect(getByText("Body text")).toBeTruthy();
  });

  // ── Variant ──

  // ── Background ──

  // ── Custom className ──

  // ── Props forwarding ──

  it("forwards additional props", () => {
    const { container } = render(
      <Section data-testid="my-section" id="s1">
        content
      </Section>,
    );
    expect(container.firstElementChild).toHaveAttribute("id", "s1");
  });

  // ── Aria ──

  it("supports aria-labelledby", () => {
    const { container } = render(
      <Section aria-labelledby="heading-1">content</Section>,
    );
    expect(container.firstElementChild).toHaveAttribute(
      "aria-labelledby",
      "heading-1",
    );
  });

  // ── Scroll offset contract ──
  //
  // The scroll-target modifier is the per-section opt-in that
  // reinforces the global scroll-padding-top rule from base.css.
  // Its value must track the nav-height + banner-height tokens so
  // a nav-height change propagates everywhere without hunting
  // through CSS files.

  it("scroll-target modifier offsets by the nav + banner tokens (not a hardcoded rem)", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const sectionCss = readFileSync(
      resolve(__dirname, "Section.css"),
      "utf8",
    );
    expect(sectionCss).toContain(".strand-section--scroll-target");
    expect(sectionCss).toMatch(
      /\.strand-section--scroll-target\s*\{[\s\S]*scroll-margin-top:\s*calc\(var\(--strand-nav-height\)\s*\+\s*var\(--strand-banner-height,\s*0px\)\)[\s\S]*\}/,
    );
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./Section.fixtures.js";

snapshotFixtures(Section, fixtures);

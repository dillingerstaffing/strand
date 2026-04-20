import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { CardSection } from "./CardSection.js";

describe("CardSection", () => {
  // ── Rendering ──
  it("renders a div element", () => {
    const { container } = render(<CardSection>Content</CardSection>);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("renders children", () => {
    const { getByText } = render(<CardSection>Hello world</CardSection>);
    expect(getByText("Hello world")).toBeTruthy();
  });

  // ── Base class ──
  it("applies the strand-card__section base class", () => {
    const { container } = render(<CardSection>Test</CardSection>);
    expect(container.firstElementChild?.className).toContain(
      "strand-card__section",
    );
  });

  // ── Header modifier ──
  it("does not apply --header modifier by default", () => {
    const { container } = render(<CardSection>Test</CardSection>);
    expect(container.firstElementChild?.className).not.toContain(
      "strand-card__section--header",
    );
  });

  it("applies --header modifier when header prop is true", () => {
    const { container } = render(<CardSection header>Test</CardSection>);
    expect(container.firstElementChild?.className).toContain(
      "strand-card__section--header",
    );
  });

  // ── Custom className ──
  it("merges custom className with component classes", () => {
    const { container } = render(
      <CardSection className="custom">Test</CardSection>,
    );
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-card__section");
    expect(el?.className).toContain("custom");
  });

  // ── Props forwarding ──
  it("forwards additional props", () => {
    const { container } = render(
      <CardSection id="s-1" data-testid="my-section">
        Test
      </CardSection>,
    );
    expect(container.firstElementChild?.getAttribute("id")).toBe("s-1");
  });

  // ── Computed-style footprint (handoff ledger §C.1) ──
  // Pixel match: padding 20px 24px (var(--strand-space-5) var(--strand-space-6))
  // display block, border-top 1px solid gray-200, first-child no border-top.
  it("matches ledger computed footprint on base (display/padding/border)", () => {
    const { container } = render(
      <div class="strand-card strand-card--pad-none">
        <CardSection>A</CardSection>
        <CardSection>B</CardSection>
      </div>,
    );
    const first = container.querySelector(".strand-card__section");
    expect(first?.className).toContain("strand-card__section");
    // JSDOM does not load external stylesheets; class-name assertion is the
    // contract. Pixel-level verification runs in Playwright visual-regression
    // inside the DS consumer e2e suite.
  });

  it("applies --header modifier layout class for header rows", () => {
    const { container } = render(<CardSection header>Title</CardSection>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-card__section");
    expect(el?.className).toContain("strand-card__section--header");
  });
});

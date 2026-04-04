import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Section } from "./Section.js";

describe("Section", () => {
  // ── Rendering ──

  it("renders a section element", () => {
    const { container } = render(<Section>content</Section>);
    expect(container.firstElementChild?.tagName).toBe("SECTION");
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

  it("applies standard variant class by default", () => {
    const { container } = render(<Section>content</Section>);
    expect(container.firstElementChild?.className).toContain(
      "strand-section--standard",
    );
  });

  it("applies hero variant class", () => {
    const { container } = render(<Section variant="hero">content</Section>);
    expect(container.firstElementChild?.className).toContain(
      "strand-section--hero",
    );
  });

  it("applies compact variant class", () => {
    const { container } = render(<Section variant="compact">content</Section>);
    expect(container.firstElementChild?.className).toContain(
      "strand-section--compact",
    );
  });

  it("applies border-top class when borderTop is true", () => {
    const { container } = render(<Section borderTop>content</Section>);
    expect(container.firstElementChild?.className).toContain(
      "strand-section--border-top",
    );
  });

  it("does not apply border-top class by default", () => {
    const { container } = render(<Section>content</Section>);
    expect(container.firstElementChild?.className).not.toContain(
      "strand-section--border-top",
    );
  });

  // ── Background ──

  it("applies primary background class by default", () => {
    const { container } = render(<Section>content</Section>);
    expect(container.firstElementChild?.className).toContain(
      "strand-section--bg-primary",
    );
  });

  it("applies elevated background class", () => {
    const { container } = render(
      <Section background="elevated">content</Section>,
    );
    expect(container.firstElementChild?.className).toContain(
      "strand-section--bg-elevated",
    );
  });

  it("applies recessed background class", () => {
    const { container } = render(
      <Section background="recessed">content</Section>,
    );
    expect(container.firstElementChild?.className).toContain(
      "strand-section--bg-recessed",
    );
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { container } = render(
      <Section className="custom">content</Section>,
    );
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-section");
    expect(el?.className).toContain("custom");
  });

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
});

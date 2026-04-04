import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { ScrollReveal } from "./ScrollReveal.js";

describe("ScrollReveal", () => {
  // ── Rendering ──

  it("renders a div element", () => {
    const { container } = render(<ScrollReveal>Content</ScrollReveal>);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("DIV");
  });

  it("applies strand-reveal class", () => {
    const { container } = render(<ScrollReveal>Content</ScrollReveal>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-reveal");
  });

  it("renders children", () => {
    const { getByText } = render(<ScrollReveal>Hello reveal</ScrollReveal>);
    expect(getByText("Hello reveal")).toBeTruthy();
  });

  it("does not apply visible class initially", () => {
    const { container } = render(<ScrollReveal>Content</ScrollReveal>);
    const el = container.firstElementChild;
    expect(el?.className).not.toContain("strand-reveal--visible");
  });

  // ── Custom className ──

  it("merges custom className with component classes", () => {
    const { container } = render(
      <ScrollReveal className="custom">Content</ScrollReveal>,
    );
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-reveal");
    expect(el?.className).toContain("custom");
  });

  // ── Props forwarding ──

  it("forwards additional props", () => {
    const { container } = render(
      <ScrollReveal id="reveal-1" data-testid="reveal">
        Content
      </ScrollReveal>,
    );
    expect(container.firstElementChild?.getAttribute("id")).toBe("reveal-1");
  });

  // ── Props acceptance ──

  it("accepts threshold prop without error", () => {
    const { container } = render(
      <ScrollReveal threshold={0.5}>Content</ScrollReveal>,
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it("accepts once prop without error", () => {
    const { container } = render(
      <ScrollReveal once={false}>Content</ScrollReveal>,
    );
    expect(container.firstElementChild).toBeTruthy();
  });
});

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { InstrumentViewport } from "./InstrumentViewport.js";

describe("InstrumentViewport", () => {
  // ── Rendering ──

  it("renders a div element", () => {
    const { container } = render(
      <InstrumentViewport>Content</InstrumentViewport>,
    );
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("DIV");
  });

  it("applies base class", () => {
    const { container } = render(
      <InstrumentViewport>Content</InstrumentViewport>,
    );
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-instrument-viewport");
  });

  it("renders children", () => {
    const { getByText } = render(
      <InstrumentViewport>Hello viewport</InstrumentViewport>,
    );
    expect(getByText("Hello viewport")).toBeTruthy();
  });

  // ── Grid modifier ──

  it("does not apply grid class by default", () => {
    const { container } = render(
      <InstrumentViewport>Content</InstrumentViewport>,
    );
    const el = container.firstElementChild;
    expect(el?.className).not.toContain("strand-instrument-viewport--grid");
  });

  it("applies grid modifier class when grid prop is true", () => {
    const { container } = render(
      <InstrumentViewport grid>Content</InstrumentViewport>,
    );
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-instrument-viewport--grid");
  });

  // ── Custom className ──

  it("merges custom className with component classes", () => {
    const { container } = render(
      <InstrumentViewport className="custom">Content</InstrumentViewport>,
    );
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-instrument-viewport");
    expect(el?.className).toContain("custom");
  });

  // ── Props forwarding ──

  it("forwards additional props", () => {
    const { container } = render(
      <InstrumentViewport id="vp-1" data-testid="viewport">
        Content
      </InstrumentViewport>,
    );
    expect(container.firstElementChild?.getAttribute("id")).toBe("vp-1");
  });
});

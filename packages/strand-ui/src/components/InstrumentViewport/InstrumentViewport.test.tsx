import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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

  // ── Full bleed modifier ──

  it("does not apply full-bleed class by default", () => {
    const { container } = render(
      <InstrumentViewport>Content</InstrumentViewport>,
    );
    const el = container.firstElementChild;
    expect(el?.className).not.toContain(
      "strand-instrument-viewport--full-bleed",
    );
  });

  it("applies full-bleed modifier class when fullBleed prop is true", () => {
    const { container } = render(
      <InstrumentViewport fullBleed>Content</InstrumentViewport>,
    );
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-instrument-viewport--full-bleed");
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

  // ── CSS slot primitives ──
  //
  // The map slot is a pure-CSS primitive (consumers apply the
  // class to their map library's container div). Verify the rule
  // exists in the source CSS so consumers that use strand-ui.css
  // get a non-zero box for their map to render into. Without this
  // rule, a raw <div> child of the viewport collapses to height 0
  // and libraries like maplibre-gl silently initialize a zero-size
  // canvas and render nothing.

  it("defines a map slot primitive in the source CSS", () => {
    const css = readFileSync(
      resolve(__dirname, "./InstrumentViewport.css"),
      "utf-8",
    );
    expect(css).toContain(".strand-instrument-viewport__map");
    // The slot must set explicit dimensions so consumers do not
    // need to add custom CSS on top of Strand UI.
    const slotMatch = css.match(
      /\.strand-instrument-viewport__map\s*\{([^}]*)\}/,
    );
    expect(slotMatch).not.toBeNull();
    const slotBody = slotMatch?.[1] ?? "";
    expect(slotBody).toContain("width");
    expect(slotBody).toContain("height");
    // It must NOT set a z-index: a z-index would create a new
    // stacking context that traps the map library's markers
    // inside the slot, preventing them from being promoted above
    // the FUI overlays (scanlines, vignette).
    expect(slotBody).not.toMatch(/z-index/);
  });
});

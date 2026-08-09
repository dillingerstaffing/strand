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

  // Alert.css gives the alert an opaque light-surface background and no
  // color of its own. On the dark viewport its text therefore inherited
  // the near-white viewport color while the panel stayed near-white:
  // the message was invisible. The dark-context cascade must state BOTH
  // the panel background and the content color.

  it("gives an alert on the dark viewport its own background and text color", () => {
    const css = readFileSync(
      resolve(__dirname, "./InstrumentViewport.css"),
      "utf-8",
    );
    const match = css.match(
      /\.strand-instrument-viewport \.strand-alert\s*\{([^}]*)\}/,
    );
    expect(match).not.toBeNull();
    const body = match?.[1] ?? "";
    expect(body).toContain("background");
    // Without an explicit color the content inherits the viewport's
    // near-white and disappears against the panel.
    expect(body).toContain("color");
    // The full-page instrument mode must be scoped identically.
    expect(css).toContain(".strand-body--instrument .strand-alert");
  });

  it("carries form-control labels on dark, the last primitives the cascade missed", () => {
    const css = readFileSync(
      resolve(__dirname, "./InstrumentViewport.css"),
      "utf-8",
    );
    // switch / checkbox / radio labels are gray-900 on the light surface, so
    // a labelled toggle on the viewport rendered near-black on dark (~1.2:1)
    // and the label was invisible rather than merely low-contrast.
    expect(css).toMatch(
      /\.strand-instrument-viewport \.strand-switch__label[\s\S]{0,400}?color:\s*var\(--strand-on-blue-primary\)/,
    );
    expect(css).toContain(".strand-instrument-viewport .strand-checkbox__label");
    expect(css).toContain(".strand-instrument-viewport .strand-radio__label");
    expect(css).toContain(".strand-instrument-viewport .strand-form-field__label");
    expect(css).toContain(".strand-instrument-viewport .strand-form-field__hint");
  });

  it("gives those same labels back to a light island nested in the viewport", () => {
    const css = readFileSync(
      resolve(__dirname, "./InstrumentViewport.css"),
      "utf-8",
    );
    expect(css).toContain(".strand-surface-light .strand-switch__label");
    expect(css).toContain(".strand-surface-light .strand-form-field__label");
  });

  it("restores the light-surface alert inside the nested light detail panel", () => {
    const css = readFileSync(
      resolve(__dirname, "./InstrumentViewport.css"),
      "utf-8",
    );
    // DL 9.6: the detail panel is a light island inside the dark cabinet,
    // so the on-dark alert wash must not leak into it.
    const match = css.match(
      /\.strand-detail-panel \.strand-alert,\s*\.strand-surface-light \.strand-alert\s*\{([^}]*)\}/,
    );
    expect(match).not.toBeNull();
    const body = match?.[1] ?? "";
    expect(body).toContain("background");
    expect(body).toContain("color");
  });
});

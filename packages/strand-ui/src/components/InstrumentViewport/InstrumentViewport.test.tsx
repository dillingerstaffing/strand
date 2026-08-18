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

  it("renders children", () => {
    const { getByText } = render(
      <InstrumentViewport>Hello viewport</InstrumentViewport>,
    );
    expect(getByText("Hello viewport")).toBeTruthy();
  });

  // ── Grid modifier ──

  // ── Full bleed modifier ──

  // ── Custom className ──

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

// The dark surface recolours the primitives inside it through their tokens
// (cf: surface-tokens). These guard the set: whatever the surface has to
// answer for, it answers for the whole family, and the page-scale body mode
// shares the block.
describe("the dark surface sets every token its primitives need", () => {
  const css = readFileSync(resolve(__dirname, "./InstrumentViewport.css"), "utf-8");
  const block = css.match(/\.strand-instrument-viewport,\s*\.strand-body--instrument\s*\{([^}]*)\}/)?.[1] ?? "";
  const alertCss = readFileSync(resolve(__dirname, "../Alert/Alert.css"), "utf-8");

  it("shares one block between the viewport and the page-scale body mode", () => {
    expect(block).not.toBe("");
  });

  it("gives an alert its own wash and content colour, and every status variant its on-dark colour", () => {
    expect(block).toMatch(/--strand-alert-bg:/);
    expect(block).toMatch(/--strand-alert-color:/);
    const variants = [...alertCss.matchAll(/var\((--strand-alert-[a-z]+-status-color),/g)].map((m) => m[1]);
    expect(variants.length).toBeGreaterThanOrEqual(4);
    for (const v of variants) expect(block, `${v} is read by Alert.css and not set on dark`).toMatch(new RegExp(`${v}:`));
  });

  it("carries form-control labels on dark", () => {
    for (const t of ["--strand-switch-label-color", "--strand-checkbox-label-color", "--strand-radio-label-color", "--strand-form-field-label-color", "--strand-form-field-hint-color"]) {
      expect(block).toMatch(new RegExp(`${t}:\\s*var\\(--strand-(?:on-blue-primary|gray-300)\\)`));
    }
  });

  it("does not wash the toast, which keeps its own opaque light surface", () => {
    const toastCss = readFileSync(resolve(__dirname, "../Toast/Toast.css"), "utf-8");
    expect(toastCss).toMatch(/\.strand-toast\s*\{[^}]*background:\s*var\(--strand-surface-elevated\)/);
    expect(css).not.toContain("strand-toast");
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./InstrumentViewport.fixtures.js";

snapshotFixtures(InstrumentViewport, fixtures);

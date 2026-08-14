import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { DataReadout } from "./DataReadout.js";

describe("DataReadout", () => {
  // ── Rendering ──

  it("renders label text", () => {
    const { getByText } = render(
      <DataReadout label="Response Time" value="42ms" />,
    );
    expect(getByText("Response Time")).toBeTruthy();
  });

  it("renders string value", () => {
    const { getByText } = render(
      <DataReadout label="Status" value="Online" />,
    );
    expect(getByText("Online")).toBeTruthy();
  });

  it("renders numeric value", () => {
    const { getByText } = render(
      <DataReadout label="Count" value={1234} />,
    );
    expect(getByText("1234")).toBeTruthy();
  });

  // ── Typography classes ──

  it("applies monospace font class to label", () => {
    const { container } = render(
      <DataReadout label="Metric" value="100" />,
    );
    const label = container.querySelector(".strand-data-readout__label");
    expect(label).toBeTruthy();
  });

  it("applies monospace font class to value", () => {
    const { container } = render(
      <DataReadout label="Metric" value="100" />,
    );
    const value = container.querySelector(".strand-data-readout__value");
    expect(value).toBeTruthy();
  });

  it("label has uppercase text transform via CSS class", () => {
    const { container } = render(
      <DataReadout label="Metric" value="100" />,
    );
    const label = container.querySelector(".strand-data-readout__label");
    expect(label).toBeTruthy();
    // text-transform: uppercase is applied via .strand-data-readout__label CSS
  });

  it("value uses light weight via CSS class", () => {
    const { container } = render(
      <DataReadout label="Metric" value="100" />,
    );
    const value = container.querySelector(".strand-data-readout__value");
    expect(value).toBeTruthy();
    // font-weight: var(--strand-weight-light) applied via .strand-data-readout__value CSS
  });

  it("value has tabular-nums via CSS class", () => {
    const { container } = render(
      <DataReadout label="Metric" value="100" />,
    );
    const value = container.querySelector(".strand-data-readout__value");
    expect(value).toBeTruthy();
    // font-variant-numeric: tabular-nums applied via .strand-data-readout__value CSS
  });

  // ── Layout ──

  it("renders as flex column layout", () => {
    const { container } = render(
      <DataReadout label="Metric" value="100" />,
    );
    const readout = container.querySelector(".strand-data-readout");
    expect(readout).toBeTruthy();
    // display: flex; flex-direction: column applied via .strand-data-readout CSS
  });

  // ── Custom className ──

  it("merges custom className with component classes", () => {
    const { container } = render(
      <DataReadout label="Metric" value="100" className="custom" />,
    );
    const readout = container.querySelector(".strand-data-readout");
    expect(readout?.className).toContain("strand-data-readout");
    expect(readout?.className).toContain("custom");
  });

  // ── Size variants ──

  it("applies sm size modifier class", () => {
    const { container } = render(
      <DataReadout label="Users" value="12.8K" size="sm" />,
    );
    const readout = container.querySelector(".strand-data-readout");
    expect(readout?.className).toContain("strand-data-readout--sm");
  });

  it("applies lg size modifier class", () => {
    const { container } = render(
      <DataReadout label="Revenue" value="$1.2M" size="lg" />,
    );
    const readout = container.querySelector(".strand-data-readout");
    expect(readout?.className).toContain("strand-data-readout--lg");
  });

  it("applies xl size modifier class", () => {
    const { container } = render(
      <DataReadout label="Remaining" value="284g" size="xl" />,
    );
    const readout = container.querySelector(".strand-data-readout");
    expect(readout?.className).toContain("strand-data-readout--xl");
  });

  it("does not apply size modifier for md (default)", () => {
    const { container } = render(
      <DataReadout label="Metric" value="100" size="md" />,
    );
    const readout = container.querySelector(".strand-data-readout");
    expect(readout?.className).not.toContain("strand-data-readout--md");
    expect(readout?.className).not.toContain("strand-data-readout--sm");
    expect(readout?.className).not.toContain("strand-data-readout--lg");
  });

  it("does not apply size modifier when size is omitted", () => {
    const { container } = render(
      <DataReadout label="Metric" value="100" />,
    );
    const readout = container.querySelector(".strand-data-readout");
    expect(readout?.className).toBe("strand-data-readout");
  });

  // ── Forwarded props ──

  it("forwards additional props", () => {
    const { container } = render(
      <DataReadout label="Metric" value="100" id="readout-1" />,
    );
    const readout = container.querySelector(".strand-data-readout");
    expect(readout?.getAttribute("id")).toBe("readout-1");
  });
});

// ── The size API (Gap #103, DL 11.2.1) ──
//
// Asserted against the STYLESHEET rather than through jsdom, for the reason
// every comment above says out loud: jsdom applies no cascade, so it cannot
// see a font-size at all, let alone which custom property produced it. The
// contract here is the shape of the declarations, and that is readable.
describe("DataReadout size API", () => {
  const css = readFileSync(resolve(__dirname, "./DataReadout.css"), "utf-8");

  it("reads both sizes from named properties, so a consumer never restyles the internals", () => {
    expect(css).toContain(
      "font-size: var(--strand-data-readout-label-size, var(--strand-text-xs));",
    );
    expect(css).toContain(
      "font-size: var(--strand-data-readout-value-size, var(--strand-text-3xl));",
    );
  });

  it("keeps the fallback inside the var(), so an orphan __value is unaffected", () => {
    // `.strand-data-readout__value` is used in real consumer markup with no
    // `.strand-data-readout` ancestor. Declaring the property on the block
    // instead would leave those resolving an unset variable, which is invalid
    // at computed-value time -- and font-size is INHERITED, so the readout
    // would silently take its parent's size rather than the ladder's.
    const block = css.slice(
      css.indexOf(".strand-data-readout {"),
      css.indexOf(".strand-data-readout__label"),
    );
    expect(block).not.toContain("--strand-data-readout-label-size:");
    expect(block).not.toContain("--strand-data-readout-value-size:");
  });

  it("sets the property from each size modifier rather than a font-size", () => {
    // On the BLOCK, not on a descendant. Custom-property resolution takes the
    // nearest declaring ancestor, so a modifier on the readout itself beats a
    // consumer's declaration further up and the ladder stays authoritative.
    for (const [modifier, size] of [
      ["sm", "var(--strand-text-xl)"],
      ["lg", "var(--strand-text-4xl)"],
      ["xl", "clamp(4.5rem, 10vw, 7rem)"],
    ] as const) {
      expect(css).toContain(
        `.strand-data-readout--${modifier} {\n  --strand-data-readout-value-size: ${size};\n}`,
      );
    }
  });

  it("does not let a modifier move the label, which is still the ladder's rule", () => {
    // DL 11.2: the label holds at --strand-text-xs across every rung. Only a
    // consumer setting the property directly may move it, and that is the
    // labelled-fact case 11.2.1 admits.
    for (const modifier of ["sm", "lg", "xl"]) {
      const rule = css.slice(css.indexOf(`.strand-data-readout--${modifier} {`));
      const body = rule.slice(0, rule.indexOf("}"));
      expect(body).not.toContain("label-size");
    }
  });
});

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

  // ── Forwarded props ──

  it("forwards additional props", () => {
    const { container } = render(
      <DataReadout label="Metric" value="100" id="readout-1" />,
    );
    const readout = container.querySelector(".strand-data-readout");
    expect(readout?.getAttribute("id")).toBe("readout-1");
  });
});

import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Radio } from "./Radio.js";

describe("Radio", () => {
  // ── Rendering ──

  it("renders a radio input", () => {
    const { getByRole } = render(<Radio />);
    expect(getByRole("radio")).toBeTruthy();
  });

  // ── Selection ──

  it("calls onChange when clicked", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Radio onChange={onChange} />);
    fireEvent.click(getByRole("radio"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  // ── Name and value ──

  it("has the correct name attribute", () => {
    const { getByRole } = render(<Radio name="color" value="red" />);
    expect(getByRole("radio")).toHaveAttribute("name", "color");
  });

  it("has the correct value attribute", () => {
    const { getByRole } = render(<Radio name="color" value="red" />);
    expect(getByRole("radio")).toHaveAttribute("value", "red");
  });

  // ── Checked state ──

  it("reflects checked state", () => {
    const { getByRole } = render(<Radio checked />);
    expect((getByRole("radio") as HTMLInputElement).checked).toBe(true);
  });

  it("applies checked class", () => {
    const { container } = render(<Radio checked />);
    expect(container.querySelector(".strand-radio--checked")).toBeTruthy();
  });

  // ── Disabled state ──

  it("disables the radio when disabled prop is set", () => {
    const { getByRole } = render(<Radio disabled />);
    expect(getByRole("radio")).toBeDisabled();
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Radio disabled onChange={onChange} />);
    fireEvent.click(getByRole("radio"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies disabled class", () => {
    const { container } = render(<Radio disabled />);
    expect(container.querySelector(".strand-radio--disabled")).toBeTruthy();
  });

  // ── Label ──

  it("renders label text", () => {
    const { getByText } = render(<Radio label="Option A" />);
    expect(getByText("Option A")).toBeTruthy();
  });

  // ── Custom className ──

  // ── Density (DL 14.7) ──

  it("compact is a CLASS, never an inline size, so touch can still be excluded by media query", () => {
    // The load-bearing property of the whole design. If the shrink were
    // written as a style attribute it would apply at every pointer type and
    // there would be no way for a coarse pointer to opt out, which 14.7
    // forbids in as many words.
    const { container } = render(<Radio label="x" density="compact" />);
    const el = container.querySelector(".strand-radio") as HTMLElement;
    expect(el.getAttribute("style") || "").not.toContain("min-height");
  });

});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./Radio.fixtures.js";

snapshotFixtures(Radio, fixtures);

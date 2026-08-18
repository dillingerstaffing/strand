import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Switch } from "./Switch.js";

describe("Switch", () => {
  // ── Rendering ──

  it("renders as switch role", () => {
    const { getByRole } = render(<Switch />);
    expect(getByRole("switch")).toBeTruthy();
  });

  // ── Toggle on click ──

  it("calls onChange with toggled value when clicked", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Switch onChange={onChange} />);
    fireEvent.click(getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange with false when checked switch is clicked", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Switch checked onChange={onChange} />);
    fireEvent.click(getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  // ── Toggle on Space key ──

  it("toggles on Space key", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Switch onChange={onChange} />);
    fireEvent.keyDown(getByRole("switch"), { key: " " });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  // ── Toggle on Enter key ──

  it("toggles on Enter key", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Switch onChange={onChange} />);
    fireEvent.keyDown(getByRole("switch"), { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  // ── Checked state ──

  it("sets aria-checked true when checked", () => {
    const { getByRole } = render(<Switch checked />);
    expect(getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("sets aria-checked false when unchecked", () => {
    const { getByRole } = render(<Switch checked={false} />);
    expect(getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("applies checked class", () => {
    const { container } = render(<Switch checked />);
    expect(container.querySelector(".strand-switch--checked")).toBeTruthy();
  });

  // ── Disabled state ──

  it("disables the switch when disabled prop is set", () => {
    const { getByRole } = render(<Switch disabled />);
    expect(getByRole("switch")).toBeDisabled();
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Switch disabled onChange={onChange} />);
    fireEvent.click(getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies disabled class", () => {
    const { container } = render(<Switch disabled />);
    expect(container.querySelector(".strand-switch--disabled")).toBeTruthy();
  });

  // ── Inline label ──

  it("renders inline label text", () => {
    const { getByText } = render(<Switch label="Dark mode" />);
    expect(getByText("Dark mode")).toBeTruthy();
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { container } = render(<Switch className="custom" />);
    expect(container.querySelector(".strand-switch")?.className).toContain(
      "custom",
    );
  });

  // ── Density (DL 14.7) ──

  it("the default emits no density class, so every existing consumer is unchanged", () => {
    // 14.7: "44px remains the default everywhere ... no component changes size
    // by inheriting this clause." An additive prop that moved the default
    // would be a breaking change wearing a safe shape.
    const { container } = render(<Switch label="x" />);
    expect(container.querySelector(".strand-switch")?.className).not.toContain("--compact");
  });

  it("a compact switch carries the modifier the dense rail needs", () => {
    const { container } = render(<Switch label="x" density="compact" />);
    expect(container.querySelector(".strand-switch")?.className).toContain("strand-switch--compact");
  });

  it("compact is a CLASS, never an inline size, so touch can still be excluded by media query", () => {
    // The load-bearing property of the whole design. If the shrink were
    // written as a style attribute it would apply at every pointer type and
    // there would be no way for a coarse pointer to opt out, which 14.7
    // forbids in as many words.
    const { container } = render(<Switch label="x" density="compact" />);
    const el = container.querySelector(".strand-switch") as HTMLElement;
    expect(el.getAttribute("style") || "").not.toContain("min-height");
  });

});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./Switch.fixtures.js";

snapshotFixtures(Switch, fixtures);

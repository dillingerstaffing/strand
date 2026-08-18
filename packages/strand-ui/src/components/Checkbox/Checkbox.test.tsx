import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Checkbox } from "./Checkbox.js";

describe("Checkbox", () => {
  // ── Rendering ──

  it("renders a checkbox", () => {
    const { getByRole } = render(<Checkbox />);
    expect(getByRole("checkbox")).toBeTruthy();
  });

  // ── Toggle on click ──

  it("calls onChange when clicked", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Checkbox onChange={onChange} />);
    fireEvent.click(getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });



  // ── Indeterminate state ──

  it("shows indeterminate state with aria-checked mixed", () => {
    const { getByRole } = render(<Checkbox indeterminate />);
    expect(getByRole("checkbox")).toHaveAttribute("aria-checked", "mixed");
  });

  it("applies indeterminate class", () => {
    const { container } = render(<Checkbox indeterminate />);
    expect(
      container.querySelector(".strand-checkbox--indeterminate"),
    ).toBeTruthy();
  });

  // ── Checked state ──

  it("sets aria-checked true when checked", () => {
    const { getByRole } = render(<Checkbox checked />);
    expect(getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("sets aria-checked false when unchecked", () => {
    const { getByRole } = render(<Checkbox checked={false} />);
    expect(getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });

  // ── Disabled state ──

  it("disables the checkbox when disabled prop is set", () => {
    const { getByRole } = render(<Checkbox disabled />);
    expect(getByRole("checkbox")).toBeDisabled();
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Checkbox disabled onChange={onChange} />);
    fireEvent.click(getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies disabled class", () => {
    const { container } = render(<Checkbox disabled />);
    expect(container.querySelector(".strand-checkbox--disabled")).toBeTruthy();
  });

  // ── Label ──

  it("renders label text", () => {
    const { getByText } = render(<Checkbox label="Accept terms" />);
    expect(getByText("Accept terms")).toBeTruthy();
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { container } = render(<Checkbox className="custom" />);
    expect(container.querySelector(".strand-checkbox")?.className).toContain(
      "custom",
    );
  });

  // ── Density (DL 14.7) ──

  it("the default emits no density class, so every existing consumer is unchanged", () => {
    // 14.7: "44px remains the default everywhere ... no component changes size
    // by inheriting this clause." An additive prop that moved the default
    // would be a breaking change wearing a safe shape.
    const { container } = render(<Checkbox label="x" />);
    expect(container.querySelector(".strand-checkbox")?.className).not.toContain("--compact");
  });

  it("a compact checkbox carries the modifier the dense rail needs", () => {
    const { container } = render(<Checkbox label="x" density="compact" />);
    expect(container.querySelector(".strand-checkbox")?.className).toContain("strand-checkbox--compact");
  });

  it("compact is a CLASS, never an inline size, so touch can still be excluded by media query", () => {
    // The load-bearing property of the whole design. If the shrink were
    // written as a style attribute it would apply at every pointer type and
    // there would be no way for a coarse pointer to opt out, which 14.7
    // forbids in as many words.
    const { container } = render(<Checkbox label="x" density="compact" />);
    const el = container.querySelector(".strand-checkbox") as HTMLElement;
    expect(el.getAttribute("style") || "").not.toContain("min-height");
  });

});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./Checkbox.fixtures.js";

snapshotFixtures(Checkbox, fixtures);

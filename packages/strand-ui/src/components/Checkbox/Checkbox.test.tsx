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

  // ── Toggle on Space key ──

  it("toggles on Space key via native input", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Checkbox onChange={onChange} />);
    const input = getByRole("checkbox");
    fireEvent.keyDown(input, { key: " " });
    expect(onChange).toHaveBeenCalled();
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
});

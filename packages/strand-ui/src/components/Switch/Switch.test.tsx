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
});

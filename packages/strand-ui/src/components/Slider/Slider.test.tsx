import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Slider } from "./Slider.js";

describe("Slider", () => {
  it("renders a range input", () => {
    const { getByRole } = render(<Slider aria-label="Volume" />);
    expect(getByRole("slider")).toBeTruthy();
  });

  it("has correct default min/max/step", () => {
    const { getByRole } = render(<Slider aria-label="Volume" />);
    const slider = getByRole("slider");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "100");
    expect(slider).toHaveAttribute("step", "1");
  });

  it("accepts custom min/max/step", () => {
    const { getByRole } = render(
      <Slider min={10} max={50} step={5} aria-label="Volume" />
    );
    const slider = getByRole("slider");
    expect(slider).toHaveAttribute("min", "10");
    expect(slider).toHaveAttribute("max", "50");
    expect(slider).toHaveAttribute("step", "5");
  });

  it("calls onChange on input", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <Slider onChange={onChange} aria-label="Volume" />
    );
    fireEvent.change(getByRole("slider"), { target: { value: "50" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("sets disabled attribute when disabled", () => {
    const { getByRole } = render(<Slider disabled aria-label="Volume" />);
    expect(getByRole("slider")).toBeDisabled();
  });

  it("applies disabled class to wrapper when disabled", () => {
    const { container } = render(<Slider disabled aria-label="Volume" />);
    expect(container.querySelector(".strand-slider--disabled")).toBeTruthy();
  });

  it("sets value on the input", () => {
    const { getByRole } = render(<Slider value={42} aria-label="Volume" />);
    expect((getByRole("slider") as HTMLInputElement).value).toBe("42");
  });

  it("merges custom className", () => {
    const { container } = render(
      <Slider className="custom" aria-label="Volume" />
    );
    expect(container.querySelector(".strand-slider")?.className).toContain("custom");
  });

  it("has aria-valuemin attribute", () => {
    const { getByRole } = render(<Slider min={5} aria-label="Volume" />);
    expect(getByRole("slider")).toHaveAttribute("aria-valuemin", "5");
  });

  it("has aria-valuemax attribute", () => {
    const { getByRole } = render(<Slider max={200} aria-label="Volume" />);
    expect(getByRole("slider")).toHaveAttribute("aria-valuemax", "200");
  });

  it("has aria-valuenow attribute", () => {
    const { getByRole } = render(<Slider value={75} aria-label="Volume" />);
    expect(getByRole("slider")).toHaveAttribute("aria-valuenow", "75");
  });

  it("forwards ref to input element", () => {
    let inputEl: HTMLInputElement | null = null;
    render(
      <Slider
        aria-label="Volume"
        ref={(el: HTMLInputElement | null) => { inputEl = el; }}
      />
    );
    expect(inputEl).toBeInstanceOf(HTMLInputElement);
  });
});

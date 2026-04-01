import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Input } from "./Input.js";

describe("Input", () => {
  it("renders an input element", () => {
    const { getByRole } = render(<Input aria-label="Name" />);
    expect(getByRole("textbox")).toBeTruthy();
  });

  it("defaults to type text", () => {
    const { getByRole } = render(<Input aria-label="Name" />);
    expect(getByRole("textbox")).toHaveAttribute("type", "text");
  });

  it("accepts type email", () => {
    const { container } = render(<Input type="email" aria-label="Email" />);
    expect(container.querySelector("input")).toHaveAttribute("type", "email");
  });

  it("accepts type password", () => {
    const { container } = render(<Input type="password" aria-label="Password" />);
    expect(container.querySelector("input")).toHaveAttribute("type", "password");
  });

  it("accepts type number", () => {
    const { container } = render(<Input type="number" aria-label="Count" />);
    expect(container.querySelector("input")).toHaveAttribute("type", "number");
  });

  it("accepts type search", () => {
    const { getByRole } = render(<Input type="search" aria-label="Search" />);
    expect(getByRole("searchbox")).toBeTruthy();
  });

  it("renders placeholder text", () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter name" aria-label="Name" />
    );
    expect(getByPlaceholderText("Enter name")).toBeTruthy();
  });

  it("calls onChange when value changes", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <Input aria-label="Name" onChange={onChange} />
    );
    fireEvent.input(getByRole("textbox"), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("sets disabled attribute", () => {
    const { getByRole } = render(<Input aria-label="Name" disabled />);
    expect(getByRole("textbox")).toBeDisabled();
  });

  it("applies error class when error prop is true", () => {
    const { container } = render(<Input aria-label="Name" error />);
    expect(container.querySelector(".strand-input--error")).toBeTruthy();
  });

  it("sets aria-invalid when error is true", () => {
    const { getByRole } = render(<Input aria-label="Name" error />);
    expect(getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("renders leading addon", () => {
    const { container } = render(
      <Input aria-label="Amount" leadingAddon={<span>$</span>} />
    );
    expect(container.querySelector(".strand-input__leading")).toBeTruthy();
  });

  it("renders trailing addon", () => {
    const { container } = render(
      <Input aria-label="Weight" trailingAddon={<span>kg</span>} />
    );
    expect(container.querySelector(".strand-input__trailing")).toBeTruthy();
  });

  it("merges custom className", () => {
    const { container } = render(
      <Input aria-label="Name" className="custom" />
    );
    expect(container.querySelector(".strand-input")?.className).toContain("custom");
  });

  it("forwards ref to input element", () => {
    let inputEl: HTMLInputElement | null = null;
    render(
      <Input aria-label="Name" ref={(el: HTMLInputElement | null) => { inputEl = el; }} />
    );
    expect(inputEl).toBeInstanceOf(HTMLInputElement);
  });
});

import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Select } from "./Select.js";

const defaultOptions = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" },
];

describe("Select", () => {
  it("renders a select element", () => {
    const { getByRole } = render(
      <Select options={defaultOptions} aria-label="Choice" />
    );
    expect(getByRole("combobox")).toBeTruthy();
  });

  it("shows placeholder as first disabled option", () => {
    const { getByRole } = render(
      <Select options={defaultOptions} placeholder="Pick one" aria-label="Choice" />
    );
    const select = getByRole("combobox") as HTMLSelectElement;
    const firstOption = select.options[0];
    expect(firstOption.textContent).toBe("Pick one");
    expect(firstOption.disabled).toBe(true);
    expect(firstOption.value).toBe("");
  });

  it("renders all options", () => {
    const { getByRole } = render(
      <Select options={defaultOptions} aria-label="Choice" />
    );
    const select = getByRole("combobox") as HTMLSelectElement;
    expect(select.options.length).toBe(3);
    expect(select.options[0].textContent).toBe("Alpha");
    expect(select.options[1].textContent).toBe("Beta");
    expect(select.options[2].textContent).toBe("Gamma");
  });

  it("calls onChange on selection", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <Select options={defaultOptions} onChange={onChange} aria-label="Choice" />
    );
    const select = getByRole("combobox") as HTMLSelectElement;
    // Preact onChange maps to native "change" event; dispatch it directly
    select.value = "b";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onChange).toHaveBeenCalled();
  });

  it("applies error class when error prop is true", () => {
    const { container } = render(
      <Select options={defaultOptions} error aria-label="Choice" />
    );
    expect(container.querySelector(".strand-select--error")).toBeTruthy();
  });

  it("sets aria-invalid when error is true", () => {
    const { getByRole } = render(
      <Select options={defaultOptions} error aria-label="Choice" />
    );
    expect(getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });

  it("sets disabled attribute when disabled", () => {
    const { getByRole } = render(
      <Select options={defaultOptions} disabled aria-label="Choice" />
    );
    expect(getByRole("combobox")).toBeDisabled();
  });

  it("applies disabled class to wrapper when disabled", () => {
    const { container } = render(
      <Select options={defaultOptions} disabled aria-label="Choice" />
    );
    expect(container.querySelector(".strand-select--disabled")).toBeTruthy();
  });

  it("merges custom className", () => {
    const { container } = render(
      <Select options={defaultOptions} className="custom" aria-label="Choice" />
    );
    expect(container.querySelector(".strand-select")?.className).toContain("custom");
  });

  it("forwards ref to select element", () => {
    let selectEl: HTMLSelectElement | null = null;
    render(
      <Select
        options={defaultOptions}
        aria-label="Choice"
        ref={(el: HTMLSelectElement | null) => { selectEl = el; }}
      />
    );
    expect(selectEl).toBeInstanceOf(HTMLSelectElement);
  });
});

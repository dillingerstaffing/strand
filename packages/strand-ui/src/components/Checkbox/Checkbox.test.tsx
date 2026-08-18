import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Checkbox } from "./Checkbox.js";

describe("Checkbox", () => {
  it("renders a native checkbox", () => {
    const { getByRole } = render(<Checkbox />);
    expect(getByRole("checkbox")).toBeTruthy();
  });

  it("calls onChange when clicked", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Checkbox onChange={onChange} />);
    fireEvent.click(getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("is checked when checked, and mixed when indeterminate", () => {
    const checked = render(<Checkbox checked onChange={() => {}} />);
    expect(checked.getByRole("checkbox")).toBeChecked();
    checked.unmount();
    const mixed = render(<Checkbox indeterminate />);
    expect(mixed.getByRole("checkbox")).toBePartiallyChecked();
  });

  it("owns its state when uncontrolled: defaultChecked, then toggling on click", () => {
    const { getByRole } = render(<Checkbox defaultChecked />);
    const box = getByRole("checkbox") as HTMLInputElement;
    expect(box).toBeChecked();
    fireEvent.click(box);
    expect(box).not.toBeChecked();
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Checkbox disabled onChange={onChange} />);
    expect(getByRole("checkbox")).toBeDisabled();
    fireEvent.click(getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders label text", () => {
    const { getByText } = render(<Checkbox label="Accept terms" />);
    expect(getByText("Accept terms")).toBeTruthy();
  });

  it("compact is a class, never an inline size, so touch can still be excluded by media query", () => {
    const { container } = render(<Checkbox label="x" density="compact" />);
    const el = container.querySelector(".strand-checkbox") as HTMLElement;
    expect(el.classList.contains("strand-checkbox--compact")).toBe(true);
    expect(el.getAttribute("style") || "").not.toContain("min-height");
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./Checkbox.fixtures.js";

snapshotFixtures(Checkbox, fixtures);

snapshotStylesheet(resolve(__dirname, "./Checkbox.css"));

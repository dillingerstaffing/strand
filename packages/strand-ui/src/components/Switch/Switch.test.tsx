import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Switch } from "./Switch.js";

describe("Switch", () => {
  it("renders as a switch that reports its state through aria-checked", () => {
    const off = render(<Switch checked={false} onChange={() => {}} />);
    expect(off.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    off.unmount();
    const on = render(<Switch checked onChange={() => {}} />);
    expect(on.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange with the toggled value when clicked", () => {
    const onChange = vi.fn();
    const off = render(<Switch checked={false} onChange={onChange} />);
    fireEvent.click(off.getByRole("switch"));
    expect(onChange).toHaveBeenLastCalledWith(true);
    off.unmount();
    render(<Switch checked onChange={onChange} />);
    fireEvent.click(document.querySelector('[role="switch"]') as HTMLElement);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("owns its state when uncontrolled: defaultChecked, then toggling on click", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Switch defaultChecked onChange={onChange} />);
    expect(getByRole("switch")).toHaveAttribute("aria-checked", "true");
    fireEvent.click(getByRole("switch"));
    expect(getByRole("switch")).toHaveAttribute("aria-checked", "false");
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Switch disabled onChange={onChange} />);
    expect(getByRole("switch")).toBeDisabled();
    fireEvent.click(getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders inline label text", () => {
    const { getByText } = render(<Switch label="Dark mode" />);
    expect(getByText("Dark mode")).toBeTruthy();
  });

  it("compact is a class, never an inline size, so touch can still be excluded by media query", () => {
    const { container } = render(<Switch label="x" density="compact" />);
    const el = container.querySelector(".strand-switch") as HTMLElement;
    expect(el.classList.contains("strand-switch--compact")).toBe(true);
    expect(el.getAttribute("style") || "").not.toContain("min-height");
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./Switch.fixtures.js";

snapshotFixtures(Switch, fixtures);

snapshotStylesheet(resolve(__dirname, "./Switch.css"));

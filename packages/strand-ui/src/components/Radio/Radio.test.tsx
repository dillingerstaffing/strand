import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Radio } from "./Radio.js";

describe("Radio", () => {
  it("renders a native radio with its name and value", () => {
    const { getByRole } = render(<Radio name="plan" value="pro" />);
    const radio = getByRole("radio") as HTMLInputElement;
    expect(radio.name).toBe("plan");
    expect(radio.value).toBe("pro");
  });

  it("calls onChange when clicked", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Radio onChange={onChange} />);
    fireEvent.click(getByRole("radio"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("is checked when checked", () => {
    const { getByRole } = render(<Radio checked onChange={() => {}} />);
    expect(getByRole("radio")).toBeChecked();
  });

  it("owns its state when uncontrolled: defaultChecked, and the group moves the check", () => {
    const { getAllByRole } = render(
      <div>
        <Radio name="g" value="a" defaultChecked />
        <Radio name="g" value="b" />
      </div>,
    );
    const [a, b] = getAllByRole("radio") as HTMLInputElement[];
    expect(a).toBeChecked();
    fireEvent.click(b);
    expect(b).toBeChecked();
    expect(a).not.toBeChecked();
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Radio disabled onChange={onChange} />);
    expect(getByRole("radio")).toBeDisabled();
    fireEvent.click(getByRole("radio"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders label text", () => {
    const { getByText } = render(<Radio label="Option A" />);
    expect(getByText("Option A")).toBeTruthy();
  });

  it("compact is a class, never an inline size, so touch can still be excluded by media query", () => {
    const { container } = render(<Radio label="x" density="compact" />);
    const el = container.querySelector(".strand-radio") as HTMLElement;
    expect(el.classList.contains("strand-radio--compact")).toBe(true);
    expect(el.getAttribute("style") || "").not.toContain("min-height");
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./Radio.fixtures.js";

snapshotFixtures(Radio, fixtures);

snapshotStylesheet(resolve(__dirname, "./Radio.css"));

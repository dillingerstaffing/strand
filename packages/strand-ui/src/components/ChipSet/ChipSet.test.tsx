import { fireEvent, render } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { ChipSet } from "./ChipSet.js";

const ITEMS = [
  { id: "outdoors", label: "Outdoors" },
  { id: "making", label: "Making" },
  { id: "games", label: "Games" },
];

describe("ChipSet", () => {
  it("is a named group of chips", () => {
    const { container } = render(<ChipSet label="Interests" items={ITEMS} />);
    const set = container.querySelector(".strand-chip-set");
    expect(set?.getAttribute("role")).toBe("group");
    expect(set?.getAttribute("aria-label")).toBe("Interests");
    expect(container.querySelectorAll(".strand-chip-set__chip")).toHaveLength(3);
  });

  // "Any of these" and "one of these" are different promises. Painting
  // them identically tells a screen reader nothing about which it is.
  it("uses a radiogroup for single-select and a group for multi", () => {
    const { container: multi } = render(<ChipSet label="I" items={ITEMS} />);
    expect(multi.querySelector(".strand-chip-set")?.getAttribute("role")).toBe("group");
    const { container: single } = render(
      <ChipSet label="F" items={ITEMS} mode="single" />,
    );
    expect(single.querySelector(".strand-chip-set")?.getAttribute("role")).toBe("radiogroup");
    expect(single.querySelector(".strand-chip-set__chip")?.getAttribute("role")).toBe("radio");
  });

  it("announces selection with the attribute that also styles it", () => {
    const { container } = render(
      <ChipSet label="I" items={ITEMS} selected={["making"]} />,
    );
    const pressed = container.querySelectorAll('[aria-pressed="true"]');
    expect(pressed).toHaveLength(1);
    expect(pressed[0].textContent).toBe("Making");
  });

  it("uses aria-checked in single-select, not aria-pressed", () => {
    const { container } = render(
      <ChipSet label="F" items={ITEMS} mode="single" selected={["games"]} />,
    );
    expect(container.querySelectorAll('[aria-checked="true"]')).toHaveLength(1);
    expect(container.querySelectorAll("[aria-pressed]")).toHaveLength(0);
  });

  it("adds a selection in multi-select and keeps the rest", () => {
    const onSelectionChange = vi.fn();
    const { container } = render(
      <ChipSet label="I" items={ITEMS} selected={["outdoors"]} onSelectionChange={onSelectionChange} />,
    );
    fireEvent.click(container.querySelectorAll(".strand-chip-set__chip")[1]);
    expect(onSelectionChange).toHaveBeenCalledWith(["outdoors", "making"]);
  });

  it("removes a selection in multi-select", () => {
    const onSelectionChange = vi.fn();
    const { container } = render(
      <ChipSet label="I" items={ITEMS} selected={["outdoors", "making"]} onSelectionChange={onSelectionChange} />,
    );
    fireEvent.click(container.querySelectorAll(".strand-chip-set__chip")[0]);
    expect(onSelectionChange).toHaveBeenCalledWith(["making"]);
  });

  // The whole point of the mode: choosing replaces rather than adds.
  it("replaces the selection in single-select", () => {
    const onSelectionChange = vi.fn();
    const { container } = render(
      <ChipSet label="F" items={ITEMS} mode="single" selected={["outdoors"]} onSelectionChange={onSelectionChange} />,
    );
    fireEvent.click(container.querySelectorAll(".strand-chip-set__chip")[2]);
    expect(onSelectionChange).toHaveBeenCalledWith(["games"]);
  });

  it("wraps by default and composes the scroll row when asked", () => {
    const { container: wrap } = render(<ChipSet label="I" items={ITEMS} />);
    expect(wrap.querySelector(".strand-chip-set")?.classList.contains("strand-scroll-row")).toBe(false);
    const { container: scroll } = render(
      <ChipSet label="I" items={ITEMS} overflow="scroll" />,
    );
    const set = scroll.querySelector(".strand-chip-set");
    // Composes the shared contract rather than restating it, so a chip
    // strip and every other scrolling row mean the same thing.
    expect(set?.classList.contains("strand-scroll-row")).toBe(true);
    expect(set?.classList.contains("strand-chip-set--scroll")).toBe(true);
  });
});

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

  // A filter strip above a dense list is drawn smaller than one that is the
  // page's main control. Before `size`, a consumer wanting that had to override
  // `.strand-chip-set__chip`, which the dogfood protocol forbids.
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./ChipSet.fixtures.js";

snapshotFixtures(ChipSet, fixtures);

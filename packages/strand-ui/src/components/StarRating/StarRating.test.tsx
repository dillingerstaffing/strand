import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { StarRating } from "./StarRating.js";

describe("StarRating", () => {
  it("renders five stars with radio role", () => {
    const { getAllByRole } = render(
      <StarRating value={0} onChange={() => {}} ariaLabel="Rate" />,
    );
    expect(getAllByRole("radio")).toHaveLength(5);
  });

  it("marks the selected star as aria-checked true", () => {
    const { getAllByRole } = render(
      <StarRating value={3} onChange={() => {}} ariaLabel="Rate" />,
    );
    const radios = getAllByRole("radio");
    expect(radios[2]).toHaveAttribute("aria-checked", "true");
    expect(radios[0]).toHaveAttribute("aria-checked", "false");
  });

  it("calls onChange with the star index on click", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <StarRating value={0} onChange={onChange} ariaLabel="Rate" />,
    );
    fireEvent.click(getAllByRole("radio")[3]);
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("does not call onChange in read-only mode", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <StarRating value={2} onChange={onChange} ariaLabel="Rate" readOnly />,
    );
    fireEvent.click(getAllByRole("radio")[4]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("activates a star on Space key", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <StarRating value={0} onChange={onChange} ariaLabel="Rate" />,
    );
    fireEvent.keyDown(getAllByRole("radio")[1], { key: " " });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("activates a star on Enter key", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <StarRating value={0} onChange={onChange} ariaLabel="Rate" />,
    );
    fireEvent.keyDown(getAllByRole("radio")[4], { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("applies active class to stars up to the value", () => {
    const { container } = render(
      <StarRating value={3} onChange={() => {}} ariaLabel="Rate" />,
    );
    const active = container.querySelectorAll(".strand-star-rating__star--active");
    expect(active).toHaveLength(3);
  });

  it("applies hover class on mouse enter", () => {
    const { container, getAllByRole } = render(
      <StarRating value={0} onChange={() => {}} ariaLabel="Rate" />,
    );
    fireEvent.mouseEnter(getAllByRole("radio")[3]);
    const active = container.querySelectorAll(".strand-star-rating__star--active");
    expect(active).toHaveLength(4);
  });

  it("resets hover state on mouse leave", () => {
    const { container, getAllByRole } = render(
      <StarRating value={2} onChange={() => {}} ariaLabel="Rate" />,
    );
    fireEvent.mouseEnter(getAllByRole("radio")[4]);
    fireEvent.mouseLeave(getAllByRole("radio")[4]);
    const active = container.querySelectorAll(".strand-star-rating__star--active");
    expect(active).toHaveLength(2);
  });

  it("applies the size modifier class", () => {
    const { container } = render(
      <StarRating value={0} onChange={() => {}} ariaLabel="Rate" size="lg" />,
    );
    expect(container.querySelector(".strand-star-rating--lg")).toBeTruthy();
  });

  it("defaults to md size", () => {
    const { container } = render(
      <StarRating value={0} onChange={() => {}} ariaLabel="Rate" />,
    );
    expect(container.querySelector(".strand-star-rating--md")).toBeTruthy();
  });

  it("applies readonly class when readOnly is set", () => {
    const { container } = render(
      <StarRating value={3} onChange={() => {}} ariaLabel="Rate" readOnly />,
    );
    expect(
      container.querySelector(".strand-star-rating--readonly"),
    ).toBeTruthy();
  });

  it("renders aria-label from prop", () => {
    const { container } = render(
      <StarRating value={0} onChange={() => {}} ariaLabel="Rate event" />,
    );
    expect(
      container.querySelector('[aria-label="Rate event"]'),
    ).toBeTruthy();
  });

  it("exposes data-strand-component attribute for vanilla hydration", () => {
    const { container } = render(
      <StarRating value={0} onChange={() => {}} ariaLabel="Rate" />,
    );
    expect(
      container.querySelector('[data-strand-component="star-rating"]'),
    ).toBeTruthy();
  });

  it("merges custom className", () => {
    const { container } = render(
      <StarRating
        value={0}
        onChange={() => {}}
        ariaLabel="Rate"
        className="custom"
      />,
    );
    expect(container.querySelector(".strand-star-rating")?.className).toContain(
      "custom",
    );
  });

  it("disables star buttons in read-only mode", () => {
    const { getAllByRole } = render(
      <StarRating value={3} onChange={() => {}} ariaLabel="Rate" readOnly />,
    );
    for (const star of getAllByRole("radio")) {
      expect(star).toBeDisabled();
    }
  });
});

// ── Focus appearance (SC 2.4.11) ──
//
// The focus style was `outline: none` plus --strand-focus-ring, which is
// rgba(59,130,246,0.1). Over white that paints rgb(235,243,254): measured
// 1.12:1 against the unfocused star, where 2.4.11 asks 3:1. A keyboard user
// could not see which star they were on, and this composes into the product's
// rating flow, not just the showcase.
//
// No axe rule covers 2.4.11 -- focus appearance is not automatable that way --
// so every contrast suite in the project was blind to it. Hence a guard here.
describe("StarRating focus is visible (SC 2.4.11)", () => {
  const css = readFileSync(resolve(__dirname, "StarRating.css"), "utf8");
  const rule = css.match(/\.strand-star-rating__star:focus-visible\s*\{([^}]*)\}/)?.[1];

  it("finds the focus rule (guards the parse)", () => {
    expect(rule).toBeDefined();
  });

  it("draws a real outline rather than suppressing it", () => {
    expect(rule).toMatch(/outline:\s*2px\s+solid/);
    expect(rule).not.toMatch(/outline:\s*none/);
  });

  it("does not lean on the low-alpha focus ring as its only indicator", () => {
    // The shared token stays as it is: six of its nine usages pair it with a
    // border-color change where subtle glow is correct, so raising it would
    // make six correct components look heavy. The fix belongs to the two
    // places that used it alone, not to the token.
    expect(rule).not.toContain("--strand-focus-ring");
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./StarRating.fixtures.js";

snapshotFixtures(StarRating, fixtures);

import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { StatStrip } from "./StatStrip.js";

const ITEMS = [
  { label: "Group", value: "East Bay" },
  { label: "Meet at", value: "Skyline Gate" },
  { label: "Cost", value: "Free" },
];

describe("StatStrip", () => {
  // A row of divs gives a screen reader six unrelated strings. A
  // description list gives it three pairs, which is what the row means.
  it("is a description list of term and description pairs", () => {
    const { container } = render(<StatStrip items={ITEMS} />);
    expect(container.querySelector(".strand-stat-strip")?.tagName).toBe("DL");
    expect(container.querySelectorAll("dt")).toHaveLength(3);
    expect(container.querySelectorAll("dd")).toHaveLength(3);
  });

  // The wrapping div is what pairs a dt with its dd when several sit side
  // by side; without it the association is only visual.
  it("groups each term with its own description", () => {
    const { container } = render(<StatStrip items={ITEMS} />);
    const cells = container.querySelectorAll(".strand-stat-strip__cell");
    expect(cells).toHaveLength(3);
    expect(cells[0].querySelector("dt")?.textContent).toBe("Group");
    expect(cells[0].querySelector("dd")?.textContent).toBe("East Bay");
  });

  it("defaults to the plain density", () => {
    const { container } = render(<StatStrip items={ITEMS} />);
    expect(
      container.querySelector(".strand-stat-strip")?.classList.contains(
        "strand-stat-strip--bordered",
      ),
    ).toBe(false);
  });

  it("takes the bordered density", () => {
    const { container } = render(<StatStrip items={ITEMS} variant="bordered" />);
    expect(
      container.querySelector(".strand-stat-strip")?.classList.contains(
        "strand-stat-strip--bordered",
      ),
    ).toBe(true);
  });

  it("renders nothing but the list when there are no items", () => {
    // Guards a crash during a loading transition.
    const { container } = render(<StatStrip items={[]} />);
    expect(container.querySelector(".strand-stat-strip")).not.toBeNull();
    expect(container.querySelectorAll(".strand-stat-strip__cell")).toHaveLength(0);
  });

  it("carries a consumer's class without dropping its own", () => {
    const { container } = render(<StatStrip items={ITEMS} className="x" />);
    expect(container.querySelector(".strand-stat-strip")?.classList.contains("x")).toBe(true);
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./StatStrip.fixtures.js";

snapshotFixtures(StatStrip, fixtures);

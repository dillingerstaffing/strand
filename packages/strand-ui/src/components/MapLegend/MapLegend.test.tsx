import { fireEvent, render } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { MapLegend } from "./MapLegend.js";

const ITEMS = [
  { category: "tech" as const, label: "Technology" },
  { category: "health" as const, label: "Health" },
];

describe("MapLegend", () => {
  it("renders a titled key with one row per category", () => {
    const { container } = render(<MapLegend items={ITEMS} />);
    expect(container.querySelector(".strand-map-legend__title")?.textContent).toBe("Legend");
    expect(container.querySelectorAll(".strand-map-legend__item")).toHaveLength(2);
  });

  it("draws the sector dot for each category", () => {
    const { container } = render(<MapLegend items={ITEMS} />);
    expect(container.querySelector(".strand-map-legend__dot--tech")).not.toBeNull();
    expect(container.querySelector(".strand-map-legend__dot--health")).not.toBeNull();
  });

  it("hides the dot from the accessibility tree", () => {
    // The label beside it already names the category; an exposed swatch is
    // a second announcement of the same fact.
    const { container } = render(<MapLegend items={ITEMS} />);
    expect(container.querySelector(".strand-map-legend__dot")?.getAttribute("aria-hidden")).toBe("true");
  });

  // A legend that only explains is not interactive. Giving every row a
  // button role would promise an action the user cannot take, and put a
  // tab stop on each one.
  it("renders a non-filtering row as a plain element, not a button", () => {
    const { container } = render(<MapLegend items={ITEMS} />);
    expect(container.querySelector("button")).toBeNull();
  });

  it("renders a filtering row as a button and reports the category", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <MapLegend items={[{ ...ITEMS[0], onSelect }]} />,
    );
    const btn = container.querySelector(".strand-map-legend__item") as HTMLElement;
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.getAttribute("type")).toBe("button");
    fireEvent.click(btn);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("takes a custom title", () => {
    const { container } = render(<MapLegend items={ITEMS} title="Sectors" />);
    expect(container.querySelector(".strand-map-legend__title")?.textContent).toBe("Sectors");
  });

  it("carries a consumer's class without dropping its own", () => {
    const { container } = render(<MapLegend items={ITEMS} className="x" />);
    const el = container.querySelector(".strand-map-legend");
    expect(el?.classList.contains("x")).toBe(true);
  });
});

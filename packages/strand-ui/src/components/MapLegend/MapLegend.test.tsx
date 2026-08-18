import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/preact";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { MapLegend } from "./MapLegend.js";
import { fixtures } from "./MapLegend.fixtures.js";

snapshotFixtures(MapLegend, fixtures);

describe("MapLegend", () => {
  it("a filtering row is a button and reports activation", () => {
    const onSelect = vi.fn();
    const { getByRole } = render(<MapLegend items={[{ category: "tech", label: "Technology", onSelect }]} />);
    fireEvent.click(getByRole("button", { name: "Technology" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

snapshotStylesheet(resolve(__dirname, "./MapLegend.css"));

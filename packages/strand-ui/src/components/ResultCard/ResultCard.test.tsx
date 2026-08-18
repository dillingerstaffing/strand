import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/preact";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { ResultCard } from "./ResultCard.js";
import { fixtures } from "./ResultCard.fixtures.js";

snapshotFixtures(ResultCard, fixtures);

describe("ResultCard", () => {
  it("is a button when selectable, and reports activation", () => {
    const onSelect = vi.fn();
    const { getByRole } = render(<ResultCard title="Only" onSelect={onSelect} />);
    fireEvent.click(getByRole("button"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

snapshotStylesheet(resolve(__dirname, "./ResultCard.css"));

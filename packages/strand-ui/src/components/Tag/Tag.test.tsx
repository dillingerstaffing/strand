import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/preact";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Tag } from "./Tag.js";
import { fixtures } from "./Tag.fixtures.js";

snapshotFixtures(Tag, fixtures);

describe("Tag", () => {
  it("the remove control calls onRemove", () => {
    const onRemove = vi.fn();
    const { getByRole } = render(<Tag removable onRemove={onRemove}>Active</Tag>);
    fireEvent.click(getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("names the remove control from removeLabel", () => {
    const { getByRole } = render(<Tag removable removeLabel="Remove Active">Active</Tag>);
    expect(getByRole("button", { name: "Remove Active" })).toBeTruthy();
  });
});

snapshotStylesheet(resolve(__dirname, "./Tag.css"));

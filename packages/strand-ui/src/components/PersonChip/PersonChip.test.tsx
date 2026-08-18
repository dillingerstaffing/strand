import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/preact";
import { snapshotFixtures } from "../../test/snapshot.js";
import { PersonChip, initialsFrom } from "./PersonChip.js";
import { fixtures } from "./PersonChip.fixtures.js";

snapshotFixtures(PersonChip, fixtures);

describe("initialsFrom", () => {
  it("takes the first and last words", () => {
    expect(initialsFrom("Maria Klein")).toBe("MK");
    expect(initialsFrom("Ana Lucia de la Cruz")).toBe("AC");
  });
  it("handles a single name and messy input", () => {
    expect(initialsFrom("Ada")).toBe("A");
    expect(initialsFrom("  ada   lovelace ")).toBe("AL");
    expect(initialsFrom("")).toBe("");
  });
});

describe("PersonChip", () => {
  it("is a button when it does something, and reports activation", () => {
    const onSelect = vi.fn();
    const { getByRole } = render(<PersonChip name="Ana Ruiz" onSelect={onSelect} />);
    fireEvent.click(getByRole("button"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

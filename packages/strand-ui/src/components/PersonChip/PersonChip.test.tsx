import { fireEvent, render } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { initialsFrom, PersonChip } from "./PersonChip.js";

describe("initialsFrom", () => {
  it("takes the first and last words", () => {
    expect(initialsFrom("Maria Klein")).toBe("MK");
    expect(initialsFrom("Ana Sofia Ruiz")).toBe("AR");
  });

  it("handles a single name without inventing a second letter", () => {
    expect(initialsFrom("Prince")).toBe("P");
  });

  it("survives the inputs a real name field produces", () => {
    // Leading, trailing and doubled whitespace all reach this from a
    // form, and a blank name must not throw in a strip of thirty.
    expect(initialsFrom("  Maria   Klein  ")).toBe("MK");
    expect(initialsFrom("")).toBe("");
    expect(initialsFrom("   ")).toBe("");
  });
});

describe("PersonChip", () => {
  it("renders the name and derived initials", () => {
    const { container } = render(<PersonChip name="Maria Klein" />);
    expect(container.querySelector(".strand-person-chip__name")?.textContent).toBe("Maria Klein");
    expect(container.querySelector(".strand-person-chip__avatar")?.textContent).toBe("MK");
  });

  it("takes explicit initials over the derived ones", () => {
    const { container } = render(<PersonChip name="Maria Klein" initials="MJ" />);
    expect(container.querySelector(".strand-person-chip__avatar")?.textContent).toBe("MJ");
  });

  // Announcing "MK, Maria Klein" reads the same person twice. The name is
  // the accessible name; the circle is decoration.
  it("hides the initials circle from the accessibility tree", () => {
    const { container } = render(<PersonChip name="Maria Klein" />);
    expect(
      container.querySelector(".strand-person-chip__avatar")?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  // A strip of thirty non-interactive chips would otherwise be thirty tab
  // stops promising an action that does not exist.
  it("is not a control when it does nothing", () => {
    const { container } = render(<PersonChip name="Maria Klein" />);
    const el = container.querySelector(".strand-person-chip");
    expect(el?.tagName).toBe("SPAN");
    expect(el?.classList.contains("strand-person-chip--action")).toBe(false);
  });

  it("is a button when it does something, and reports activation", () => {
    const onSelect = vi.fn();
    const { container } = render(<PersonChip name="Maria Klein" onSelect={onSelect} />);
    const el = container.querySelector(".strand-person-chip") as HTMLElement;
    expect(el.tagName).toBe("BUTTON");
    expect(el.getAttribute("type")).toBe("button");
    expect(el.classList.contains("strand-person-chip--action")).toBe(true);
    fireEvent.click(el);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
  // The secondary is the optional half of one person's identity, so it is
  // part of the accessible name: announcing only the username names
  // somebody the reader cannot match to what is on screen.
  it("renders a secondary label beside the name, both readable", () => {
    const { container } = render(<PersonChip name="steady-kestrel-865" secondary="Grace" />);
    expect(container.querySelector(".strand-person-chip__name")?.textContent).toBe(
      "steady-kestrel-865",
    );
    expect(container.querySelector(".strand-person-chip__secondary")?.textContent).toBe("Grace");
    expect(container.querySelector(".strand-person-chip")?.textContent).toContain("Grace");
  });

  it("omits the secondary element entirely when there is none", () => {
    const { container } = render(<PersonChip name="Maria Klein" />);
    expect(container.querySelector(".strand-person-chip__secondary")).toBeNull();
  });

  // The separator is a CSS ::before, so it must not appear in the DOM text
  // a screen reader walks.
  it("keeps the separator out of the text content", () => {
    const { container } = render(<PersonChip name="ada" secondary="Ada" />);
    expect(container.querySelector(".strand-person-chip")?.textContent).not.toContain("\u00b7");
  });
});

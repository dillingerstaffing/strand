import { resolve } from "node:path";
import { render, fireEvent, waitFor } from "@testing-library/preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CommandPalette } from "./CommandPalette.js";

// The canonical implementation had NO test file while every other strand-ui
// component carried one, and the Vue and Svelte ports were tested because they
// were written here. That gap is the direct reason a broken keyboard path
// reached npm: the component's only interaction model is "open and type", and
// nothing asserted that typing was possible.

const ITEMS = [
  { id: "a", label: "Alpha", sublabel: "first" },
  { id: "b", label: "Beta", badge: "Channel" },
  { id: "c", label: "Gamma" },
];

function setup(overrides = {}) {
  const props = {
    open: true,
    onClose: vi.fn(),
    items: ITEMS,
    query: "",
    onQueryChange: vi.fn(),
    onSelect: vi.fn(),
    ...overrides,
  };
  const utils = render(<CommandPalette {...props} />);
  return { ...utils, props };
}

const combobox = () => document.querySelector("[role=combobox]") as HTMLInputElement;
const options = () => Array.from(document.querySelectorAll("[role=option]"));

describe("CommandPalette", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when closed", () => {
    const { container } = setup({ open: false });
    expect(container.innerHTML).toBe("");
  });

  // ── The defect this file exists for ──

  it("puts the caret in the search field when it opens, so the visitor can type", async () => {
    // Dialog focuses the first focusable element in its panel, which is its own
    // close button. For this component that is fatal rather than merely
    // suboptimal: the visitor opens a SEARCH overlay and their keystrokes go to
    // a button. Measured in a real browser before the fix, activeElement was
    // BUTTON.strand-dialog__close.
    setup();
    await waitFor(() => {
      expect(document.activeElement).toBe(combobox());
    });
  });

  it("does not steal focus while it is closed", async () => {
    const anchor = document.createElement("button");
    document.body.appendChild(anchor);
    anchor.focus();
    setup({ open: false });
    await new Promise((r) => setTimeout(r, 20));
    expect(document.activeElement).toBe(anchor);
    anchor.remove();
  });

  // ── Roles and ARIA ──

  it("exposes the combobox and listbox roles a screen reader navigates by", () => {
    setup();
    expect(combobox()).toBeTruthy();
    expect(document.querySelector("[role=listbox]")).toBeTruthy();
    expect(options()).toHaveLength(3);
  });

  it("points aria-activedescendant at the highlighted option, so focus can stay in the field", () => {
    setup();
    const target = options()[0].id;
    expect(combobox().getAttribute("aria-activedescendant")).toBe(target);
  });

  it("omits aria-activedescendant entirely when there is nothing to point at", () => {
    setup({ items: [] });
    expect(combobox().getAttribute("aria-activedescendant")).toBeNull();
  });

  // ── Selection ──

  it("moves the highlight down and wraps past the end", () => {
    setup();
    const input = combobox();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options()[1].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options()[0].getAttribute("aria-selected")).toBe("true");
  });

  it("wraps backwards from the first item to the last", () => {
    setup();
    fireEvent.keyDown(combobox(), { key: "ArrowUp" });
    expect(options()[2].getAttribute("aria-selected")).toBe("true");
  });

  it("Home and End jump to the ends", () => {
    setup();
    const input = combobox();
    fireEvent.keyDown(input, { key: "End" });
    expect(options()[2].getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(input, { key: "Home" });
    expect(options()[0].getAttribute("aria-selected")).toBe("true");
  });

  it("Enter selects the highlighted item", () => {
    const { props } = setup();
    fireEvent.keyDown(combobox(), { key: "ArrowDown" });
    fireEvent.keyDown(combobox(), { key: "Enter" });
    expect(props.onSelect).toHaveBeenCalledWith(ITEMS[1]);
  });

  it("Enter on an empty result set does nothing rather than throwing", () => {
    const { props } = setup({ items: [] });
    expect(() => fireEvent.keyDown(combobox(), { key: "Enter" })).not.toThrow();
    expect(props.onSelect).not.toHaveBeenCalled();
  });

  it("clicking an option selects it", () => {
    const { props } = setup();
    fireEvent.click(options()[2]);
    expect(props.onSelect).toHaveBeenCalledWith(ITEMS[2]);
  });

  it("hovering moves the same highlight Enter acts on, so pointer and keyboard agree", () => {
    const { props } = setup();
    fireEvent.mouseMove(options()[2]);
    fireEvent.keyDown(combobox(), { key: "Enter" });
    expect(props.onSelect).toHaveBeenCalledWith(ITEMS[2]);
  });

  // ── Query ──

  it("reports what the user types", () => {
    const { props } = setup();
    fireEvent.input(combobox(), { target: { value: "alp" } });
    expect(props.onQueryChange).toHaveBeenCalledWith("alp");
  });

  it("resets the highlight when the result set changes, so Enter cannot select past the end", () => {
    const { rerender, props } = setup();
    fireEvent.keyDown(combobox(), { key: "End" });
    expect(options()[2].getAttribute("aria-selected")).toBe("true");
    rerender(<CommandPalette {...props} items={[ITEMS[0]]} />);
    expect(options()[0].getAttribute("aria-selected")).toBe("true");
  });

  // ── Presentation ──

  it("shows the empty label instead of a bare box when nothing matches", () => {
    const { getByText } = setup({ items: [], emptyLabel: "Nothing matches that" });
    expect(getByText("Nothing matches that")).toBeTruthy();
  });

  it("renders sublabel and badge only when supplied", () => {
    const { container } = setup();
    expect(container.querySelectorAll(".strand-command-palette__sublabel")).toHaveLength(1);
    expect(container.querySelectorAll(".strand-command-palette__badge")).toHaveLength(1);
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./CommandPalette.fixtures.js";

snapshotFixtures(CommandPalette, fixtures);

snapshotStylesheet(resolve(__dirname, "./CommandPalette.css"));

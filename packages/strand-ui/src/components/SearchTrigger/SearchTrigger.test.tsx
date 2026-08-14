import { fireEvent, render } from "@testing-library/preact";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { SearchTrigger } from "./SearchTrigger.js";

// The GEOMETRY -- that this is pixel-identical to SearchField at rest, and
// that the coarse-pointer floor reaches 44px -- belongs to the layout tier in
// real Chromium. jsdom neither lays out nor resolves media queries.
//
// What this file pins is the SEMANTIC contract, which is the entire reason
// this is a separate primitive rather than a variant of SearchField. Every
// assertion below fails if someone "simplifies" it back into an input.

describe("SearchTrigger", () => {
  it("is a button, never an input", () => {
    // WCAG 3.2.1 (On Focus): a control that changes context when focused is a
    // failure. An input that opens an overlay on focus does exactly that, and
    // a keyboard user tabbing through the header would be thrown into it.
    const { container } = render(<SearchTrigger />);
    const el = container.querySelector(".strand-search-trigger");
    expect(el?.tagName).toBe("BUTTON");
    expect(el?.getAttribute("type")).toBe("button");
    expect(container.querySelector("input")).toBeNull();
  });

  it("announces that it opens something rather than that it accepts text", () => {
    const { container } = render(<SearchTrigger />);
    expect(
      container.querySelector(".strand-search-trigger")?.getAttribute("aria-haspopup"),
    ).toBe("dialog");
  });

  it("does not claim the search landmark role", () => {
    // role="search" around a text input promises assistive technology that
    // typing works here. Wiring that to "your keystrokes go to an overlay"
    // makes the promise false at the AT layer, which is worse than a plainly
    // labelled button. The landmark belongs to whatever the overlay renders.
    const { container } = render(<SearchTrigger />);
    expect(container.querySelector('[role="search"]')).toBeNull();
  });

  // WCAG 2.5.3 Label in Name: a speech-input user says what they can see. If
  // the accessible name were "Search" while the visible text read "Search
  // events", saying the visible words would not activate the control.
  it("uses its visible text as its accessible name, with no aria-label override", () => {
    const { container } = render(<SearchTrigger label="Search events" />);
    const el = container.querySelector(".strand-search-trigger");
    expect(el?.textContent).toContain("Search events");
    expect(el?.hasAttribute("aria-label")).toBe(false);
  });

  it("shares the field's box so the two controls cannot drift apart", () => {
    const { container } = render(<SearchTrigger />);
    const el = container.querySelector(".strand-search-trigger");
    expect(el?.classList.contains("strand-search-field")).toBe(true);
  });

  it("defaults to the fixed-width presentation", () => {
    const { container } = render(<SearchTrigger />);
    expect(
      container.querySelector(".strand-search-trigger")?.classList.contains(
        "strand-search-field--full",
      ),
    ).toBe(false);
  });

  it("spans its container when asked", () => {
    const { container } = render(<SearchTrigger variant="full" />);
    expect(
      container.querySelector(".strand-search-trigger")?.classList.contains(
        "strand-search-field--full",
      ),
    ).toBe(true);
  });

  it("reports the overlay's state when the consumer drives it", () => {
    const { container } = render(<SearchTrigger expanded controls="palette" />);
    const el = container.querySelector(".strand-search-trigger");
    expect(el?.getAttribute("aria-expanded")).toBe("true");
    expect(el?.getAttribute("aria-controls")).toBe("palette");
  });

  it("omits aria-expanded entirely when no overlay state is supplied", () => {
    // A trigger with no overlay mounted must not assert collapsed, which
    // would announce a widget state that does not exist.
    const { container } = render(<SearchTrigger />);
    expect(
      container.querySelector(".strand-search-trigger")?.hasAttribute("aria-expanded"),
    ).toBe(false);
  });

  it("activates on click", () => {
    const onClick = vi.fn();
    const { container } = render(<SearchTrigger onClick={onClick} />);
    fireEvent.click(container.querySelector(".strand-search-trigger") as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("hides its icon from the accessibility tree", () => {
    const { container } = render(<SearchTrigger />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("focusable")).toBe("false");
  });

  it("carries a consumer's class without dropping its own", () => {
    const { container } = render(<SearchTrigger className="strand-hide-below-md" />);
    const el = container.querySelector(".strand-search-trigger");
    expect(el?.classList.contains("strand-hide-below-md")).toBe(true);
    expect(el?.classList.contains("strand-search-field")).toBe(true);
  });

  // ── The icon presentation ──
  //
  // Its geometry (44px square, centred glyph) is a layout-tier claim and lives
  // in scripts/layout-check.mjs, per the note at the top of this file. What is
  // assertable here is the part that is an ACCESSIBILITY contract rather than a
  // visual one, and it is the part most likely to be "simplified" away.

  it("takes the icon presentation without becoming a different control", () => {
    // The whole reason this is a variant rather than a Button: an icon-only
    // Button is not a SearchTrigger, so it drops the popup semantics and the
    // shared field identity. Both must survive the variant.
    const { container } = render(<SearchTrigger variant="icon" />);
    const el = container.querySelector(".strand-search-trigger");
    expect(el?.classList.contains("strand-search-trigger--icon")).toBe(true);
    expect(el?.classList.contains("strand-search-field")).toBe(true);
    expect(el?.getAttribute("aria-haspopup")).toBe("dialog");
    expect(el?.tagName).toBe("BUTTON");
  });

  it("keeps its accessible name when the label is visually hidden", () => {
    // THE DEFECT THIS PINS: `display: none` on the label would take the
    // control's accessible name with it and leave a button that announces
    // nothing. The label is clipped instead, so it stays in the accessibility
    // tree and a speech-input user can still say what the field would have
    // read. WCAG 2.5.3, Label in Name.
    const { container } = render(<SearchTrigger variant="icon" label="Search events" />);
    const el = container.querySelector(".strand-search-trigger");
    expect(el?.textContent).toContain("Search events");
    expect(el?.hasAttribute("aria-label")).toBe(false);
    expect(container.querySelector(".strand-search-trigger__label")).not.toBeNull();
  });

  it("clips the icon variant's label rather than removing it from the tree", () => {
    // The assertion above proves the label is PRESENT. This one proves the
    // stylesheet hides it by a technique that keeps it announced: any rule
    // reaching for `display: none` here re-opens the same defect while leaving
    // every markup assertion above green.
    const css = readFileSync(resolve(__dirname, "SearchTrigger.css"), "utf8");
    const rule = css.slice(css.indexOf(".strand-search-trigger--icon .strand-search-trigger__label"));
    const body = rule.slice(rule.indexOf("{"), rule.indexOf("}"));
    expect(body).toMatch(/clip-path:\s*inset\(50%\)/);
    expect(body).not.toMatch(/display:\s*none/);
  });

  it("is not full-width, which would defeat a square icon", () => {
    const { container } = render(<SearchTrigger variant="icon" />);
    expect(
      container.querySelector(".strand-search-trigger")?.classList.contains(
        "strand-search-field--full",
      ),
    ).toBe(false);
  });

  it("emits no icon modifier for the other two presentations", () => {
    for (const variant of ["field", "full"] as const) {
      const { container } = render(<SearchTrigger variant={variant} />);
      expect(
        container.querySelector(".strand-search-trigger")?.classList.contains(
          "strand-search-trigger--icon",
        ),
      ).toBe(false);
    }
  });
});

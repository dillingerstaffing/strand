import { fireEvent, render } from "@testing-library/preact";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { SearchField } from "./SearchField.js";

// These assert MARKUP and BEHAVIOUR. The primitive's geometric claims -- that
// the box occupies its final size in the first frame, that the coarse-pointer
// floor reaches 44px -- are not evaluable here, because jsdom does not lay out
// and does not resolve media queries. Those live in scripts/layout-check.mjs in
// real Chromium. See docs/testing-tiers.md: an assertion placed in a tier that
// cannot evaluate it does not fail, it passes.

describe("SearchField", () => {
  it("is a search landmark carrying a search input", () => {
    // Both halves matter and they are different things. The landmark is how a
    // screen reader user jumps to search; the input type is what gives the
    // control its search semantics and its keyboard behaviour.
    const { container } = render(<SearchField />);
    const field = container.querySelector(".strand-search-field");
    expect(field?.getAttribute("role")).toBe("search");
    expect(
      container.querySelector(".strand-search-field__input")?.getAttribute("type"),
    ).toBe("search");
  });

  it("names the input even when the only visible affordance is a placeholder", () => {
    // The defect this prevents: a placeholder is a hint, it vanishes on the
    // first keystroke, and it is not an accessible name. A field labelled only
    // by placeholder is announced as an unlabelled edit box.
    const { container } = render(<SearchField placeholder="Search events" />);
    const input = container.querySelector(".strand-search-field__input");
    expect(input?.getAttribute("aria-label")).toBe("Search");
    expect(input?.getAttribute("placeholder")).toBe("Search events");
  });

  it("takes an explicit label when the default is not specific enough", () => {
    const { container } = render(<SearchField label="Search events" />);
    expect(
      container.querySelector(".strand-search-field__input")?.getAttribute("aria-label"),
    ).toBe("Search events");
  });

  it("spans its container when asked", () => {
    const { container } = render(<SearchField variant="full" />);
    expect(
      container.querySelector(".strand-search-field")?.classList.contains(
        "strand-search-field--full",
      ),
    ).toBe(true);
  });

  it("reports every keystroke", () => {
    const onValueChange = vi.fn();
    const { container } = render(<SearchField onValueChange={onValueChange} />);
    const input = container.querySelector(
      ".strand-search-field__input",
    ) as HTMLInputElement;
    fireEvent.input(input, { target: { value: "pottery" } });
    expect(onValueChange).toHaveBeenCalledWith("pottery");
  });

  it("passes arbitrary attributes through to the input, not the wrapper", () => {
    // The consumer's handle needs to be on the control they will read a value
    // from and focus, so an id landing on the wrapper would make every
    // `document.getElementById(...).focus()` a silent no-op.
    const { container } = render(<SearchField id="q" name="query" />);
    const input = container.querySelector(".strand-search-field__input");
    expect(input?.getAttribute("id")).toBe("q");
    expect(input?.getAttribute("name")).toBe("query");
    expect(container.querySelector(".strand-search-field")?.hasAttribute("id")).toBe(
      false,
    );
  });

  it("withholds the clear control when there is no value to read", () => {
    // Uncontrolled: the component cannot know whether the field is empty, so a
    // clear button would be a control that lies about having something to do.
    const { container } = render(<SearchField onClear={() => {}} />);
    expect(container.querySelector(".strand-search-field__clear")).toBeNull();
  });

  it("hides the clear control while the field is empty", () => {
    const { container } = render(<SearchField value="" onClear={() => {}} />);
    const clear = container.querySelector(".strand-search-field__clear");
    // Present but hidden, so showing it on the first keystroke costs no mount.
    expect(clear).not.toBeNull();
    expect(clear?.hasAttribute("hidden")).toBe(true);
  });

  it("shows and fires the clear control once there is a value", () => {
    const onClear = vi.fn();
    const { container } = render(<SearchField value="chess" onClear={onClear} />);
    const clear = container.querySelector(
      ".strand-search-field__clear",
    ) as HTMLButtonElement;
    expect(clear.hasAttribute("hidden")).toBe(false);
    expect(clear.getAttribute("aria-label")).toBe("Clear search");
    fireEvent.click(clear);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("hides its icons from the accessibility tree", () => {
    // Decorative: the landmark and the label already say what this is, so an
    // exposed magnifier is one more thing announced and nothing more learned.
    const { container } = render(<SearchField value="x" onClear={() => {}} />);
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
      expect(svg.getAttribute("focusable")).toBe("false");
    }
  });

  it("renders no structural wrapper a vanilla-HTML consumer could not reproduce", () => {
    // The class layer is the primitive; the component is a wrapper over exactly
    // those classes. An extra element here would break that parity silently.
    const { container } = render(<SearchField value="" onClear={() => {}} />);
    const field = container.querySelector(".strand-search-field");
    expect(field?.parentElement).toBe(container);
    expect([...(field?.children ?? [])].map((el) => el.tagName)).toEqual([
      "svg",
      "INPUT",
      "BUTTON",
    ]);
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./SearchField.fixtures.js";

snapshotFixtures(SearchField, fixtures);

snapshotStylesheet(resolve(__dirname, "./SearchField.css"));

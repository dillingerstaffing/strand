import { fireEvent, render } from "@testing-library/preact";
import { readFileSync } from "node:fs";
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

  it("defaults to the fixed-width presentation", () => {
    const { container } = render(<SearchField />);
    const field = container.querySelector(".strand-search-field");
    expect(field?.classList.contains("strand-search-field--full")).toBe(false);
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

  it("carries a consumer's class on the wrapper without dropping its own", () => {
    // The wrapper is what a breakpoint utility must land on, because hiding the
    // input alone would leave the field's border and background drawn.
    const { container } = render(<SearchField className="strand-hide-below-md" />);
    const field = container.querySelector(".strand-search-field");
    expect(field?.classList.contains("strand-hide-below-md")).toBe(true);
    expect(field?.classList.contains("strand-search-field")).toBe(true);
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

  // ── Gap #105: the field could not be asked for a width ──

  it("takes its width from a token, defaulting to the reserved box", () => {
    // Two consumers on one product both had to override this declaration to
    // place the same primitive: a header field wanting a flat 300 (a
    // percentage is invisible to an intrinsically sized parent, #95) and a
    // phone header wanting the full row. A primitive that must be overridden
    // to be positioned is missing an input.
    const sf = readFileSync(resolve(__dirname, "SearchField.css"), "utf8");
    expect(sf).toMatch(
      /inline-size:\s*var\(--strand-search-field-inline-size,\s*min\(300px,\s*100%\)\)/,
    );
  });

  it("rings a focused field strongly enough to be a focus indicator", () => {
    // SC 1.4.11 wants 3:1 for a focus indicator, and 12.3 / 14.3 both specify
    // 2px of --strand-blue-primary, which is 3.29:1 on white (14.2b's fill
    // tier). This shipped as `0 0 0 3px rgb(59 142 246 / 10%)`, which blends
    // to about #ebf1ff over white: roughly 1.1:1, and not an indicator.
    //
    // NO AXE RULE COVERS THIS. Focus appearance is not automatable that way,
    // which is how the weak ring survived eight consumer suites and why the
    // guard is a stylesheet assertion rather than a browser one. Gap #60
    // recorded the same blind spot.
    //
    // Asserted as "solid", not as an exact string: the failure being prevented
    // is a return to a transparent ring, and pinning the literal would fail on
    // a harmless reformat while a re-alpha'd colour slipped through.
    const sf = readFileSync(resolve(__dirname, "SearchField.css"), "utf8");
    const rule = sf.slice(sf.indexOf(".strand-search-field:focus-within"));
    const body = rule.slice(rule.indexOf("{"), rule.indexOf("}"));
    expect(body).toMatch(/box-shadow:\s*0 0 0 2px var\(--strand-blue-primary\)/);
    expect(body).not.toMatch(/rgba?\([^)]*[/,]\s*(0?\.\d+|\d+%)\s*\)/);
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./SearchField.fixtures.js";

snapshotFixtures(SearchField, fixtures);

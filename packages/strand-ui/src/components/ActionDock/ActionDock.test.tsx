import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { ActionDock } from "./ActionDock.js";

// These assert MARKUP. The primitive's real contract is geometry -- that the
// control lands in the bottom third of the viewport and stays there while the
// document scrolls -- and jsdom cannot lay out, so it cannot evaluate any of
// that. Those claims live in scripts/layout-check.mjs, in real Chromium, and
// this file deliberately does not restate them as proxies. See
// docs/testing-tiers.md: an assertion placed in a tier that cannot evaluate it
// does not fail, it passes.

describe("ActionDock", () => {
  it("hides by default, so a dock nobody drives occludes nothing", () => {
    // The failure mode this prevents is a server-rendered page that never
    // flips the attribute ending up with a bar welded across its content.
    const { container } = render(
      <ActionDock>
        <button type="button">RSVP</button>
      </ActionDock>,
    );
    const dock = container.querySelector(".strand-actiondock");
    expect(dock?.getAttribute("data-strand-actiondock")).toBe("hidden");
  });

  it("shows when told to", () => {
    const { container } = render(
      <ActionDock visible>
        <button type="button">RSVP</button>
      </ActionDock>,
    );
    expect(
      container.querySelector(".strand-actiondock")?.getAttribute("data-strand-actiondock"),
    ).toBe("visible");
  });

  it("keeps the control mounted while hidden, so showing it costs no render", () => {
    const { container } = render(
      <ActionDock visible={false}>
        <button type="button">RSVP</button>
      </ActionDock>,
    );
    expect(container.textContent).toContain("RSVP");
  });

  it("carries a consumer's class without dropping its own", () => {
    const { container } = render(<ActionDock className="custom" />);
    const dock = container.querySelector(".strand-actiondock");
    expect(dock?.classList.contains("custom")).toBe(true);
  });

  // The wrapper must stay a thin pass-through: the accessibility guidance
  // tells consumers to set aria-hidden on the dock, and that only works if
  // arbitrary attributes reach the element.
  it("passes arbitrary attributes through to the element", () => {
    const { container } = render(<ActionDock aria-hidden="true" data-testid="dock" />);
    const dock = container.querySelector(".strand-actiondock");
    expect(dock?.getAttribute("aria-hidden")).toBe("true");
    expect(dock?.getAttribute("data-testid")).toBe("dock");
  });

  // The class layer is the primitive and the component is a wrapper over
  // exactly those classes, so the rendered markup must be reproducible by a
  // vanilla-HTML consumer copying it. Any extra structural element here would
  // break that parity silently.
  it("renders one element and no structural wrapper of its own", () => {
    const { container } = render(
      <ActionDock visible>
        <button type="button">RSVP</button>
      </ActionDock>,
    );
    const dock = container.querySelector(".strand-actiondock");
    expect(dock?.children.length).toBe(1);
    expect(dock?.firstElementChild?.tagName).toBe("BUTTON");
  });
});

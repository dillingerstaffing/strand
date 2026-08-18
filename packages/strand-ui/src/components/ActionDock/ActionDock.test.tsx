import { render } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
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

  // ── The dock driving itself (gap #122) ─────────────────────────────
  //
  // jsdom has no IntersectionObserver and no layout, so these assert the WIRING
  // and the RULE: which element is observed, with what margin, and that the
  // watched path ignores `visible`. The geometry (does the dock actually leave
  // exactly as the control arrives) is a browser question and lives in the
  // consumer's scroll sweep, which walks every position rather than sampling.

  it("observes the element it is given, not its container", () => {
    // The whole point of gap #122: watching the CARD hides the dock while the
    // button inside it is still below the fold, leaving a band of scroll where
    // neither can be pressed.
    const observed: Element[] = [];
    const spy = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(_cb: unknown, opts: { rootMargin: string }) {
          spy(opts.rootMargin);
        }
        observe(el: Element) {
          observed.push(el);
        }
        disconnect() {}
      },
    );
    const button = document.createElement("button");
    document.body.appendChild(button);
    render(<ActionDock watch={{ current: button }} />);
    expect(observed).toEqual([button]);
    vi.unstubAllGlobals();
  });

  it("trims the viewport by its own height, so it never overlaps the control", () => {
    const margins: string[] = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(_cb: unknown, opts: { rootMargin: string }) {
          margins.push(opts.rootMargin);
        }
        observe() {}
        disconnect() {}
      },
    );
    const button = document.createElement("button");
    document.body.appendChild(button);
    render(<ActionDock watch={{ current: button }} />);
    // jsdom reports 0 height, so the margin is 0 here; the shape is what is
    // asserted. A regression that dropped the inset entirely would still emit
    // this string, which is why the consumer's browser sweep is the other half.
    expect(margins[0]).toMatch(/^0px 0px -\d+px 0px$/);
    vi.unstubAllGlobals();
  });

  it("starts HIDDEN when watching, whatever `visible` says", () => {
    // `visible` is the consumer-driven path. Letting it leak into the watched
    // path would flash a dock on first paint before the observer reports.
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    const button = document.createElement("button");
    document.body.appendChild(button);
    const { container } = render(<ActionDock watch={{ current: button }} visible />);
    expect(container.querySelector(".strand-actiondock")?.getAttribute("data-strand-actiondock")).toBe(
      "hidden",
    );
    vi.unstubAllGlobals();
  });

  it("stays hidden when the watched target does not exist", () => {
    // A dock that shows because it could not find what it stands in for is a
    // second live control with nothing to reconcile against.
    const { container } = render(<ActionDock watch="#nothing-here" />);
    expect(container.querySelector(".strand-actiondock")?.getAttribute("data-strand-actiondock")).toBe(
      "hidden",
    );
  });

  it("leaves `visible` in charge when no target is being watched", () => {
    const { container } = render(<ActionDock visible />);
    expect(container.querySelector(".strand-actiondock")?.getAttribute("data-strand-actiondock")).toBe(
      "visible",
    );
  });

  it("treats a PARTIALLY visible control as not reachable", () => {
    // threshold 1, not 0. At 0 a single intersecting pixel counts as on
    // screen, so a control scrolled half off the top kept the dock hidden
    // while only a sliver of the real button remained: measured in a consumer
    // at 22px of a 44px target, under SC 2.5.8's floor, with no dock to fall
    // back on.
    const thresholds: unknown[] = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(_cb: unknown, opts: { threshold: number[] }) {
          thresholds.push(opts.threshold);
        }
        observe() {}
        disconnect() {}
      },
    );
    const button = document.createElement("button");
    document.body.appendChild(button);
    render(<ActionDock watch={{ current: button }} />);
    // Both boundaries, so the callback fires entering AND fully-entering.
    expect(thresholds[0]).toEqual([0, 1]);
    vi.unstubAllGlobals();
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./ActionDock.fixtures.js";

snapshotFixtures(ActionDock, fixtures);

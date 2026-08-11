import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { Settle } from "./Settle.js";

// What this tier CAN and CANNOT answer, stated because getting it wrong is the
// documented way a primitive ships broken here (docs/testing-tiers.md).
//
// jsdom runs no animations at all, so nothing below asserts that anything
// faded. A Settle whose CSS animated nothing would pass every test in this
// file. That claim belongs to `pnpm test:motion`, which probes
// document.getAnimations() in real Chromium.
//
// What jsdom CAN answer is the contract the animation rests on, and it is the
// half consumers actually get wrong: design-language 6.9.1 says the fade fires
// because the framework REPLACES the element, so the invariant worth pinning
// here is that a changed `on` produces a new DOM node and an unchanged `on`
// does not. If that breaks, the animation never fires no matter how correct
// the stylesheet is.

describe("Settle", () => {
  it("carries the primitive class, so the CSS layer is what does the work", () => {
    const { container } = render(<Settle>7 people</Settle>);
    expect(container.firstElementChild?.className).toContain("strand-settle");
  });

  it("keeps the consumer's own classes alongside it", () => {
    const { container } = render(<Settle className="strand-kv__value">7</Settle>);
    const cls = container.firstElementChild?.className ?? "";
    expect(cls).toContain("strand-settle");
    expect(cls).toContain("strand-kv__value");
  });

  it("renders as the element the caller asked for, so it can be used inline", () => {
    const { container } = render(<Settle as="span">7</Settle>);
    expect(container.firstElementChild?.tagName).toBe("SPAN");
  });

  // ── Identity is what triggers it (6.9.1) ──

  it("replaces the node when the value changes, which is what makes the fade fire", () => {
    // THE test. A count going 6 to 7 patches a text node and inserts nothing,
    // so a consumer who adds the class but not the identity gets a primitive
    // that looks installed and animates nothing. `on` exists to close that.
    const { container, rerender } = render(
      <Settle as="span" on={6}>
        6 people
      </Settle>,
    );
    const before = container.firstElementChild;

    rerender(
      <Settle as="span" on={7}>
        7 people
      </Settle>,
    );
    const after = container.firstElementChild;

    expect(after).not.toBe(before);
    expect(container.textContent).toContain("7 people");
  });

  it("reuses the node when the value did not change, so nothing re-announces itself", () => {
    // The other half, and it is not symmetric politeness: without it every
    // unrelated re-render would replay the fade, which is 6.8's re-animation
    // anti-pattern reached by accident.
    const { container, rerender } = render(
      <Settle as="span" on={6}>
        6 people
      </Settle>,
    );
    const before = container.firstElementChild;

    rerender(
      <Settle as="span" on={6}>
        6 people
      </Settle>,
    );

    expect(container.firstElementChild).toBe(before);
  });

  it("treats a changed branch name as a changed value, for a control swapped by its confirmation", () => {
    const { container, rerender } = render(<Settle on="join">Join</Settle>);
    const before = container.firstElementChild;
    rerender(<Settle on="joined">Joined</Settle>);
    expect(container.firstElementChild).not.toBe(before);
  });

  it("does not force an identity when none is given, since an inserted element is new anyway", () => {
    // The list-item case: a comment arriving did not exist a moment ago, so
    // insertion alone fires the fade and `on` would be noise.
    const { container } = render(<Settle>arrived</Settle>);
    expect(container.firstElementChild?.getAttribute("key")).toBeNull();
    expect(container.textContent).toContain("arrived");
  });

  it("distinguishes 0 from absent, so a count falling to zero still announces", () => {
    // `on={0}` is falsy. A truthiness check here would silently drop the
    // identity for exactly the value a consumer most wants to announce.
    const { container, rerender } = render(<Settle on={1}>1</Settle>);
    const before = container.firstElementChild;
    rerender(<Settle on={0}>0</Settle>);
    expect(container.firstElementChild).not.toBe(before);
  });

  it("forwards arbitrary attributes, so it can carry test hooks and ARIA", () => {
    const { container } = render(
      <Settle as="span" data-testid="event-rsvp-count" aria-live="polite">
        7
      </Settle>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute("data-testid")).toBe("event-rsvp-count");
    expect(el.getAttribute("aria-live")).toBe("polite");
  });

  // ── The Reserve boundary (6.9) ──

  it("emits no sizing of any kind, because Settle owns the moment and Reserve owns the box", () => {
    // Structural, not stylistic. If a future edit "fixes" a jumpy consumer by
    // adding a height here, two primitives end up owning one invariant and
    // consumers guess which. The geometric half of this claim is asserted as a
    // number by pnpm test:layout; this is the cheap guard that the component
    // never grows a sizing prop.
    const { container } = render(<Settle on={7}>7</Settle>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute("style")).toBeNull();
  });
});

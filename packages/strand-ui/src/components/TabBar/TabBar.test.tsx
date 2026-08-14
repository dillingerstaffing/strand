import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { TabBar } from "./TabBar.js";

// The stylesheet is the primitive; the wrapper is a thin component over it, so
// the declarations below are read from the source rather than from a rendered
// node. jsdom applies no author stylesheet, so asserting a computed style here
// would assert nothing (docs/testing-tiers.md).
const css = readFileSync(resolve(__dirname, "TabBar.css"), "utf8");
const ruleFor = (sel: string) =>
  css.match(new RegExp(`${sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[1];

// The POSITIONING is this primitive's real contract -- fixed to the viewport,
// in 14.8's easy band, clearing the safe-area inset -- and jsdom cannot lay
// out, so none of it is evaluable here. Those claims live in
// scripts/layout-check.mjs in real Chromium. See docs/testing-tiers.md: an
// assertion placed in a tier that cannot evaluate it does not fail, it passes.
//
// What this file covers is the contract a consumer programs against, and one
// claim that matters more than the rest: the current destination's VISUAL
// state and its ANNOUNCED state are the same attribute, so they cannot drift.

const ITEMS = [
  { id: "discover", label: "Discover", href: "/discover" },
  { id: "calendar", label: "Calendar", href: "/calendar" },
  { id: "people", label: "People", href: "/people" },
];

describe("TabBar", () => {
  it("is a navigation landmark with an accessible name", () => {
    // Unnamed, it is one of several nav landmarks a screen reader user has to
    // tell apart by guessing.
    const { container } = render(<TabBar items={ITEMS} />);
    const nav = container.querySelector("nav");
    expect(nav?.classList.contains("strand-tabbar")).toBe(true);
    expect(nav?.getAttribute("aria-label")).toBe("Primary");
  });

  it("takes a specific landmark name when a page has more than one nav", () => {
    const { container } = render(<TabBar items={ITEMS} label="Sections" />);
    expect(container.querySelector("nav")?.getAttribute("aria-label")).toBe("Sections");
  });

  it("renders one item per destination", () => {
    const { container } = render(<TabBar items={ITEMS} />);
    expect(container.querySelectorAll(".strand-tabbar__item")).toHaveLength(3);
    expect(container.textContent).toContain("Discover");
    expect(container.textContent).toContain("People");
  });

  // The load-bearing one. aria-current is the styling hook AND the announced
  // state, so there is no way to paint the current item without also telling
  // a screen reader which it is.
  it("marks the current destination with aria-current, which is also what styles it", () => {
    const { container } = render(<TabBar items={ITEMS} current="calendar" />);
    const marked = container.querySelectorAll('[aria-current="page"]');
    expect(marked).toHaveLength(1);
    expect(marked[0].textContent).toContain("Calendar");
  });

  it("marks nothing when the current id matches no destination", () => {
    // A stale route must leave the bar unmarked rather than guessing, because
    // a wrong "you are here" is worse than none.
    const { container } = render(<TabBar items={ITEMS} current="nowhere" />);
    expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(0);
  });

  // A destination with a URL stays a link so middle-click, open-in-new-tab and
  // the browser's status preview all keep working. Rendering every item as a
  // button would silently take those away.
  it("renders a destination with a href as a link", () => {
    const { container } = render(<TabBar items={ITEMS} />);
    const items = container.querySelectorAll(".strand-tabbar__item");
    expect([...items].every((el) => el.tagName === "A")).toBe(true);
    expect(items[0].getAttribute("href")).toBe("/discover");
  });

  it("falls back to a button only for a destination with no href", () => {
    const { container } = render(
      <TabBar items={[{ id: "a", label: "A" }, ...ITEMS]} />,
    );
    const items = container.querySelectorAll(".strand-tabbar__item");
    expect(items[0].tagName).toBe("BUTTON");
    expect(items[0].getAttribute("type")).toBe("button");
    expect(items[1].tagName).toBe("A");
  });

  it("reports the destination that was activated", () => {
    const onNavigate = vi.fn();
    const { container } = render(<TabBar items={ITEMS} onNavigate={onNavigate} />);
    fireEvent.click(container.querySelectorAll(".strand-tabbar__item")[2]);
    expect(onNavigate).toHaveBeenCalledWith("people");
  });

  // Found by reading past a green summary: jsdom logged "Not implemented:
  // navigation" on every click test. That noise was a real defect. Without
  // preventDefault a consumer wiring onNavigate to a router gets BOTH the
  // route change and a full page load on top of it, discarding the app.
  it("does not let a plain click also hard-navigate when a handler owns it", () => {
    const onNavigate = vi.fn();
    const { container } = render(<TabBar items={ITEMS} onNavigate={onNavigate} />);
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    container.querySelectorAll(".strand-tabbar__item")[0].dispatchEvent(event);
    expect(onNavigate).toHaveBeenCalledWith("discover");
    expect(event.defaultPrevented).toBe(true);
  });

  // The other half, and the reason these are links at all. Swallowing a
  // modified click would remove open-in-new-tab with no way to get it back.
  it("leaves a modified click to the browser and does not change the current view", () => {
    const onNavigate = vi.fn();
    const { container } = render(<TabBar items={ITEMS} onNavigate={onNavigate} />);
    for (const mod of ["metaKey", "ctrlKey", "shiftKey", "altKey"]) {
      const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        [mod]: true,
      });
      container.querySelectorAll(".strand-tabbar__item")[0].dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    }
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it("still reports a button-style destination, which has nothing to prevent", () => {
    const onNavigate = vi.fn();
    const { container } = render(
      <TabBar items={[{ id: "solo", label: "Solo" }]} onNavigate={onNavigate} />,
    );
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    container.querySelector(".strand-tabbar__item")?.dispatchEvent(event);
    expect(onNavigate).toHaveBeenCalledWith("solo");
    expect(event.defaultPrevented).toBe(false);
  });

  it("hides a decorative icon from the accessibility tree", () => {
    // The label already names the destination; an exposed glyph is a second
    // announcement of the same thing.
    const { container } = render(
      <TabBar items={[{ ...ITEMS[0], icon: <svg data-testid="g" /> }]} />,
    );
    expect(
      container.querySelector(".strand-tabbar__icon")?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("renders without an icon at all", () => {
    // Icons are optional, and a missing one must not leave an empty styled box
    // taking up the row.
    const { container } = render(<TabBar items={ITEMS} />);
    expect(container.querySelector(".strand-tabbar__icon")).toBeNull();
  });

  it("carries a consumer's class without dropping its own", () => {
    const { container } = render(
      <TabBar items={ITEMS} className="strand-hide-from-md" />,
    );
    const nav = container.querySelector("nav");
    expect(nav?.classList.contains("strand-hide-from-md")).toBe(true);
    expect(nav?.classList.contains("strand-tabbar")).toBe(true);
  });

  it("renders nothing but the landmark when there are no destinations", () => {
    // Guards against a crash on an empty array during a routing transition.
    const { container } = render(<TabBar items={[]} />);
    expect(container.querySelector("nav")).not.toBeNull();
    expect(container.querySelectorAll(".strand-tabbar__item")).toHaveLength(0);
  });

  it("passes arbitrary attributes through to the landmark", () => {
    const { container } = render(<TabBar items={ITEMS} data-testid="shell-nav" />);
    expect(container.querySelector("nav")?.getAttribute("data-testid")).toBe(
      "shell-nav",
    );
  });

  // ── Gap #104: the labels had no contrast ratio ──

  it("paints an opaque ground rather than glass", () => {
    // Small text owes 4.5:1, and behind a translucent bar the effective
    // background is whatever is scrolled underneath, so the ratio moves with
    // the reader. Measured on a consumer: 3.92:1 with content behind, passing
    // over an empty page. A ratio that depends on scroll position is not one.
    const bar = ruleFor(".strand-tabbar") || "";
    expect(bar).toMatch(/background:\s*var\(--strand-tabbar-bg,\s*var\(--strand-surface-raised\)\)/);
    expect(bar, "glass is what made the ratio undefined").not.toMatch(/backdrop-filter/);
    expect(bar, "glass is what made the ratio undefined").not.toMatch(/--strand-glass-bg/);
  });

  it("never lets a label wrap, because the bar's height is a reserved token", () => {
    expect(ruleFor(".strand-tabbar__label")).toMatch(/white-space:\s*nowrap/);
  });

  it("lets a consumer set its geometry without overriding the class", () => {
    const bar = ruleFor(".strand-tabbar") || "";
    expect(bar).toMatch(/justify-content:\s*var\(--strand-tabbar-justify/);
    expect(bar).toMatch(/padding-block-start:\s*var\(--strand-tabbar-pad-block-start/);
    expect(bar).toMatch(/padding-inline:\s*var\(--strand-tabbar-pad-inline/);
    expect(ruleFor(".strand-tabbar__item")).toMatch(/min-inline-size:\s*var\(--strand-tabbar-item-size/);
    expect(ruleFor(".strand-tabbar__item")).toMatch(/gap:\s*var\(--strand-tabbar-item-gap/);
  });

  it("keeps text-xs as the label default, so the type scale is unchanged", () => {
    // The token lets one consumer size one bar. It does not add a rung: every
    // consumer that sets nothing still gets the smallest step in the scale.
    expect(ruleFor(".strand-tabbar__label")).toMatch(
      /font-size:\s*var\(--strand-tabbar-label-size,\s*var\(--strand-text-xs\)\)/,
    );
  });
});

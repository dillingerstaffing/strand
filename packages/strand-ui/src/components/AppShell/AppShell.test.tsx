import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell.js";

// The frame's WIDTH and its CLIPPING are geometry, asserted in the layout
// tier in real Chromium. jsdom neither lays out nor resolves media queries,
// so nothing here restates them as proxies.

describe("AppShell", () => {
  it("renders the frame", () => {
    const { container } = render(<AppShell />);
    expect(container.querySelector(".strand-app-shell")).not.toBeNull();
  });

  it("renders its children", () => {
    const { container } = render(
      <AppShell>
        <nav data-testid="nav">nav</nav>
      </AppShell>,
    );
    expect(container.querySelector('[data-testid="nav"]')).not.toBeNull();
  });

  // The naming risk stated in the CSS: a consumer must not reach for this
  // when they want a reading measure, and must not get 1024 when they want
  // a frame. The two carry different classes and neither implies the other.
  it("is not a content container", () => {
    const { container } = render(<AppShell />);
    const el = container.querySelector(".strand-app-shell");
    expect(el?.className).not.toContain("strand-container");
  });

  it("renders one element with no structural wrapper of its own", () => {
    // The class layer is the primitive, so a vanilla-HTML consumer copying
    // the markup gets identical behaviour.
    const { container } = render(
      <AppShell>
        <div>only child</div>
      </AppShell>,
    );
    const el = container.querySelector(".strand-app-shell");
    expect(el?.parentElement).toBe(container);
    expect(el?.children.length).toBe(1);
  });

  it("carries a consumer's class without dropping its own", () => {
    const { container } = render(<AppShell className="x" />);
    const el = container.querySelector(".strand-app-shell");
    expect(el?.classList.contains("x")).toBe(true);
    expect(el?.classList.contains("strand-app-shell")).toBe(true);
  });

  it("passes arbitrary attributes through", () => {
    const { container } = render(<AppShell data-testid="shell" id="app" />);
    const el = container.querySelector(".strand-app-shell");
    expect(el?.getAttribute("data-testid")).toBe("shell");
    expect(el?.getAttribute("id")).toBe("app");
  });
});

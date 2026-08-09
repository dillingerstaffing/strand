import { describe, expect, it, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/preact";
import { Nav } from "./Nav.js";

const sampleItems = [
  { label: "Home", href: "/", active: true },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

describe("Nav", () => {
  afterEach(() => {
    document.body.classList.remove("strand-glass-nav-active");
    cleanup();
  });

  // ── Glass nav body class management ──

  it("adds strand-glass-nav-active to body when glass is true", () => {
    render(<Nav glass />);
    expect(document.body.classList.contains("strand-glass-nav-active")).toBe(true);
  });

  it("does not add strand-glass-nav-active when glass is false", () => {
    render(<Nav />);
    expect(document.body.classList.contains("strand-glass-nav-active")).toBe(false);
  });

  it("removes strand-glass-nav-active from body on unmount", () => {
    const { unmount } = render(<Nav glass />);
    expect(document.body.classList.contains("strand-glass-nav-active")).toBe(true);
    unmount();
    expect(document.body.classList.contains("strand-glass-nav-active")).toBe(false);
  });

  // ── Rendering ──

  it("renders a nav element", () => {
    const { container } = render(<Nav items={sampleItems} />);
    expect(container.querySelector("nav")).toBeTruthy();
  });

  it("has aria-label Main navigation", () => {
    const { getByRole } = render(<Nav items={sampleItems} />);
    expect(getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "Main navigation",
    );
  });

  it("renders logo content", () => {
    const { getByText } = render(
      <Nav logo={<span>MyLogo</span>} items={sampleItems} />,
    );
    expect(getByText("MyLogo")).toBeTruthy();
  });

  it("renders navigation items", () => {
    const { getByText } = render(<Nav items={sampleItems} />);
    expect(getByText("Home")).toBeTruthy();
    expect(getByText("About")).toBeTruthy();
    expect(getByText("Contact")).toBeTruthy();
  });

  it("renders item hrefs", () => {
    const { getByText } = render(<Nav items={sampleItems} />);
    expect(getByText("Home").closest("a")).toHaveAttribute("href", "/");
    expect(getByText("About").closest("a")).toHaveAttribute(
      "href",
      "/about",
    );
  });

  // ── Active item ──

  it("active item has active class", () => {
    const { getByText } = render(<Nav items={sampleItems} />);
    const homeLink = getByText("Home").closest("a")!;
    expect(homeLink.className).toContain("strand-nav__link--active");
  });

  it("active item has aria-current page", () => {
    const { getByText } = render(<Nav items={sampleItems} />);
    const homeLink = getByText("Home").closest("a")!;
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("inactive item does not have active class", () => {
    const { getByText } = render(<Nav items={sampleItems} />);
    const aboutLink = getByText("About").closest("a")!;
    expect(aboutLink.className).not.toContain("strand-nav__link--active");
  });

  // ── Glass variant ──

  it("applies glass class when glass is true", () => {
    const { container } = render(<Nav glass />);
    expect(container.firstElementChild?.className).toContain("strand-nav--glass");
  });

  it("does not apply glass class by default", () => {
    const { container } = render(<Nav />);
    expect(container.firstElementChild?.className).not.toContain("strand-nav--glass");
  });

  // ── Actions ──

  it("renders actions content", () => {
    const { getByText } = render(
      <Nav
        items={sampleItems}
        actions={<button type="button">Sign In</button>}
      />,
    );
    expect(getByText("Sign In")).toBeTruthy();
  });

  // ── Hamburger ──

  it("hamburger button has aria-expanded false initially", () => {
    const { container } = render(<Nav items={sampleItems} />);
    const hamburger = container.querySelector(".strand-nav__hamburger")!;
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  it("hamburger button has aria-label Menu", () => {
    const { container } = render(<Nav items={sampleItems} />);
    const hamburger = container.querySelector(".strand-nav__hamburger")!;
    expect(hamburger).toHaveAttribute("aria-label", "Menu");
  });

  it("clicking hamburger toggles menu and updates aria attributes", () => {
    const { container } = render(<Nav items={sampleItems} />);
    const hamburger = container.querySelector(
      ".strand-nav__hamburger",
    ) as HTMLButtonElement;

    // Initially closed
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
    expect(hamburger).toHaveAttribute("aria-label", "Menu");
    expect(
      container.querySelector(".strand-nav__mobile-menu"),
    ).toBeNull();

    // Open
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "true");
    expect(hamburger).toHaveAttribute("aria-label", "Close menu");
    expect(
      container.querySelector(".strand-nav__mobile-menu"),
    ).toBeTruthy();

    // Close
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
    expect(hamburger).toHaveAttribute("aria-label", "Menu");
  });

  it("mobile menu renders items when open", () => {
    const { container, getByText } = render(<Nav items={sampleItems} />);
    const hamburger = container.querySelector(
      ".strand-nav__hamburger",
    ) as HTMLButtonElement;
    fireEvent.click(hamburger);

    const mobileMenu = container.querySelector(".strand-nav__mobile-menu")!;
    expect(mobileMenu).toBeTruthy();
    // Items appear in both desktop and mobile, check mobile menu has them
    const mobileLinks = mobileMenu.querySelectorAll(".strand-nav__mobile-link");
    expect(mobileLinks.length).toBe(3);
  });

  it("mobile active item has active class", () => {
    const { container } = render(<Nav items={sampleItems} />);
    const hamburger = container.querySelector(
      ".strand-nav__hamburger",
    ) as HTMLButtonElement;
    fireEvent.click(hamburger);

    const mobileMenu = container.querySelector(".strand-nav__mobile-menu")!;
    const activeLink = mobileMenu.querySelector(
      ".strand-nav__mobile-link--active",
    );
    expect(activeLink).toBeTruthy();
    expect(activeLink!.textContent).toBe("Home");
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { getByRole } = render(
      <Nav items={sampleItems} className="custom-nav" />,
    );
    const nav = getByRole("navigation");
    expect(nav.className).toContain("strand-nav");
    expect(nav.className).toContain("custom-nav");
  });

  // ── Empty states ──

  it("renders without items", () => {
    const { getByRole } = render(<Nav />);
    expect(getByRole("navigation")).toBeTruthy();
  });

  it("renders without logo", () => {
    const { container } = render(<Nav items={sampleItems} />);
    expect(container.querySelector(".strand-nav__logo")).toBeNull();
  });

  // ── Reserved slot (layout stability) ──
  //
  // The slot is documented as the home for an account affordance, which is
  // exactly the content whose identity changes at runtime: one short button
  // signed out, an avatar plus a sign-out button signed in. Those are not the
  // same width, and in a flex row the resize moves the slot's own box AND
  // redistributes the free space every auto-margined sibling is sharing, so
  // the header visibly jumps on load, sign-in, and sign-out. --reserve pins
  // the inline size so the swap cannot move anything. The guards below pin
  // the mechanism rather than the number: a hardcoded width would defeat the
  // token, and dropping justify-content would unpin the affordance from the
  // right edge.

  it("reserve modifier pins the slot inline size via a token with a default", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const navCss = readFileSync(resolve(__dirname, "Nav.css"), "utf8");
    expect(navCss).toContain(".strand-nav__slot--reserve");
    expect(navCss).toMatch(
      /\.strand-nav__slot--reserve\s*\{[^}]*min-width:\s*var\(--strand-nav-slot-reserve,\s*[\d.]+rem\)/,
    );
    expect(navCss).toMatch(
      /\.strand-nav__slot--reserve\s*\{[^}]*justify-content:\s*flex-end/,
    );
  });

  it("reserve modifier drops to a tighter default at the mobile breakpoint", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const navCss = readFileSync(resolve(__dirname, "Nav.css"), "utf8");
    const mobile = navCss.slice(navCss.indexOf("@media (max-width: 767px)"));
    expect(mobile).toMatch(
      /\.strand-nav__slot--reserve\s*\{[^}]*min-width:\s*var\(--strand-nav-slot-reserve-sm,\s*[\d.]+rem\)/,
    );
  });
});

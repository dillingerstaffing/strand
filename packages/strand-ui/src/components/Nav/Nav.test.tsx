import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Nav } from "./Nav.js";

const sampleItems = [
  { label: "Home", href: "/", active: true },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

describe("Nav", () => {
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
});

import { resolve } from "node:path";
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

  it("active item has aria-current page", () => {
    const { getByText } = render(<Nav items={sampleItems} />);
    const homeLink = getByText("Home").closest("a")!;
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  // ── Glass variant ──

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

describe("mobile menu", () => {
  // ── Gap #96: mobileMenu (DL 19.1.1) ──

  it("ships the hamburger by default, because most surfaces need it", () => {
    const { container } = render(<Nav items={sampleItems} />);
    expect(container.querySelector(".strand-nav__hamburger")).toBeTruthy();
  });

  it("omits the hamburger entirely when the surface has its own destinations", () => {
    // Not hidden. A surface that has declared it has no mobile menu should not
    // ship the button that opens one, and a display:none control is still in
    // the DOM and still a thing to reason about.
    const { container } = render(<Nav items={sampleItems} mobileMenu={false} />);
    expect(container.querySelector(".strand-nav__hamburger")).toBeNull();
  });

  it("cannot open a panel it does not have", () => {
    const { container } = render(<Nav items={sampleItems} mobileMenu={false} />);
    expect(container.querySelector(".strand-nav__mobile-menu")).toBeNull();
  });

  it("still opens its panel when the hamburger is present", () => {
    // The default path must keep working, or the prop has quietly become a
    // breaking change for every existing consumer.
    const { container } = render(<Nav items={sampleItems} />);
    const btn = container.querySelector(".strand-nav__hamburger") as HTMLElement;
    expect(container.querySelector(".strand-nav__mobile-menu")).toBeNull();
    fireEvent.click(btn);
    expect(container.querySelector(".strand-nav__mobile-menu")).toBeTruthy();
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./Nav.fixtures.js";

snapshotFixtures(Nav, fixtures);

snapshotStylesheet(resolve(__dirname, "./Nav.css"));

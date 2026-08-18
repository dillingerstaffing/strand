/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useState } from "preact/hooks";
import { cx } from "../../internal/index.js";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "logo"> {
  /** Rendered on the left. */
  logo?: ComponentChildren;
  items?: NavItem[];
  /** Rendered on the right. */
  actions?: ComponentChildren;
  /** Fixed, frosted bar (DL 11.5); the stylesheet pads `body` for it via `body:has(.strand-nav--glass)`. */
  glass?: boolean;
  /** Render the hamburger and its panel below the md breakpoint. Pass `false` for an application shell that carries its destinations in a tab bar (DL 19.1.1). */
  mobileMenu?: boolean;
  /** Controlled open state of the mobile menu; internal when omitted. */
  menuOpen?: boolean;
  /** Called with the next open state when the hamburger is pressed. */
  onMenuToggle?: (open: boolean) => void;
}

/**
 * Top navigation bar with a logo slot, links, actions and a mobile menu.
 *
 * @example
 * <Nav logo={<img src="/logo.svg" alt="Brand" />} items={[{ label: "Home", href: "/", active: true }]} glass />
 */
export const Nav = forwardRef<HTMLElement, NavProps>(
  ({ logo, items = [], actions, glass = false, mobileMenu = true, menuOpen, onMenuToggle, className = "", ...rest }, ref) => {
    const [ownOpen, setOwnOpen] = useState(false);
    const open = menuOpen ?? ownOpen;
    const toggle = () => {
      const next = !open;
      if (menuOpen === undefined) setOwnOpen(next);
      onMenuToggle?.(next);
    };
    const links = (base: string) =>
      items.map((item) => (
        <a key={item.href} href={item.href} className={cx(base, item.active && `${base}--active`)} aria-current={item.active ? "page" : undefined}>
          {item.label}
        </a>
      ));
    return (
      <nav ref={ref} className={cx("strand-nav", glass && "strand-nav--glass", className)} aria-label="Main navigation" {...rest}>
        <div className="strand-nav__inner">
          {logo && <div className="strand-nav__logo">{logo}</div>}
          <div className="strand-nav__items">{links("strand-nav__link")}</div>
          {actions && <div className="strand-nav__actions">{actions}</div>}
          {mobileMenu && (
            <button type="button" className="strand-nav__hamburger" aria-expanded={open ? "true" : "false"} aria-label={open ? "Close menu" : "Menu"} onClick={toggle}>
              <span className="strand-nav__hamburger-icon" aria-hidden="true" />
            </button>
          )}
        </div>
        {mobileMenu && open && <div className="strand-nav__mobile-menu">{links("strand-nav__mobile-link")}</div>}
      </nav>
    );
  },
);
Nav.displayName = "Nav";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useState, useCallback, useEffect } from "preact/hooks";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavProps
  extends Omit<JSX.HTMLAttributes<HTMLElement>, "logo"> {
  /** Logo element rendered on the left */
  logo?: ComponentChildren;
  /** Navigation items */
  items?: NavItem[];
  /** Right-side action elements */
  actions?: ComponentChildren;
  /** Glassmorphic variant (fixed, backdrop-filter, DL 11.5) */
  glass?: boolean;
}

/**
 * Top-level navigation bar with logo slot, link items, actions, and responsive mobile menu.
 *
 * @example
 * ```tsx
 * import { Nav } from '@dillingerstaffing/strand-ui';
 *
 * <Nav
 *   logo={<img src="/logo.svg" alt="Brand" />}
 *   items={[
 *     { label: 'Home', href: '/', active: true },
 *     { label: 'About', href: '/about' },
 *   ]}
 *   glass
 * />
 * ```
 */
export const Nav = forwardRef<HTMLElement, NavProps>(
  ({ logo, items = [], actions, glass = false, className = "", ...rest }, ref) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = useCallback(() => {
      setMenuOpen((prev) => !prev);
    }, []);

    useEffect(() => {
      if (glass) {
        document.body.classList.add("strand-glass-nav-active");
        return () => document.body.classList.remove("strand-glass-nav-active");
      }
    }, [glass]);

    const classes = ["strand-nav", glass && "strand-nav--glass", className].filter(Boolean).join(" ");

    return (
      <nav ref={ref} className={classes} aria-label="Main navigation" {...rest}>
        <div className="strand-nav__inner">
          {logo && <div className="strand-nav__logo">{logo}</div>}

          <div className="strand-nav__items">
            {items.map((item) => {
              const linkClasses = [
                "strand-nav__link",
                item.active && "strand-nav__link--active",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={linkClasses}
                  aria-current={item.active ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {actions && <div className="strand-nav__actions">{actions}</div>}

          <button
            type="button"
            className="strand-nav__hamburger"
            aria-expanded={menuOpen ? "true" : "false"}
            aria-label={menuOpen ? "Close menu" : "Menu"}
            onClick={toggleMenu}
          >
            <span className="strand-nav__hamburger-icon" aria-hidden="true" />
          </button>
        </div>

        {menuOpen && (
          <div className="strand-nav__mobile-menu">
            {items.map((item) => {
              const linkClasses = [
                "strand-nav__mobile-link",
                item.active && "strand-nav__mobile-link--active",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={linkClasses}
                  aria-current={item.active ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        )}
      </nav>
    );
  },
);

Nav.displayName = "Nav";

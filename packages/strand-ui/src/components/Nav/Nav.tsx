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
  /**
   * Render the hamburger and its slide-down panel below the md breakpoint.
   * Defaults to `true`, which is the right answer for a content surface.
   *
   * Pass `false` when the surface is an application shell that already carries
   * its destinations in a persistent viewport-anchored region (DL 19.1.1). A
   * bottom bar coexisting with a hamburger is two answers to one question, and
   * the spec rules it out; without this prop the only way to comply was to
   * override `.strand-nav__hamburger` from the consumer, which the strand-first
   * gate forbids.
   *
   * A consumer with no other mobile navigation still needs the hamburger, so
   * the default cannot change.
   */
  mobileMenu?: boolean;
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
  (
    { logo, items = [], actions, glass = false, mobileMenu = true, className = "", ...rest },
    ref,
  ) => {
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

          {/* Not rendered rather than hidden. A `display: none` control is out
              of the accessibility tree but still in the DOM and still a thing
              to reason about; a surface that has declared it has no mobile menu
              should not ship the button that opens one. */}
          {mobileMenu && (
            <button
              type="button"
              className="strand-nav__hamburger"
              aria-expanded={menuOpen ? "true" : "false"}
              aria-label={menuOpen ? "Close menu" : "Menu"}
              onClick={toggleMenu}
            >
              <span className="strand-nav__hamburger-icon" aria-hidden="true" />
            </button>
          )}
        </div>

        {mobileMenu && menuOpen && (
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

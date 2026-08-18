/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "children"> {
  /** The path; the last item is the current page. */
  items: BreadcrumbItem[];
  /** Separator between items. */
  separator?: string;
  /** `instrument` renders the trail as a mono uppercase readout. */
  variant?: "default" | "instrument";
}

/**
 * Hierarchical navigation path.
 *
 * @example
 * <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Profile" }]} />
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator = "/", variant = "default", className = "", ...rest }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cx("strand-breadcrumb", variant !== "default" && `strand-breadcrumb--${variant}`, className)}
      {...rest}
    >
      <ol className="strand-breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="strand-breadcrumb__item">
              {index > 0 && (
                <span className="strand-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
              {isLast ? (
                <span className="strand-breadcrumb__current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className="strand-breadcrumb__link">
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  ),
);
Breadcrumb.displayName = "Breadcrumb";

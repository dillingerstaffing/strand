/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  /** Called when the item is activated; without an href the item renders as a button. */
  onClick?: (e: MouseEvent) => void;
}

export interface BreadcrumbProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "children" | "label"> {
  /** The path; the last item is the current page. */
  items: BreadcrumbItem[];
  /** Separator between items. */
  separator?: ComponentChildren;
  /** `instrument` renders the trail as a mono uppercase readout. */
  variant?: "default" | "instrument";
  /** Accessible name of the navigation landmark. */
  label?: string;
}

/**
 * Hierarchical navigation path.
 *
 * @example
 * <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Profile" }]} />
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator = "/", variant = "default", label = "Breadcrumb", className = "", ...rest }, ref) => (
    <nav ref={ref} aria-label={label} className={cx("strand-breadcrumb", variant !== "default" && `strand-breadcrumb--${variant}`, className)} {...rest}>
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
              ) : item.href ? (
                <a href={item.href} className="strand-breadcrumb__link" onClick={item.onClick}>
                  {item.label}
                </a>
              ) : (
                <button type="button" className="strand-breadcrumb__link" onClick={item.onClick}>
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  ),
);
Breadcrumb.displayName = "Breadcrumb";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps
  extends Omit<JSX.HTMLAttributes<HTMLElement>, "children"> {
  /** Breadcrumb path items; last item is treated as current page */
  items: BreadcrumbItem[];
  /** Separator character between items */
  separator?: string;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator = "/", className = "", ...rest }, ref) => {
    const classes = ["strand-breadcrumb", className]
      .filter(Boolean)
      .join(" ");

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={classes} {...rest}>
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
                  <span
                    className="strand-breadcrumb__current"
                    aria-current="page"
                  >
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
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";

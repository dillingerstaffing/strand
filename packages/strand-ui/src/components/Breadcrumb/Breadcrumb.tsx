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
  /**
   * `instrument` renders the trail as a mono uppercase readout rather than
   * body text, for a breadcrumb sitting in a tinted page header beside other
   * instrument labels.
   *
   * Added because a consumer placing one in a hero band had no way to reach
   * that treatment and could only get there by styling
   * `.strand-breadcrumb__link` from its own stylesheet, which is the
   * page-local override of a design-system class that the dogfood protocol
   * exists to prevent. A component nobody can style in a header is a
   * component consumers re-implement.
   */
  variant?: "default" | "instrument";
}

/**
 * Hierarchical navigation path showing the current page location.
 *
 * @example
 * ```tsx
 * import { Breadcrumb } from '@dillingerstaffing/strand-ui';
 *
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Settings', href: '/settings' },
 *     { label: 'Profile' },
 *   ]}
 * />
 * ```
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator = "/", variant = "default", className = "", ...rest }, ref) => {
    const classes = [
      "strand-breadcrumb",
      variant !== "default" && `strand-breadcrumb--${variant}`,
      className,
    ]
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

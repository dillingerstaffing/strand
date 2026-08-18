/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface StatStripItem {
  /** Overline label. */
  label: string;
  /** Pre-formatted value. */
  value: string;
}

export interface StatStripProps extends JSX.HTMLAttributes<HTMLDListElement> {
  items: StatStripItem[];
  /** `bordered` pads each cell and rules between them. */
  variant?: "plain" | "bordered";
  className?: string;
}

/**
 * A row of labelled values compared across, as a description list.
 *
 * @example
 * <StatStrip items={[{ label: "Group", value: "East Bay" }]} />
 */
export const StatStrip = forwardRef<HTMLDListElement, StatStripProps>(({ items, variant = "plain", className = "", ...rest }, ref) => (
  <dl ref={ref} className={cx("strand-stat-strip", variant === "bordered" && "strand-stat-strip--bordered", className)} {...rest}>
    {items.map((item) => (
      <div key={item.label} className="strand-stat-strip__cell">
        <dt className="strand-stat-strip__label">{item.label}</dt>
        <dd className="strand-stat-strip__value">{item.value}</dd>
      </div>
    ))}
  </dl>
));
StatStrip.displayName = "StatStrip";

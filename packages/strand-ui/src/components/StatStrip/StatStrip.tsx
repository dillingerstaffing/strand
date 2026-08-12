/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface StatStripItem {
  /** Short label, rendered in the overline pattern. */
  label: string;
  /** The value. Pre-formatted. */
  value: string;
}

export interface StatStripProps extends JSX.HTMLAttributes<HTMLDListElement> {
  items: StatStripItem[];
  /** `bordered` gives each cell padding and a hairline rule between. */
  variant?: "plain" | "bordered";
  className?: string;
}

/**
 * A row of labelled value cells, compared across rather than read singly.
 *
 * Not `DataReadout`: that renders ONE label-and-value pair as a unit, with
 * sizes tuned for a single dominant figure. Here the cells are peers, so
 * they are equal-width and their values share a baseline.
 *
 * Renders as a description list, because that is what it is: each cell is
 * a term and its description. A row of divs would give a screen reader
 * six unrelated strings instead of three pairs.
 *
 * @example
 * ```tsx
 * <StatStrip items={[
 *   { label: 'Group', value: 'East Bay' },
 *   { label: 'Meet at', value: 'Skyline Gate' },
 * ]} />
 * <StatStrip variant="bordered" items={stats} />
 * ```
 */
export const StatStrip = forwardRef<HTMLDListElement, StatStripProps>(
  ({ items, variant = "plain", className = "", ...rest }, ref) => {
    const classes = [
      "strand-stat-strip",
      variant === "bordered" ? "strand-stat-strip--bordered" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <dl ref={ref} class={classes} {...rest}>
        {items.map((item) => (
          // The div groups a term with its description, which is the
          // only way <dl> expresses "these two belong together" when
          // several pairs sit side by side.
          <div key={item.label} class="strand-stat-strip__cell">
            <dt class="strand-stat-strip__label">{item.label}</dt>
            <dd class="strand-stat-strip__value">{item.value}</dd>
          </div>
        ))}
      </dl>
    );
  },
);
StatStrip.displayName = "StatStrip";

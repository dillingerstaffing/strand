/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

/** The four category encodings the instrument sector palette defines. */
export type MapLegendCategory = "tech" | "health" | "trades" | "finance";

export interface MapLegendItem {
  /** Which sector dot to draw. */
  category: MapLegendCategory;
  /** Human label for the category. */
  label: string;
  /** Called when the item is activated, for filtering by category. */
  onSelect?: () => void;
}

export interface MapLegendProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Overline heading. Defaults to "Legend". */
  title?: string;
  items: MapLegendItem[];
  className?: string;
}

/**
 * The category key for an instrument viewport's map.
 *
 * The four sector colours are the ONLY place the Blue Discipline
 * (design-language.md Part III.4) is relaxed, and 9.3's sector palette
 * says why: multi-category encoding is the instrument's purpose, so the
 * colour is data rather than decoration.
 *
 * An item is a button when it filters and a plain row when it does not.
 * A legend that only explains is not interactive, and giving it a button
 * role anyway would promise an action that does not exist.
 *
 * @example
 * ```tsx
 * <MapLegend items={[
 *   { category: 'tech', label: 'Technology', onSelect: () => filter('tech') },
 *   { category: 'health', label: 'Health' },
 * ]} />
 * ```
 */
export const MapLegend = forwardRef<HTMLDivElement, MapLegendProps>(
  ({ title = "Legend", items, className = "", ...rest }, ref) => {
    const classes = ["strand-map-legend", className].filter(Boolean).join(" ");
    return (
      <div ref={ref} class={classes} {...rest}>
        <div class="strand-map-legend__title">{title}</div>
        {items.map((item) => {
          const dot = (
            <span
              class={`strand-map-legend__dot strand-map-legend__dot--${item.category}`}
              aria-hidden="true"
            />
          );
          // Interactive only when it does something. A row with a button
          // role and no handler announces an action the user cannot take.
          return item.onSelect ? (
            <button
              key={item.category}
              type="button"
              class="strand-map-legend__item"
              onClick={item.onSelect}
            >
              {dot}
              {item.label}
            </button>
          ) : (
            <div key={item.category} class="strand-map-legend__item">
              {dot}
              {item.label}
            </div>
          );
        })}
      </div>
    );
  },
);
MapLegend.displayName = "MapLegend";

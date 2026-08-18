/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export type MapLegendCategory = "tech" | "health" | "trades" | "finance";

export interface MapLegendItem {
  /** Sector dot to draw. */
  category: MapLegendCategory;
  label: string;
  /** Makes the row a filter button. */
  onSelect?: () => void;
}

export interface MapLegendProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Overline heading. */
  title?: string;
  items: MapLegendItem[];
  className?: string;
}

/**
 * Category key for a map on an instrument viewport; a row is a button only when it filters.
 *
 * @example
 * <MapLegend items={[{ category: "tech", label: "Technology", onSelect: () => filter("tech") }]} />
 */
export const MapLegend = forwardRef<HTMLDivElement, MapLegendProps>(
  ({ title = "Legend", items, className = "", ...rest }, ref) => (
    <div ref={ref} className={cx("strand-map-legend", className)} {...rest}>
      <div className="strand-map-legend__title">{title}</div>
      {items.map((item) => {
        const dot = <span className={`strand-map-legend__dot strand-map-legend__dot--${item.category}`} aria-hidden="true" />;
        return item.onSelect ? (
          <button key={item.category} type="button" className="strand-map-legend__item" onClick={item.onSelect}>
            {dot}
            {item.label}
          </button>
        ) : (
          <div key={item.category} className="strand-map-legend__item">
            {dot}
            {item.label}
          </div>
        );
      })}
    </div>
  ),
);
MapLegend.displayName = "MapLegend";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface MapLoadingProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Showing; it fades rather than unmounts, so keep it mounted and flip this. */
  visible?: boolean;
  /** Caption in instrument voice. */
  text?: string;
  className?: string;
}

/**
 * The screen that covers an instrument viewport while it boots.
 *
 * @example
 * <MapLoading visible={!ready} text="Scanning" />
 */
export const MapLoading = forwardRef<HTMLDivElement, MapLoadingProps>(
  ({ visible = true, text = "Processing", className = "", ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-map-loading", !visible && "strand-map-loading--hidden", className)}
      role="status"
      aria-live="polite"
      aria-busy={visible ? "true" : "false"}
      {...rest}
    >
      <div className="strand-map-loading__spinner" aria-hidden="true" />
      <div className="strand-map-loading__text">{text}</div>
      <div className="strand-map-loading__bar" aria-hidden="true" />
    </div>
  ),
);
MapLoading.displayName = "MapLoading";

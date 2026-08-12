/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface MapLoadingProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Whether the screen is showing. Default true: it covers a booting
      instrument, so the safe state is present rather than absent. */
  visible?: boolean;
  /** Caption in instrument voice (11.7): "Processing", not "Loading...". */
  text?: string;
  className?: string;
}

/**
 * The screen that covers an instrument viewport while it boots.
 *
 * Fades out rather than unmounting, so the map beneath is never revealed
 * mid-paint. Keep it mounted and flip `visible`.
 *
 * Accessibility: `role="status"` with `aria-live="polite"`, so the
 * caption is announced once when it appears and the change of state is
 * not silent for a screen reader. `aria-busy` marks the region as still
 * settling.
 *
 * @example
 * ```tsx
 * <MapLoading visible={!ready} text="Scanning" />
 * ```
 */
export const MapLoading = forwardRef<HTMLDivElement, MapLoadingProps>(
  ({ visible = true, text = "Processing", className = "", ...rest }, ref) => {
    const classes = [
      "strand-map-loading",
      visible ? "" : "strand-map-loading--hidden",
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <div
        ref={ref}
        class={classes}
        role="status"
        aria-live="polite"
        aria-busy={visible ? "true" : "false"}
        {...rest}
      >
        <div class="strand-map-loading__spinner" aria-hidden="true" />
        <div class="strand-map-loading__text">{text}</div>
        <div class="strand-map-loading__bar" aria-hidden="true" />
      </div>
    );
  },
);
MapLoading.displayName = "MapLoading";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface InstrumentViewportProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Subtle grid overlay. */
  grid?: boolean;
  /** Page-filling cabinet (DL 9.3); the host page adds `strand-body--instrument` to body. */
  fullBleed?: boolean;
}

/**
 * Recessed dark surface for instrument-style content.
 *
 * @example
 * <InstrumentViewport grid><DataReadout label="Uptime" value="99.9%" /></InstrumentViewport>
 */
export const InstrumentViewport = forwardRef<HTMLDivElement, InstrumentViewportProps>(
  ({ grid = false, fullBleed = false, className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx(
        "strand-instrument-viewport",
        grid && "strand-instrument-viewport--grid",
        fullBleed && "strand-instrument-viewport--full-bleed",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);
InstrumentViewport.displayName = "InstrumentViewport";

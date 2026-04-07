/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface InstrumentViewportProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Show subtle grid overlay */
  grid?: boolean;
  /** Render as page-filling instrument cabinet (DL Part 9.3 full-bleed mode).
   *  Requires the host page to apply `strand-body--instrument` to <body>
   *  so the dark surface reaches the screen edge. */
  fullBleed?: boolean;
}

export const InstrumentViewport = forwardRef<
  HTMLDivElement,
  InstrumentViewportProps
>(
  (
    { grid = false, fullBleed = false, className = "", children, ...rest },
    ref,
  ) => {
    const classes = [
      "strand-instrument-viewport",
      grid ? "strand-instrument-viewport--grid" : "",
      fullBleed ? "strand-instrument-viewport--full-bleed" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  },
);

InstrumentViewport.displayName = "InstrumentViewport";

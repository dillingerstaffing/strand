/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface InstrumentViewportProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Show subtle grid overlay */
  grid?: boolean;
}

export const InstrumentViewport = forwardRef<
  HTMLDivElement,
  InstrumentViewportProps
>(({ grid = false, className = "", children, ...rest }, ref) => {
  const classes = [
    "strand-instrument-viewport",
    grid ? "strand-instrument-viewport--grid" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={classes} {...rest}>
      {children}
    </div>
  );
});

InstrumentViewport.displayName = "InstrumentViewport";

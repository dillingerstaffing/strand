/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Number of equal-width columns */
  columns?: number;
  /** Gap between items, maps to --strand-space-{n} */
  gap?: number;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns = 1,
      gap = 4,
      className = "",
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = ["strand-grid", className].filter(Boolean).join(" ");

    const inlineStyle: Record<string, string> = {
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: `var(--strand-space-${gap})`,
    };

    return (
      <div
        ref={ref}
        className={classes}
        style={{ ...inlineStyle, ...(style as Record<string, string>) }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Grid.displayName = "Grid";

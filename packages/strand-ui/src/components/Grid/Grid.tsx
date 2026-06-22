/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Number of equal-width columns. Ignored when `minColWidth` is set. */
  columns?: number;
  /** Gap between items, maps to --strand-space-{n} */
  gap?: number;
  /**
   * Minimum column width in px for a responsive auto-fit track. When set, the
   * grid renders `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`, so the
   * column count tracks the container width and `columns` is ignored. This is
   * the component form of the `strand-grid--auto-*` utilities.
   */
  minColWidth?: number;
}

/**
 * CSS Grid layout with a fixed column count or a responsive auto-fit track.
 *
 * @example
 * ```tsx
 * import { Grid, Card } from '@dillingerstaffing/strand-ui';
 *
 * // Fixed: exactly 3 equal columns
 * <Grid columns={3} gap={6}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 *
 * // Responsive: as many ~220px columns as fit, reflowing with width
 * <Grid minColWidth={220} gap={3}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 * </Grid>
 * ```
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns = 1,
      gap = 4,
      minColWidth,
      className = "",
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = ["strand-grid", className].filter(Boolean).join(" ");

    const inlineStyle: Record<string, string> = {
      gridTemplateColumns:
        minColWidth != null
          ? `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`
          : `repeat(${columns}, 1fr)`,
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

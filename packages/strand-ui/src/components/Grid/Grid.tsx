/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { type SpacingStep, resolveGap, warnOffLadderGap } from "../../spacing.js";

export interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Number of equal-width columns. Ignored when `minColWidth` is set. */
  columns?: number;
  /**
   * Gap between items, a rung on the spacing ladder (DL Part V 5.1).
   *
   * Typed to the ladder for the reason `Stack` records: an off-ladder value
   * wrote `gap: var(--strand-space-7)`, the token is undefined, and an
   * undefined custom property invalidates the WHOLE declaration, so the grid
   * rendered with no gap.
   */
  gap?: SpacingStep | number;
  /**
   * Minimum column width in px for a responsive auto-fit track. When set, the
   * grid renders `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`, so the
   * column count tracks the container width and `columns` is ignored. This is
   * the component form of the `strand-grid--auto-*` utilities.
   */
  minColWidth?: number;
  /**
   * A fixed 264px rail beside a flexible main track, collapsing to one
   * column below the md breakpoint. Takes precedence over `columns` and
   * `minColWidth`, because a sidebar layout is a statement about the
   * TRACKS rather than about how many of them there are.
   *
   * Put the rail FIRST in the markup: below the breakpoint the two
   * regions stack in source order, and a filter the reader meets after
   * the results it filters is one they have already scrolled past.
   */
  sidebar?: boolean;
  /**
   * A flexible main track beside a fixed-width panel, collapsing to one
   * column below the md breakpoint. `sidebar` mirrored: there the fixed
   * track is narrow and on the left, here it is wide and on the right.
   *
   * Set the panel width with `--strand-split-panel` (default 600px); the
   * two known consumers want 600 and 380 and the shape is identical, so
   * a second preset would be two names for one idea.
   *
   * Put the MAIN track first: below the breakpoint the regions stack in
   * source order, and a map or detail panel is what the list is about,
   * so it follows the thing it illustrates.
   */
  split?: boolean;
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
      sidebar = false,
      split = false,
      className = "",
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-grid",
      sidebar ? "strand-grid--sidebar" : "",
      split ? "strand-grid--split" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // The sidebar preset lives in the stylesheet because its column
    // definition changes at a breakpoint, and an inline style cannot
    // carry a media query. So this branch emits no gridTemplateColumns at
    // all rather than emitting one the class would then have to fight.
    // THE LADDER IS THE CONTRACT, same as `Stack`. An off-ladder gap wrote
    // `var(--strand-space-7)`, which is undefined, and an undefined custom
    // property invalidates the WHOLE declaration: the grid rendered with no
    // gap rather than with a smaller one.
    const resolved = resolveGap(gap);
    if (!resolved.exact) warnOffLadderGap("Grid", gap as number, resolved.step);

    const inlineStyle: Record<string, string> = {
      ...(sidebar || split
        ? {}
        : {
            // `minmax(0, 1fr)`, never a bare `1fr`: a bare one floors at the
            // track's min-content width, so a single long unbroken string
            // widens the grid past its container. The base rule's
            // `min-width: 0` on children handles the ITEM; this handles the
            // TRACK. The stylesheet's `--cols-*` utilities carry the same
            // form, so the component and the class cannot disagree.
            gridTemplateColumns:
              minColWidth != null
                ? `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`
                : `repeat(${columns}, minmax(0, 1fr))`,
          }),
      gap: `var(--strand-space-${resolved.step})`,
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

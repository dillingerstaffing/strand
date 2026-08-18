/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { type SpacingStep, resolveGap, warnOffLadderGap } from "../../spacing.js";
import { cx } from "../../internal/index.js";

export interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Equal-width columns; ignored when `minColWidth` is set. */
  columns?: number;
  /** Gap, a rung on the spacing ladder (cf: spacing-ladder). */
  gap?: SpacingStep | number;
  /** Minimum column width in px for an auto-fit track. */
  minColWidth?: number;
  /** A fixed 264px rail beside a flexible main track; put the rail first. */
  sidebar?: boolean;
  /** A flexible main track beside a fixed panel (`--strand-split-panel`, default 600px); put the main track first. */
  split?: boolean;
}

/**
 * CSS grid with fixed columns, an auto-fit track, or a sidebar/split preset.
 *
 * @example
 * <Grid columns={3} gap={6}><Card>1</Card><Card>2</Card><Card>3</Card></Grid>
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ columns = 1, gap = 4, minColWidth, sidebar = false, split = false, className = "", style, children, ...rest }, ref) => {
    const resolved = resolveGap(gap);
    if (!resolved.exact) warnOffLadderGap("Grid", gap as number, resolved.step);
    // The presets live in the stylesheet because their tracks change at a breakpoint; a bare 1fr floors at min-content, so tracks are minmax(0, 1fr).
    const inlineStyle: Record<string, string> = {
      ...(sidebar || split
        ? {}
        : { gridTemplateColumns: minColWidth != null ? `repeat(auto-fit, minmax(${minColWidth}px, 1fr))` : `repeat(${columns}, minmax(0, 1fr))` }),
      gap: `var(--strand-space-${resolved.step})`,
    };
    return (
      <div
        ref={ref}
        className={cx("strand-grid", sidebar && "strand-grid--sidebar", split && "strand-grid--split", className)}
        style={{ ...inlineStyle, ...(style as Record<string, string>) }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
Grid.displayName = "Grid";

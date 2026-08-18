/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Surface style; `interactive` is kept for compatibility, prefer the boolean. */
  variant?: "elevated" | "outlined" | "flat" | "warm" | "interactive";
  /** Inner padding. */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** Hover and pointer affordance, orthogonal to the surface. */
  interactive?: boolean;
  /** Pressed or selected state. */
  active?: boolean;
  /** Element to render, e.g. "article". */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Contained surface for grouping related content.
 *
 * @example
 * <Card variant="outlined" padding="lg"><h3>Title</h3></Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "elevated", padding = "md", interactive = false, active = false, as = "div", className = "", children, ...rest }, ref) => {
    // biome-ignore lint/suspicious/noExplicitAny: polymorphic tag
    const Tag = as as any;
    return (
      <Tag
        ref={ref}
        className={cx(
          "strand-card",
          variant !== "elevated" && `strand-card--${variant}`,
          `strand-card--pad-${padding}`,
          interactive && variant !== "interactive" && "strand-card--interactive",
          active && "strand-card--active",
          className,
        )}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);
Card.displayName = "Card";

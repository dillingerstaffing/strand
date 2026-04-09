/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: "elevated" | "outlined" | "interactive";
  /** Inner padding */
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * Contained surface for grouping related content with elevation and padding options.
 *
 * @example
 * ```tsx
 * import { Card } from '@dillingerstaffing/strand-ui';
 *
 * <Card variant="elevated" padding="lg">
 *   <h3>Card Title</h3>
 *   <p>Card content goes here.</p>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "elevated",
      padding = "md",
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-card",
      `strand-card--${variant}`,
      `strand-card--pad-${padding}`,
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

Card.displayName = "Card";

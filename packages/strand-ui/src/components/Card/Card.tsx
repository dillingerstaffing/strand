/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Surface style. `interactive` is retained for backward compatibility but is
   * really a state; prefer the `interactive` boolean with a surface variant.
   */
  variant?: "elevated" | "outlined" | "flat" | "warm" | "interactive";
  /** Inner padding */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** Hover/pointer affordance, orthogonal to the surface variant */
  interactive?: boolean;
  /** Pressed or currently-selected state */
  active?: boolean;
  /** Semantic element to render (e.g. "article" for a list card). Defaults to "div". */
  as?: keyof JSX.IntrinsicElements;
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
      interactive = false,
      active = false,
      as = "div",
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    // A variable intrinsic tag can't be statically checked against the union
    // of every element's props, so the tag is cast at the render boundary
    // while the public `as` prop stays fully typed for consumers.
    // biome-ignore lint/suspicious/noExplicitAny: polymorphic tag boundary
    const Tag = as as any;
    const classes = [
      "strand-card",
      `strand-card--${variant}`,
      `strand-card--pad-${padding}`,
      // State modifiers are orthogonal to the surface variant. Skip the
      // interactive modifier when the variant already is interactive so the
      // class is never emitted twice.
      interactive && variant !== "interactive" && "strand-card--interactive",
      active && "strand-card--active",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Tag ref={ref} className={classes} {...rest}>
        {children}
      </Tag>
    );
  },
);

Card.displayName = "Card";

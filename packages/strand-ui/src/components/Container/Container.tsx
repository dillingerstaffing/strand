/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface ContainerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Max-width constraint */
  size?: "narrow" | "default" | "wide" | "full";
  /** Semantic element to render (e.g. "main", "section"). Defaults to "div". */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Centered max-width wrapper for constraining page content.
 *
 * @example
 * ```tsx
 * import { Container } from '@dillingerstaffing/strand-ui';
 *
 * <Container size="default">
 *   <p>Content constrained to default max width.</p>
 * </Container>
 * ```
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = "default",
      as = "div",
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    // biome-ignore lint/suspicious/noExplicitAny: polymorphic tag boundary
    const Tag = as as any;
    const classes = [
      "strand-container",
      `strand-container--${size}`,
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

Container.displayName = "Container";

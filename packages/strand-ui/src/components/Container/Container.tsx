/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface ContainerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Max-width constraint */
  size?: "narrow" | "default" | "wide" | "full";
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
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-container",
      `strand-container--${size}`,
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

Container.displayName = "Container";

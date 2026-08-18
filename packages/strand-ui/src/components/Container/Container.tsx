/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface ContainerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Max-width tier. */
  size?: "narrow" | "default" | "wide" | "full";
  /** Element to render, e.g. "main". */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Centered max-width wrapper.
 *
 * @example
 * <Container size="narrow"><p>Prose</p></Container>
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "default", as = "div", className = "", children, ...rest }, ref) => {
    // biome-ignore lint/suspicious/noExplicitAny: polymorphic tag
    const Tag = as as any;
    return (
      <Tag ref={ref} className={cx("strand-container", `strand-container--${size}`, className)} {...rest}>
        {children}
      </Tag>
    );
  },
);
Container.displayName = "Container";

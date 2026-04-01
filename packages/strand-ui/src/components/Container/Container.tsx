/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface ContainerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Max-width constraint */
  size?: "narrow" | "default" | "wide" | "full";
}

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

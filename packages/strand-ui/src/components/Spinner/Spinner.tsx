/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface SpinnerProps
  extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, "size"> {
  /** Size of the spinner */
  size?: "sm" | "md" | "lg";
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      size = "md",
      className = "",
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-spinner",
      `strand-spinner--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} role="status" {...rest}>
        <span className="strand-spinner__ring" aria-hidden="true" />
        <span className="strand-spinner__sr-only">Loading</span>
      </span>
    );
  },
);

Spinner.displayName = "Spinner";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface SpinnerProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, "size" | "label"> {
  size?: "sm" | "md" | "lg";
  /** What is loading, read to assistive tech. */
  label?: string;
}

/**
 * Loading indicator with a screen-reader label.
 *
 * @example
 * <Spinner size="lg" />
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(({ size = "md", label = "Loading", className = "", ...rest }, ref) => (
  <span ref={ref} className={cx("strand-spinner", `strand-spinner--${size}`, className)} role="status" {...rest}>
    <span className="strand-spinner__ring" aria-hidden="true" />
    <span className="strand-sr-only">{label}</span>
  </span>
));
Spinner.displayName = "Spinner";

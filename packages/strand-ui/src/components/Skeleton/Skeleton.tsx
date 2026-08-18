/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface SkeletonProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "width" | "height"> {
  variant?: "text" | "rectangle" | "circle";
  /** CSS width. */
  width?: string;
  /** CSS height. */
  height?: string;
}

/**
 * Placeholder shape shown while content loads.
 *
 * @example
 * <Skeleton variant="rectangle" width="100%" height="200px" />
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(({ variant = "text", width, height, className = "", ...rest }, ref) => {
  const effectiveWidth = width ?? (variant === "text" ? "100%" : undefined);
  const effectiveHeight = variant === "circle" ? effectiveWidth : height;
  return (
    <div
      ref={ref}
      className={cx("strand-skeleton", `strand-skeleton--${variant}`, "strand-skeleton--shimmer", className)}
      aria-hidden="true"
      style={{ width: effectiveWidth, height: effectiveHeight }}
      {...rest}
    />
  );
});
Skeleton.displayName = "Skeleton";

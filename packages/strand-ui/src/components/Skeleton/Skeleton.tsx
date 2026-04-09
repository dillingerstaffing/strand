/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface SkeletonProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "width" | "height"> {
  /** Shape variant */
  variant?: "text" | "rectangle" | "circle";
  /** CSS width value */
  width?: string;
  /** CSS height value */
  height?: string;
}

/**
 * Placeholder shimmer shape used while content is loading.
 *
 * @example
 * ```tsx
 * import { Skeleton } from '@dillingerstaffing/strand-ui';
 *
 * <Skeleton variant="text" width="60%" />
 * <Skeleton variant="circle" width="48px" />
 * <Skeleton variant="rectangle" width="100%" height="200px" />
 * ```
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = "text",
      width,
      height,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const effectiveWidth = width ?? (variant === "text" ? "100%" : undefined);
    const effectiveHeight =
      variant === "circle" ? effectiveWidth : height;

    const classes = [
      "strand-skeleton",
      `strand-skeleton--${variant}`,
      "strand-skeleton--shimmer",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        aria-hidden="true"
        style={{
          width: effectiveWidth,
          height: effectiveHeight,
        }}
        {...rest}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

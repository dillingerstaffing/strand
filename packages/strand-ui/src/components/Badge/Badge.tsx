/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface BadgeProps
  extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Badge display mode */
  variant?: "dot" | "count";
  /** Color status */
  status?: "default" | "teal" | "blue" | "amber" | "red";
  /** Number to display (count variant only) */
  count?: number;
  /** Maximum count before showing "N+" */
  maxCount?: number;
  /** Wrapped content; when present badge is positioned at top-right */
  children?: ComponentChildren;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "count",
      status = "default",
      count,
      maxCount = 99,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const hasChildren = children != null && children !== false;

    const displayValue =
      variant === "count"
        ? count != null && count > maxCount
          ? `${maxCount}+`
          : count
        : null;

    const ariaLabel =
      variant === "dot"
        ? "Status indicator"
        : count != null
          ? `${count} notifications`
          : undefined;

    const badgeClasses = [
      "strand-badge__indicator",
      `strand-badge--${variant}`,
      `strand-badge--${status}`,
    ]
      .filter(Boolean)
      .join(" ");

    const badge = (
      <span className={badgeClasses} aria-label={ariaLabel} role="status">
        {displayValue}
      </span>
    );

    if (!hasChildren) {
      const inlineClasses = [
        "strand-badge",
        "strand-badge--inline",
        className,
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <span ref={ref} className={inlineClasses} {...rest}>
          {badge}
        </span>
      );
    }

    const wrapperClasses = ["strand-badge", className]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={wrapperClasses} {...rest}>
        {children}
        {badge}
      </span>
    );
  },
);

Badge.displayName = "Badge";

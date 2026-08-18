/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface BadgeProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** A count, or a dot. */
  variant?: "dot" | "count";
  /** Colour status. */
  status?: "default" | "teal" | "blue" | "amber" | "red";
  /** The number shown by the count variant. */
  count?: number;
  /** Counts above this render as "N+". */
  maxCount?: number;
  /** Pulse: the thing it marks is live. */
  live?: boolean;
  /** Content the badge overlays at its top-right corner. */
  children?: ComponentChildren;
}

/**
 * Small status indicator or notification count, inline or overlaid on content.
 *
 * @example
 * <Badge count={5} status="red"><button>Inbox</button></Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "count", status = "default", count, maxCount = 99, live = false, className = "", children, ...rest }, ref) => {
    const hasChildren = children != null && children !== false;
    const displayValue = variant === "count" ? (count != null && count > maxCount ? `${maxCount}+` : count) : null;
    const ariaLabel = variant === "dot" ? "Status indicator" : count != null ? `${count} notifications` : undefined;
    const badge = (
      <span
        className={cx("strand-badge__indicator", `strand-badge--${variant}`, `strand-badge--${status}`, live && "strand-badge--live")}
        aria-label={ariaLabel}
        role="status"
      >
        {displayValue}
      </span>
    );
    return (
      <span ref={ref} className={cx("strand-badge", !hasChildren && "strand-badge--inline", className)} {...rest}>
        {hasChildren && children}
        {badge}
      </span>
    );
  },
);
Badge.displayName = "Badge";

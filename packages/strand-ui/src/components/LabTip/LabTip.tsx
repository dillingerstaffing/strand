/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface LabTipProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  /** Force the bubble to appear without hover/focus. */
  pinned?: boolean;
}

/**
 * Hover/focus-driven tooltip specimen (pure CSS, not the
 * production Tooltip component). Use inside docs pages to
 * show how tips look at fixed positions around a trigger.
 */
export const LabTip = forwardRef<HTMLSpanElement, LabTipProps>(
  ({ pinned = false, className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={[
        "strand-ref-tip",
        pinned && "strand-ref-tip--pinned",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </span>
  ),
);
LabTip.displayName = "LabTip";

export type LabTipBubblePlacement = "top" | "bottom" | "left" | "right";

export interface LabTipBubbleProps
  extends JSX.HTMLAttributes<HTMLSpanElement> {
  /** Bubble placement relative to the trigger (top / bottom / left / right). */
  placement?: LabTipBubblePlacement;
}

export const LabTipBubble = forwardRef<HTMLSpanElement, LabTipBubbleProps>(
  ({ placement = "top", className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={[
        "strand-ref-tip__bubble",
        `strand-ref-tip__bubble--${placement}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="tooltip"
      {...rest}
    >
      {children}
    </span>
  ),
);
LabTipBubble.displayName = "LabTipBubble";

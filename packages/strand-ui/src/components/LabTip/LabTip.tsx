/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface LabTipProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  /** Show the bubble without hover or focus. */
  pinned?: boolean;
}

/** A hover-driven tooltip specimen (CSS only; not the Tooltip component). */
export const LabTip = forwardRef<HTMLSpanElement, LabTipProps>(
  ({ pinned = false, className = "", children, ...rest }, ref) => (
    <span ref={ref} className={cx("strand-ref-tip", pinned && "strand-ref-tip--pinned", className)} {...rest}>
      {children}
    </span>
  ),
);
LabTip.displayName = "LabTip";

export type LabTipBubblePlacement = "top" | "bottom" | "left" | "right";

export interface LabTipBubbleProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  /** Side of the trigger the bubble sits on. */
  placement?: LabTipBubblePlacement;
}

/** The bubble of a tip specimen. */
export const LabTipBubble = forwardRef<HTMLSpanElement, LabTipBubbleProps>(
  ({ placement = "top", className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-tip__bubble", `strand-ref-tip__bubble--${placement}`, className)}
      role="tooltip"
      {...rest}
    >
      {children}
    </span>
  ),
);
LabTipBubble.displayName = "LabTipBubble";

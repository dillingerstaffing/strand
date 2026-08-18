/*! Strand UI | MIT License | dillingerstaffing.com */

import { type ComponentChildren, type JSX, type VNode, cloneElement, isValidElement } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useId, useState } from "preact/hooks";
import { cx } from "../../internal/index.js";

export interface TooltipProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, "content"> {
  content: string;
  position?: "top" | "right" | "bottom" | "left";
  /** Milliseconds before showing. */
  delay?: number;
  /** Controlled visibility. */
  open?: boolean;
  /** Visibility to start with when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the next visibility on hover, focus, Escape, and the delay elapsing. */
  onOpenChange?: (open: boolean) => void;
  /** The trigger. A single element receives `aria-describedby`; anything else is described through the wrapper. */
  children?: ComponentChildren;
}

/**
 * Text popup shown on hover or focus of its trigger; Escape dismisses it.
 *
 * @example
 * <Tooltip content="Save your progress"><Button>Save</Button></Tooltip>
 */
export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(
  ({ content, position = "top", delay = 200, open, defaultOpen = false, onOpenChange, className = "", children, ...rest }, ref) => {
    const [intent, setIntent] = useState(defaultOpen);
    const [ownOpen, setOwnOpen] = useState(defaultOpen);
    const isOpen = open ?? ownOpen;
    const id = useId();
    useEffect(() => {
      if (!intent) {
        setOwnOpen(false);
        return;
      }
      const timer = setTimeout(() => setOwnOpen(true), delay);
      return () => clearTimeout(timer);
    }, [intent, delay]);
    useEffect(() => {
      onOpenChange?.(ownOpen);
    }, [ownOpen, onOpenChange]);
    const show = () => setIntent(true);
    const hide = () => setIntent(false);
    const single = isValidElement(children) ? (children as VNode<Record<string, unknown>>) : null;
    const trigger = single ? cloneElement(single, { "aria-describedby": id }) : children;
    return (
      <span
        ref={ref}
        className={cx("strand-tooltip__wrapper", className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(e) => {
          if (e.key === "Escape" && isOpen) hide();
        }}
        aria-describedby={single ? undefined : id}
        {...rest}
      >
        {trigger}
        <span id={id} className={cx("strand-tooltip", `strand-tooltip--${position}`, isOpen && "strand-tooltip--visible")} role="tooltip" aria-hidden={!isOpen}>
          {content}
        </span>
      </span>
    );
  },
);
Tooltip.displayName = "Tooltip";

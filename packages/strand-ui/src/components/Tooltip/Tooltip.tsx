/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useState, useRef, useCallback } from "preact/hooks";

export interface TooltipProps
  extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, "content"> {
  /** Tooltip text */
  content: string;
  /** Position relative to trigger */
  position?: "top" | "right" | "bottom" | "left";
  /** Delay in ms before showing */
  delay?: number;
  /** Tooltip trigger element */
  children?: ComponentChildren;
}

let tooltipIdCounter = 0;

/**
 * Hover/focus-triggered text popup anchored to a trigger element.
 *
 * @example
 * ```tsx
 * import { Tooltip, Button } from '@dillingerstaffing/strand-ui';
 *
 * <Tooltip content="Save your progress" position="top">
 *   <Button variant="primary">Save</Button>
 * </Tooltip>
 * ```
 */
export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(
  (
    {
      content,
      position = "top",
      delay = 200,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const idRef = useRef(`strand-tooltip-${++tooltipIdCounter}`);
    const tooltipId = idRef.current;

    const show = useCallback(() => {
      timerRef.current = setTimeout(() => {
        setVisible(true);
      }, delay);
    }, [delay]);

    const hide = useCallback(() => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setVisible(false);
    }, []);

    const wrapperClasses = ["strand-tooltip__wrapper", className]
      .filter(Boolean)
      .join(" ");

    const tooltipClasses = [
      "strand-tooltip",
      `strand-tooltip--${position}`,
      visible && "strand-tooltip--visible",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        ref={ref}
        className={wrapperClasses}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-describedby={tooltipId}
        {...rest}
      >
        {children}
        <span
          id={tooltipId}
          className={tooltipClasses}
          role="tooltip"
          aria-hidden={!visible}
        >
          {content}
        </span>
      </span>
    );
  },
);

Tooltip.displayName = "Tooltip";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useId, useState } from "preact/hooks";
import { cx } from "../../internal/index.js";

export interface TooltipProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, "content"> {
  content: string;
  position?: "top" | "right" | "bottom" | "left";
  /** Milliseconds before showing. */
  delay?: number;
  /** The trigger. */
  children?: ComponentChildren;
}

/**
 * Text popup shown on hover or focus of its trigger.
 *
 * @example
 * <Tooltip content="Save your progress"><Button>Save</Button></Tooltip>
 */
export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(({ content, position = "top", delay = 200, className = "", children, ...rest }, ref) => {
  const [intent, setIntent] = useState(false);
  const [visible, setVisible] = useState(false);
  const id = useId();
  useEffect(() => {
    if (!intent) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [intent, delay]);
  return (
    <span
      ref={ref}
      className={cx("strand-tooltip__wrapper", className)}
      onMouseEnter={() => setIntent(true)}
      onMouseLeave={() => setIntent(false)}
      onFocus={() => setIntent(true)}
      onBlur={() => setIntent(false)}
      aria-describedby={id}
      {...rest}
    >
      {children}
      <span id={id} className={cx("strand-tooltip", `strand-tooltip--${position}`, visible && "strand-tooltip--visible")} role="tooltip" aria-hidden={!visible}>
        {content}
      </span>
    </span>
  );
});
Tooltip.displayName = "Tooltip";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface DividerProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "label" | "ref"> {
  /** Separator direction. */
  direction?: "horizontal" | "vertical";
  /** `gradient` fades the line out at both ends. */
  variant?: "line" | "gradient";
  /** Content set into the middle of a horizontal line. */
  label?: ComponentChildren;
  className?: string;
}

/**
 * Separator line, horizontal or vertical, optionally labelled.
 *
 * @example
 * <Divider label="OR" />
 */
export const Divider = forwardRef<HTMLElement, DividerProps>(({ direction = "horizontal", variant = "line", label, className = "", ...rest }, ref) => {
  const classes = cx("strand-divider", `strand-divider--${direction}`, variant === "gradient" && "strand-divider--gradient", label && "strand-divider--labeled", className);
  if (direction === "vertical") {
    return <div ref={ref as JSX.HTMLAttributes<HTMLDivElement>["ref"]} role="separator" aria-orientation="vertical" className={classes} {...rest} />;
  }
  if (label) {
    return (
      <div ref={ref as JSX.HTMLAttributes<HTMLDivElement>["ref"]} role="separator" aria-orientation="horizontal" className={classes} {...rest}>
        <span className="strand-divider__line" />
        <span className="strand-divider__label">{label}</span>
        <span className="strand-divider__line" />
      </div>
    );
  }
  return <hr ref={ref as JSX.HTMLAttributes<HTMLHRElement>["ref"]} className={classes} {...rest} />;
});
Divider.displayName = "Divider";

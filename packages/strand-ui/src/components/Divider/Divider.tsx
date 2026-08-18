/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface DividerProps {
  /** Separator direction. */
  direction?: "horizontal" | "vertical";
  /** Text set into the middle of a horizontal line. */
  label?: string;
  className?: string;
}

/**
 * Separator line, horizontal or vertical, optionally labelled.
 *
 * @example
 * <Divider label="OR" />
 */
export const Divider = forwardRef<HTMLElement, DividerProps>(({ direction = "horizontal", label, className = "" }, ref) => {
  if (direction === "vertical") {
    return (
      <div
        ref={ref as JSX.HTMLAttributes<HTMLDivElement>["ref"]}
        role="separator"
        aria-orientation="vertical"
        className={cx("strand-divider", "strand-divider--vertical", className)}
      />
    );
  }
  if (label) {
    return (
      <div
        ref={ref as JSX.HTMLAttributes<HTMLDivElement>["ref"]}
        role="separator"
        aria-orientation="horizontal"
        className={cx("strand-divider", "strand-divider--horizontal", "strand-divider--labeled", className)}
      >
        <span className="strand-divider__line" />
        <span className="strand-divider__label">{label}</span>
        <span className="strand-divider__line" />
      </div>
    );
  }
  return (
    <hr
      ref={ref as JSX.HTMLAttributes<HTMLHRElement>["ref"]}
      role="separator"
      aria-orientation="horizontal"
      className={cx("strand-divider", "strand-divider--horizontal", className)}
    />
  );
});
Divider.displayName = "Divider";

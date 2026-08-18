/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface TagProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children"> {
  variant?: "solid" | "outlined";
  status?: "default" | "teal" | "blue" | "amber" | "red";
  /** Show the remove control. */
  removable?: boolean;
  /** Called when the remove control is pressed. */
  onRemove?: () => void;
  children?: ComponentChildren;
}

/**
 * Compact label for categorisation or status.
 *
 * @example
 * <Tag status="teal" removable onRemove={remove}>Active</Tag>
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ variant = "solid", status = "default", removable = false, onRemove, className = "", children, ...rest }, ref) => (
    <span ref={ref} className={cx("strand-tag", `strand-tag--${variant}`, `strand-tag--${status}`, className)} {...rest}>
      <span className="strand-tag__text">{children}</span>
      {removable && (
        <button type="button" className="strand-tag__remove" aria-label="Remove" onClick={onRemove}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      )}
    </span>
  ),
);
Tag.displayName = "Tag";

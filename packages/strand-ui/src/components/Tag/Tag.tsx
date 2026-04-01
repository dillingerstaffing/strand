/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface TagProps
  extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Visual style variant */
  variant?: "solid" | "outlined";
  /** Color status */
  status?: "default" | "teal" | "blue" | "amber" | "red";
  /** Show remove button */
  removable?: boolean;
  /** Called when remove button is clicked */
  onRemove?: () => void;
  /** Tag text content */
  children?: ComponentChildren;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      variant = "solid",
      status = "default",
      removable = false,
      onRemove,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-tag",
      `strand-tag--${variant}`,
      `strand-tag--${status}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        <span className="strand-tag__text">{children}</span>
        {removable && (
          <button
            type="button"
            className="strand-tag__remove"
            aria-label="Remove"
            onClick={onRemove}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 3l6 6M9 3l-6 6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        )}
      </span>
    );
  },
);

Tag.displayName = "Tag";

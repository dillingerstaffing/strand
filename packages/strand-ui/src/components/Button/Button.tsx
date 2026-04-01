/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface ButtonProps
  extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, "size" | "loading"> {
  /** Visual style variant */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  /** Square button for icon-only use */
  iconOnly?: boolean;
  /** Stretch to full container width */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      iconOnly = false,
      fullWidth = false,
      disabled = false,
      className = "",
      children,
      onClick,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const classes = [
      "strand-btn",
      `strand-btn--${variant}`,
      `strand-btn--${size}`,
      iconOnly && "strand-btn--icon-only",
      fullWidth && "strand-btn--full-width",
      loading && "strand-btn--loading",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={isDisabled}
        aria-disabled={isDisabled ? "true" : undefined}
        aria-busy={loading ? "true" : undefined}
        onClick={isDisabled ? undefined : onClick}
        {...rest}
      >
        {loading && <span className="strand-btn__spinner" aria-hidden="true" />}
        <span
          className="strand-btn__content"
          style={loading ? { visibility: "hidden" } : undefined}
        >
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

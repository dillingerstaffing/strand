/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface ButtonProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, "size" | "loading" | "type" | "ref"> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  /** Shows the spinner and disables interaction. */
  loading?: boolean;
  /** Square, for an icon with an `aria-label`. */
  iconOnly?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  /** Stretch to the container width. */
  fullWidth?: boolean;
  /** Render an anchor styled as a button; inferred when `href` is set. */
  as?: "button" | "a";
  href?: string;
}

/**
 * Primary action trigger.
 *
 * @example
 * <Button variant="primary" size="md" onClick={save}>Save</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", loading = false, iconOnly = false, fullWidth = false, disabled = false, className = "", children, onClick, type = "button", as, href, ...rest },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const classes = cx(
      "strand-btn",
      `strand-btn--${variant}`,
      `strand-btn--${size}`,
      iconOnly && "strand-btn--icon-only",
      fullWidth && "strand-btn--full-width",
      loading && "strand-btn--loading",
      className,
    );
    const inner = (
      <>
        {loading && <span className="strand-btn__spinner" aria-hidden="true" />}
        <span className="strand-btn__content" style={loading ? { visibility: "hidden" } : undefined}>
          {children}
        </span>
      </>
    );
    if (as === "a" || href != null) {
      return (
        <a
          // biome-ignore lint/suspicious/noExplicitAny: anchor and button share one ref prop
          ref={ref as any}
          className={classes}
          href={isDisabled ? undefined : href}
          aria-disabled={isDisabled ? "true" : undefined}
          aria-busy={loading ? "true" : undefined}
          onClick={isDisabled ? undefined : onClick}
          {...rest}
        >
          {inner}
        </a>
      );
    }
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
        {inner}
      </button>
    );
  },
);
Button.displayName = "Button";

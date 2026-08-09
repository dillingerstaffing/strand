/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface ButtonProps
  extends Omit<
    JSX.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>,
    "size" | "loading" | "type" | "ref"
  > {
  /** Visual style variant */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  /** Square button for icon-only use */
  iconOnly?: boolean;
  /** HTML button type */
  type?: "button" | "submit" | "reset";
  /** Disabled state */
  disabled?: boolean;
  /** Stretch to full container width */
  fullWidth?: boolean;
  /**
   * Render as an anchor styled as a button (for links / CTAs). Inferred when
   * `href` is set; a disabled anchor drops its href and is aria-disabled.
   */
  as?: "button" | "a";
  /** Link destination when rendering as an anchor. */
  href?: string;
}

/**
 * Primary action trigger with multiple visual variants and sizes.
 *
 * @example
 * ```tsx
 * import { Button } from '@dillingerstaffing/strand-ui';
 *
 * <Button variant="primary" size="md" onClick={() => {}}>
 *   Submit
 * </Button>
 * ```
 */
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
      as,
      href,
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

    const inner = (
      <>
        {loading && <span className="strand-btn__spinner" aria-hidden="true" />}
        <span
          className="strand-btn__content"
          style={loading ? { visibility: "hidden" } : undefined}
        >
          {children}
        </span>
      </>
    );

    // Anchor mode: a link styled as a button (CTAs, calendar links, downloads).
    // A disabled link is not navigable, so drop href and mark aria-disabled.
    if (as === "a" || href != null) {
      return (
        <a
          // biome-ignore lint/suspicious/noExplicitAny: anchor/button polymorphic ref boundary
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

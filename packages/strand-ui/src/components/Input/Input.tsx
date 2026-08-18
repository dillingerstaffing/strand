/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface InputProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, "size"> {
  type?: "text" | "email" | "password" | "search" | "number";
  /** Error styling and `aria-invalid`. */
  error?: boolean;
  /** Rendered before the field. */
  leadingAddon?: ComponentChildren;
  /** Rendered after the field. */
  trailingAddon?: ComponentChildren;
  disabled?: boolean;
}

/**
 * Text input with optional addons.
 *
 * @example
 * <Input type="email" placeholder="you@example.com" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", error = false, leadingAddon, trailingAddon, className = "", disabled, ...rest }, ref) => (
    <div
      className={cx(
        "strand-input",
        error && "strand-input--error",
        disabled && "strand-input--disabled",
        leadingAddon && "strand-input--has-leading",
        trailingAddon && "strand-input--has-trailing",
        className,
      )}
    >
      {leadingAddon && (
        <span className="strand-input__leading" aria-hidden="true">
          {leadingAddon}
        </span>
      )}
      <input ref={ref} type={type} className="strand-input__field" disabled={disabled} aria-invalid={error ? "true" : undefined} {...rest} />
      {trailingAddon && (
        <span className="strand-input__trailing" aria-hidden="true">
          {trailingAddon}
        </span>
      )}
    </div>
  ),
);
Input.displayName = "Input";

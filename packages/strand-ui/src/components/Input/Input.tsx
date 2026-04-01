/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX, ComponentChildren } from "preact";
import { forwardRef } from "preact/compat";

export interface InputProps
  extends Omit<JSX.HTMLAttributes<HTMLInputElement>, "size"> {
  /** Input type */
  type?: "text" | "email" | "password" | "search" | "number";
  /** Show error styling */
  error?: boolean;
  /** Element rendered before the input */
  leadingAddon?: ComponentChildren;
  /** Element rendered after the input */
  trailingAddon?: ComponentChildren;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      error = false,
      leadingAddon,
      trailingAddon,
      className = "",
      disabled,
      ...rest
    },
    ref,
  ) => {
    const wrapperClasses = [
      "strand-input",
      error && "strand-input--error",
      disabled && "strand-input--disabled",
      leadingAddon && "strand-input--has-leading",
      trailingAddon && "strand-input--has-trailing",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        {leadingAddon && (
          <span className="strand-input__leading" aria-hidden="true">
            {leadingAddon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className="strand-input__field"
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          {...rest}
        />
        {trailingAddon && (
          <span className="strand-input__trailing" aria-hidden="true">
            {trailingAddon}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

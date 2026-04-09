/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren } from "preact";
import { forwardRef } from "preact/compat";

export interface FormFieldProps {
  /** Label text */
  label: string;
  /** Associates the label with a form control */
  htmlFor: string;
  /** Hint text displayed below the input */
  hint?: string;
  /** Error text displayed below the input (replaces hint) */
  error?: string;
  /** Show required indicator */
  required?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** The wrapped form control */
  children: ComponentChildren;
}

/**
 * Form control wrapper providing label, hint text, error messaging, and required indicator.
 *
 * @example
 * ```tsx
 * import { FormField, Input } from '@dillingerstaffing/strand-ui';
 *
 * <FormField label="Email" htmlFor="email" hint="Work email preferred" required>
 *   <Input id="email" type="email" />
 * </FormField>
 * ```
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      htmlFor,
      hint,
      error,
      required = false,
      className = "",
      children,
    },
    ref,
  ) => {
    const classes = [
      "strand-form-field",
      error && "strand-form-field--error",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const messageId = error
      ? `${htmlFor}-error`
      : hint
        ? `${htmlFor}-hint`
        : undefined;

    return (
      <div ref={ref} className={classes}>
        <label className="strand-form-field__label" htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="strand-form-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <div className="strand-form-field__control">{children}</div>
        {error ? (
          <p
            className="strand-form-field__error"
            id={`${htmlFor}-error`}
            role="alert"
          >
            {error}
          </p>
        ) : hint ? (
          <p className="strand-form-field__hint" id={`${htmlFor}-hint`}>
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

FormField.displayName = "FormField";

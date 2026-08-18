/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, VNode } from "preact";
import { cloneElement, isValidElement, toChildArray } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

/** The single wrapped control, described by whichever message is showing (cf: formfield-describedby). */
export function describeControl(children: ComponentChildren, messageId: string | undefined): ComponentChildren {
  if (!messageId) return children;
  const only = toChildArray(children);
  if (only.length !== 1) return children;
  const child = only[0];
  if (!isValidElement(child)) return children;
  const existing = (child as VNode<Record<string, unknown>>).props?.["aria-describedby"];
  return cloneElement(child as VNode<Record<string, unknown>>, {
    "aria-describedby": existing ? `${existing} ${messageId}` : messageId,
  });
}

export interface FormFieldProps {
  label: string;
  /** The control's id. */
  htmlFor: string;
  hint?: string;
  /** Replaces the hint; announced assertively. */
  error?: string;
  /** A checked-and-good value; replaces the hint, yields to `error`; announced politely. */
  success?: string;
  required?: boolean;
  className?: string;
  /** The wrapped form control. */
  children: ComponentChildren;
}

/**
 * Label, one message slot (error over success over hint) and the control they describe.
 *
 * @example
 * <FormField label="Email" htmlFor="email" hint="Work email" required><Input id="email" type="email" /></FormField>
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, htmlFor, hint, error, success, required = false, className = "", children }, ref) => {
    const messageId = error ? `${htmlFor}-error` : success ? `${htmlFor}-success` : hint ? `${htmlFor}-hint` : undefined;
    return (
      <div ref={ref} className={cx("strand-form-field", error && "strand-form-field--error", !error && success && "strand-form-field--success", className)}>
        <label className="strand-form-field__label" htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="strand-form-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <div className="strand-form-field__control">{describeControl(children, messageId)}</div>
        {error ? (
          <p className="strand-form-field__error" id={`${htmlFor}-error`} role="alert">
            {error}
          </p>
        ) : success ? (
          <p className="strand-form-field__success" id={`${htmlFor}-success`} role="status">
            {success}
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

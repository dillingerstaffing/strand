/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, VNode } from "preact";
import { cloneElement, isValidElement, toChildArray } from "preact";
import { forwardRef } from "preact/compat";

/**
 * Hand the wrapped control the id of whichever message is showing.
 *
 * DECLARATIVE, not a DOM write. The obvious implementation is a layout effect
 * that finds the control and calls setAttribute, and it is wrong here: Preact
 * owns this subtree, the control re-renders on every keystroke, and an
 * attribute the renderer did not set survives only by the grace of how diffing
 * happens to work. Describing the child in the returned tree means Preact
 * applies it as part of the same commit that renders the message, so the two
 * can never be out of step.
 *
 * The field's contract is ONE control ("The wrapped form control"), so a
 * fragment or a list is passed through untouched rather than guessed at.
 *
 * A caller's own `aria-describedby` is preserved and this id is appended, so
 * describing an input with an extra node keeps working.
 */
export function describeControl(
  children: ComponentChildren,
  messageId: string | undefined,
): ComponentChildren {
  if (!messageId) return children;
  const only = toChildArray(children);
  if (only.length !== 1) return children;
  const child = only[0];
  if (!isValidElement(child)) return children;
  const existing = (child as VNode<Record<string, unknown>>).props?.[
    "aria-describedby"
  ];
  return cloneElement(child as VNode<Record<string, unknown>>, {
    "aria-describedby": existing ? `${existing} ${messageId}` : messageId,
  });
}

export interface FormFieldProps {
  /** Label text */
  label: string;
  /** Associates the label with a form control */
  htmlFor: string;
  /** Hint text displayed below the input */
  hint?: string;
  /** Error text displayed below the input (replaces hint) */
  error?: string;
  /**
   * Confirmation text displayed below the input (replaces hint, yields to error).
   *
   * The third message state, for a field whose value has been CHECKED and
   * found good: an available username, a verified address, a valid coupon.
   *
   * It is announced POLITELY where `error` is assertive, and that asymmetry is
   * the point rather than an inconsistency. Success arrives while the member
   * is still typing, often on every debounce tick, so an assertive region
   * would interrupt a screen reader mid-word to deliver good news. An error is
   * the one message a member cannot afford to miss.
   */
  success?: string;
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
      success,
      required = false,
      className = "",
      children,
    },
    ref,
  ) => {
    const classes = [
      "strand-form-field",
      error && "strand-form-field--error",
      !error && success && "strand-form-field--success",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const messageId = error
      ? `${htmlFor}-error`
      : success
        ? `${htmlFor}-success`
        : hint
          ? `${htmlFor}-hint`
          : undefined;

    // This id was computed and thrown away for as long as the component has
    // existed, so every hint and every error rendered here was invisible to a
    // screen reader on focus: present in the DOM, announced by nothing, and
    // pointed at by no control. The message elements carried ids that had no
    // referent. The control is described in the same commit that renders the
    // message, so the two cannot disagree.
    const describedChildren = describeControl(children, messageId);

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
        <div className="strand-form-field__control">{describedChildren}</div>
        {/* ONE message slot, precedence error > success > hint. A field
            showing "that name is taken" above "Available." argues with
            itself, and exclusivity here is the only way to guarantee no
            call site can produce that pair. */}
        {error ? (
          <p
            className="strand-form-field__error"
            id={`${htmlFor}-error`}
            role="alert"
          >
            {error}
          </p>
        ) : success ? (
          <p
            className="strand-form-field__success"
            id={`${htmlFor}-success`}
            role="status"
          >
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

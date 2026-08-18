/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface CheckboxProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, "checked" | "onChange" | "label" | "type" | "role"> {
  /** Controlled state; leave unset to let the input own it. */
  checked?: boolean;
  /** Initial state of an uncontrolled checkbox. */
  defaultChecked?: boolean;
  /** Mixed state; the DOM property, so :indeterminate paints and announces it. */
  indeterminate?: boolean;
  onChange?: (e: Event) => void;
  disabled?: boolean;
  label?: string;
  /** `compact` drops the row to 30px on a fine pointer only (DL 14.7). */
  density?: "comfortable" | "compact";
  className?: string;
}

/**
 * Toggle for a boolean or mixed selection; the native input carries the state and the sheet reads it.
 *
 * @example
 * <Checkbox checked={agreed} onChange={() => setAgreed((a) => !a)} label="Accept terms" />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, defaultChecked, indeterminate = false, onChange, disabled = false, label, density = "comfortable", className = "", ...rest }, ref) => (
    <label className={cx("strand-checkbox", density === "compact" && "strand-checkbox--compact", className)}>
      <input
        ref={ref}
        type="checkbox"
        className="strand-checkbox__native strand-sr-only"
        checked={checked}
        defaultChecked={defaultChecked}
        indeterminate={indeterminate}
        disabled={disabled}
        onChange={disabled ? undefined : onChange}
        {...rest}
      />
      <span className="strand-checkbox__control" aria-hidden="true">
        <svg className="strand-checkbox__icon strand-checkbox__icon--check" viewBox="0 0 16 16" fill="none">
          <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg className="strand-checkbox__icon strand-checkbox__icon--mixed" viewBox="0 0 16 16" fill="none">
          <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </span>
      {label && <span className="strand-checkbox__label">{label}</span>}
    </label>
  ),
);
Checkbox.displayName = "Checkbox";

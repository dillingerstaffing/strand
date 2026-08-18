/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface CheckboxProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, "checked" | "onChange" | "label" | "type" | "role"> {
  checked?: boolean;
  /** Mixed state; announced as `aria-checked="mixed"`. */
  indeterminate?: boolean;
  onChange?: (e: Event) => void;
  disabled?: boolean;
  label?: string;
  /** `compact` drops the row to 30px on a fine pointer only (DL 14.7). */
  density?: "comfortable" | "compact";
  className?: string;
}

/**
 * Toggle for a boolean or mixed selection.
 *
 * @example
 * <Checkbox checked={agreed} onChange={() => setAgreed((a) => !a)} label="Accept terms" />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked = false, indeterminate = false, onChange, disabled = false, label, density = "comfortable", className = "", ...rest }, ref) => (
    <label
      className={cx(
        "strand-checkbox",
        density === "compact" && "strand-checkbox--compact",
        checked && "strand-checkbox--checked",
        indeterminate && "strand-checkbox--indeterminate",
        disabled && "strand-checkbox--disabled",
        className,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        className="strand-checkbox__native"
        checked={checked}
        // A DOM property with no attribute; Preact assigns it directly.
        {...({ indeterminate } as Record<string, unknown>)}
        disabled={disabled}
        onChange={disabled ? undefined : onChange}
        aria-checked={indeterminate ? "mixed" : checked ? "true" : "false"}
        role="checkbox"
        {...rest}
      />
      <span className="strand-checkbox__control" aria-hidden="true">
        {indeterminate ? (
          <svg className="strand-checkbox__icon" viewBox="0 0 16 16" fill="none">
            <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        ) : checked ? (
          <svg className="strand-checkbox__icon" viewBox="0 0 16 16" fill="none">
            <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        ) : null}
      </span>
      {label && <span className="strand-checkbox__label">{label}</span>}
    </label>
  ),
);
Checkbox.displayName = "Checkbox";

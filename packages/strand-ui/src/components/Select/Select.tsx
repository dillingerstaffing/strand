/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<JSX.HTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: SelectOption[];
  disabled?: boolean;
  value?: string;
  onChange?: (e: JSX.TargetedEvent<HTMLSelectElement>) => void;
  /** Error styling and `aria-invalid`. */
  error?: boolean;
  /** Disabled first option shown until a value is chosen. */
  placeholder?: string;
}

/**
 * Native select with a styled wrapper.
 *
 * @example
 * <Select placeholder="Choose a role" options={[{ value: "eng", label: "Engineer" }]} value={role} onChange={(e) => setRole(e.currentTarget.value)} />
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, value, onChange, disabled, error = false, placeholder, className = "", ...rest }, ref) => (
    <div className={cx("strand-select", error && "strand-select--error", disabled && "strand-select--disabled", className)}>
      <select ref={ref} className="strand-select__field" value={value} onChange={onChange} disabled={disabled} aria-invalid={error ? "true" : undefined} {...rest}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="strand-select__arrow" aria-hidden="true" />
    </div>
  ),
);
Select.displayName = "Select";

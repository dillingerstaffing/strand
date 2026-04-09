/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<JSX.HTMLAttributes<HTMLSelectElement>, "onChange"> {
  /** Array of options to display */
  options: SelectOption[];
  /** Disabled state */
  disabled?: boolean;
  /** Currently selected value */
  value?: string;
  /** Change handler */
  onChange?: (e: JSX.TargetedEvent<HTMLSelectElement>) => void;
  /** Show error styling */
  error?: boolean;
  /** Placeholder text shown as first disabled option */
  placeholder?: string;
}

/**
 * Native select dropdown with styled wrapper, error state, and placeholder support.
 *
 * @example
 * ```tsx
 * import { Select } from '@dillingerstaffing/strand-ui';
 *
 * <Select
 *   placeholder="Choose a role"
 *   options={[
 *     { value: 'eng', label: 'Engineer' },
 *     { value: 'design', label: 'Designer' },
 *   ]}
 *   value="eng"
 *   onChange={(e) => console.log(e.currentTarget.value)}
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      disabled,
      error = false,
      placeholder,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const wrapperClasses = [
      "strand-select",
      error && "strand-select--error",
      disabled && "strand-select--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        <select
          ref={ref}
          className="strand-select__field"
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          {...rest}
        >
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
    );
  },
);

Select.displayName = "Select";

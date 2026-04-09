/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useRef, useEffect } from "preact/hooks";

export interface CheckboxProps
  extends Omit<
    JSX.HTMLAttributes<HTMLInputElement>,
    "checked" | "onChange" | "label" | "type" | "role"
  > {
  /** Controlled checked state */
  checked?: boolean;
  /** Indeterminate visual state */
  indeterminate?: boolean;
  /** Change handler */
  onChange?: (e: Event) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Label text */
  label?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * Toggle control for boolean or indeterminate selections with optional label.
 *
 * @example
 * ```tsx
 * import { Checkbox } from '@dillingerstaffing/strand-ui';
 *
 * <Checkbox
 *   checked={true}
 *   onChange={(e) => console.log(e)}
 *   label="Accept terms"
 * />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked = false,
      indeterminate = false,
      onChange,
      disabled = false,
      label,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const el =
        typeof ref === "function"
          ? internalRef.current
          : ref?.current ?? internalRef.current;
      if (el) {
        el.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    const classes = [
      "strand-checkbox",
      checked && "strand-checkbox--checked",
      indeterminate && "strand-checkbox--indeterminate",
      disabled && "strand-checkbox--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const ariaChecked = indeterminate ? "mixed" : checked ? "true" : "false";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " && !disabled) {
        e.preventDefault();
        const input = internalRef.current;
        if (input) {
          input.click();
        }
      }
    };

    const setRefs = (el: HTMLInputElement | null) => {
      (internalRef as { current: HTMLInputElement | null }).current = el;
      if (typeof ref === "function") {
        ref(el);
      } else if (ref) {
        (ref as { current: HTMLInputElement | null }).current = el;
      }
    };

    return (
      <label
        className={classes}
        onKeyDown={handleKeyDown}
      >
        <input
          ref={setRefs}
          type="checkbox"
          className="strand-checkbox__native"
          checked={checked}
          disabled={disabled}
          onChange={disabled ? undefined : onChange}
          aria-checked={ariaChecked}
          role="checkbox"
          {...rest}
        />
        <span className="strand-checkbox__control" aria-hidden="true">
          {indeterminate ? (
            <svg
              className="strand-checkbox__icon"
              viewBox="0 0 16 16"
              fill="none"
            >
              <line
                x1="4"
                y1="8"
                x2="12"
                y2="8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          ) : checked ? (
            <svg
              className="strand-checkbox__icon"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3.5 8L6.5 11L12.5 5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ) : null}
        </span>
        {label && <span className="strand-checkbox__label">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

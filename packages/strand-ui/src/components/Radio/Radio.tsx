/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface RadioProps
  extends Omit<
    JSX.HTMLAttributes<HTMLInputElement>,
    "checked" | "onChange" | "label" | "type"
  > {
  /** Controlled checked state */
  checked?: boolean;
  /** Change handler */
  onChange?: (e: Event) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Label text */
  label?: string;
  /** Radio group name */
  name?: string;
  /** Radio value */
  value?: string;
  /** Additional CSS class */
  className?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked = false,
      onChange,
      disabled = false,
      label,
      name,
      value,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-radio",
      checked && "strand-radio--checked",
      disabled && "strand-radio--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label className={classes}>
        <input
          ref={ref}
          type="radio"
          className="strand-radio__native"
          checked={checked}
          disabled={disabled}
          onChange={disabled ? undefined : onChange}
          name={name}
          value={value}
          {...rest}
        />
        <span className="strand-radio__control" aria-hidden="true">
          <span className="strand-radio__dot" />
        </span>
        {label && <span className="strand-radio__label">{label}</span>}
      </label>
    );
  },
);

Radio.displayName = "Radio";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface RadioProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, "checked" | "onChange" | "label" | "type"> {
  /** Controlled state; leave unset to let the input own it. */
  checked?: boolean;
  /** Initial state of an uncontrolled radio. */
  defaultChecked?: boolean;
  onChange?: (e: Event) => void;
  disabled?: boolean;
  label?: string;
  name?: string;
  value?: string;
  /** `compact` drops the row to 30px on a fine pointer only (DL 14.7). */
  density?: "comfortable" | "compact";
  className?: string;
}

/**
 * Single-selection control for a radio group; the native input carries the state and the sheet reads it.
 *
 * @example
 * <Radio name="plan" value="pro" label="Pro" checked={plan === "pro"} onChange={() => setPlan("pro")} />
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ checked, defaultChecked, onChange, disabled = false, label, name, value, density = "comfortable", className = "", ...rest }, ref) => (
    <label className={cx("strand-radio", density === "compact" && "strand-radio--compact", className)}>
      <input
        ref={ref}
        type="radio"
        className="strand-radio__native"
        checked={checked}
        defaultChecked={defaultChecked}
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
  ),
);
Radio.displayName = "Radio";

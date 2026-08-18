/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface RadioProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, "checked" | "onChange" | "label" | "type"> {
  checked?: boolean;
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
 * Single-selection control for a radio group.
 *
 * @example
 * <Radio name="plan" value="pro" label="Pro" checked={plan === "pro"} onChange={() => setPlan("pro")} />
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ checked = false, onChange, disabled = false, label, name, value, density = "comfortable", className = "", ...rest }, ref) => (
    <label
      className={cx(
        "strand-radio",
        density === "compact" && "strand-radio--compact",
        checked && "strand-radio--checked",
        disabled && "strand-radio--disabled",
        className,
      )}
    >
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
  ),
);
Radio.displayName = "Radio";

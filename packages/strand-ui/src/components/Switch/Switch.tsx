/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useState } from "preact/hooks";
import { cx } from "../../internal/index.js";

export interface SwitchProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, "checked" | "onChange" | "label" | "type" | "role"> {
  /** Controlled state; leave unset to let the switch own it. */
  checked?: boolean;
  /** Initial state of an uncontrolled switch. */
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  /** `compact` drops the row to 30px on a fine pointer only (DL 14.7). */
  density?: "comfortable" | "compact";
  className?: string;
}

/**
 * Binary toggle; aria-checked carries the state and the sheet reads it.
 *
 * @example
 * <Switch checked={dark} onChange={setDark} label="Dark mode" />
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, defaultChecked = false, onChange, disabled = false, label, density = "comfortable", className = "", ...rest }, ref) => {
    const [ownChecked, setOwnChecked] = useState(defaultChecked);
    const isOn = checked ?? ownChecked;
    const toggle = () => {
      if (checked === undefined) setOwnChecked(!isOn);
      onChange?.(!isOn);
    };
    return (
      <label className={cx("strand-switch", density === "compact" && "strand-switch--compact", className)}>
        <button ref={ref} type="button" role="switch" className="strand-switch__track" aria-checked={isOn ? "true" : "false"} disabled={disabled} onClick={disabled ? undefined : toggle} {...rest}>
          <span className="strand-switch__thumb" aria-hidden="true" />
        </button>
        {label && <span className="strand-switch__label">{label}</span>}
      </label>
    );
  },
);
Switch.displayName = "Switch";

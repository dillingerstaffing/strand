/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface SwitchProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, "checked" | "onChange" | "label" | "type" | "role"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  /** `compact` drops the row to 30px on a fine pointer only (DL 14.7). */
  density?: "comfortable" | "compact";
  className?: string;
}

/**
 * Binary toggle.
 *
 * @example
 * <Switch checked={dark} onChange={setDark} label="Dark mode" />
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onChange, disabled = false, label, density = "comfortable", className = "", ...rest }, ref) => (
    <label
      className={cx(
        "strand-switch",
        density === "compact" && "strand-switch--compact",
        checked && "strand-switch--checked",
        disabled && "strand-switch--disabled",
        className,
      )}
    >
      <button
        ref={ref}
        type="button"
        role="switch"
        className="strand-switch__track"
        aria-checked={checked ? "true" : "false"}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        {...rest}
      >
        <span className="strand-switch__thumb" aria-hidden="true" />
      </button>
      {label && <span className="strand-switch__label">{label}</span>}
    </label>
  ),
);
Switch.displayName = "Switch";

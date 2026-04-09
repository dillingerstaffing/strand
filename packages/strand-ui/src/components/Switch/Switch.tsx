/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface SwitchProps
  extends Omit<
    JSX.HTMLAttributes<HTMLButtonElement>,
    "checked" | "onChange" | "label" | "type" | "role"
  > {
  /** Controlled checked state */
  checked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Inline label text */
  label?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * Toggle switch for binary on/off settings with optional inline label.
 *
 * @example
 * ```tsx
 * import { Switch } from '@dillingerstaffing/strand-ui';
 *
 * <Switch checked={true} onChange={(val) => console.log(val)} label="Dark mode" />
 * ```
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked = false,
      onChange,
      disabled = false,
      label,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-switch",
      checked && "strand-switch--checked",
      disabled && "strand-switch--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleClick = () => {
      if (!disabled && onChange) {
        onChange(!checked);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && !disabled) {
        e.preventDefault();
        if (onChange) {
          onChange(!checked);
        }
      }
    };

    return (
      <label className={classes}>
        <button
          ref={ref}
          type="button"
          role="switch"
          className="strand-switch__track"
          aria-checked={checked ? "true" : "false"}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          <span className="strand-switch__thumb" aria-hidden="true" />
        </button>
        {label && <span className="strand-switch__label">{label}</span>}
      </label>
    );
  },
);

Switch.displayName = "Switch";

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
  /**
   * Row density. `comfortable` is the default and is unchanged.
   *
   * `compact` drops the row's floor to 30px ON A FINE POINTER ONLY. DL 14.7
   * makes the floor a property of the input modality (coarse 44, fine 24), and
   * says in as many words that a rule which shrinks a control "must be written
   * inside `@media (pointer: fine)` so that touch is untouched by construction
   * rather than by care". Touch keeps 44 here whatever this prop says.
   *
   * OPT-IN, and that is 14.7 too: "44px remains the default everywhere ... no
   * component changes size by inheriting this clause". Reach for it where
   * density is the point and the region is pointer-driven, which is the filter
   * rail this was written for. Do not reach for it to tidy a form.
   */
  density?: "comfortable" | "compact";
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
      density = "comfortable",
      className = "",
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-switch",
      density === "compact" && "strand-switch--compact",
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

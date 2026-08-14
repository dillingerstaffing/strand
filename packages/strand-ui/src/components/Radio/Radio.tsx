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
 * Single-selection control for use within a radio group.
 *
 * @example
 * ```tsx
 * import { Radio } from '@dillingerstaffing/strand-ui';
 *
 * <Radio name="plan" value="pro" label="Pro" checked={true} onChange={() => {}} />
 * <Radio name="plan" value="free" label="Free" onChange={() => {}} />
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked = false,
      onChange,
      disabled = false,
      label,
      name,
      value,
      density = "comfortable",
      className = "",
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-radio",
      density === "compact" && "strand-radio--compact",
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

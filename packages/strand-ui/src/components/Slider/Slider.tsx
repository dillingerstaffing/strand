/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface SliderProps
  extends Omit<JSX.HTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Current value */
  value?: number;
  /** Change handler */
  onChange?: (e: JSX.TargetedEvent<HTMLInputElement>) => void;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Range input control for selecting a numeric value within a bounded interval.
 *
 * @example
 * ```tsx
 * import { Slider } from '@dillingerstaffing/strand-ui';
 *
 * <Slider min={0} max={100} step={5} value={50} onChange={(e) => {}} />
 * ```
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value,
      onChange,
      disabled,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const wrapperClasses = [
      "strand-slider",
      disabled && "strand-slider--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        <input
          ref={ref}
          type="range"
          className="strand-slider__field"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          {...rest}
        />
      </div>
    );
  },
);

Slider.displayName = "Slider";

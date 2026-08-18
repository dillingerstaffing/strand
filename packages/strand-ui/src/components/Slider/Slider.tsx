/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface SliderProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (e: JSX.TargetedEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

/**
 * Range input.
 *
 * @example
 * <Slider min={0} max={100} step={5} value={50} onChange={(e) => set(Number(e.currentTarget.value))} />
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(({ min = 0, max = 100, step = 1, value, onChange, disabled, className = "", ...rest }, ref) => (
  <div className={cx("strand-slider", disabled && "strand-slider--disabled", className)}>
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
));
Slider.displayName = "Slider";

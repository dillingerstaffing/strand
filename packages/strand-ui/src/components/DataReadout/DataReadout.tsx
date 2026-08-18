/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface DataReadoutProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "label"> {
  /** Overline label. */
  label: string;
  /** The value shown large. */
  value: string | number;
  /** Size rung (DL 11.2.1). */
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Instrument readout: an overline label above a prominent value.
 *
 * @example
 * <DataReadout label="Conversion" value="94%" size="lg" />
 */
export const DataReadout = forwardRef<HTMLDivElement, DataReadoutProps>(
  ({ label, value, size, className = "", ...rest }, ref) => (
    <div ref={ref} className={cx("strand-data-readout", size && size !== "md" && `strand-data-readout--${size}`, className)} {...rest}>
      <span className="strand-data-readout__label">{label}</span>
      <span className="strand-data-readout__value">{value}</span>
    </div>
  ),
);
DataReadout.displayName = "DataReadout";

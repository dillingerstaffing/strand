/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface DataReadoutProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "label"> {
  /** Overline label text */
  label: string;
  /** The large displayed value */
  value: string | number;
  /** Size variant: sm (compact), md (default), lg (hero), xl (primary instrument) */
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Instrument-panel metric display with overline label and prominent value.
 *
 * @example
 * ```tsx
 * import { DataReadout } from '@dillingerstaffing/strand-ui';
 *
 * <DataReadout label="Conversion Rate" value="94%" size="lg" />
 * ```
 */
export const DataReadout = forwardRef<HTMLDivElement, DataReadoutProps>(
  ({ label, value, size, className = "", ...rest }, ref) => {
    const classes = [
      "strand-data-readout",
      size && size !== "md" ? `strand-data-readout--${size}` : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <span className="strand-data-readout__label">{label}</span>
        <span className="strand-data-readout__value">{value}</span>
      </div>
    );
  },
);

DataReadout.displayName = "DataReadout";

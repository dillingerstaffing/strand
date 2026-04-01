/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface DataReadoutProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "label"> {
  /** Overline label text */
  label: string;
  /** The large displayed value */
  value: string | number;
}

export const DataReadout = forwardRef<HTMLDivElement, DataReadoutProps>(
  ({ label, value, className = "", ...rest }, ref) => {
    const classes = ["strand-data-readout", className]
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

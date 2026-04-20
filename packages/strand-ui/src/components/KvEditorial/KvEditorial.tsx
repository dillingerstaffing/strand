/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface KvEditorialProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "label" | "value"> {
  /** Label column content (mono, uppercase, left) */
  label: ComponentChildren;
  /** Value column content (sans, blue-midnight, right) */
  value: ComponentChildren;
  /** When true, applies --status color (teal-vital) to the value */
  status?: boolean;
}

/**
 * Card-metadata key-value row. Editorial sibling of the default
 * instrument `strand-kv` readout. Use inside CardSection bodies to
 * produce soft sans-serif Blue-midnight values separated by a
 * dashed divider.
 *
 * The default `strand-kv` (mono, gray-700, tabular-nums) remains
 * the instrument-readout choice -- use it inside InstrumentViewport
 * for numeric data that should read as cabinet instrumentation.
 *
 * @example
 * ```tsx
 * import { KvEditorial } from '@dillingerstaffing/strand-ui';
 *
 * <KvEditorial label="Status" value="Live" status />
 * <KvEditorial label="Owner" value="Dillinger Staffing" />
 * ```
 */
export const KvEditorial = forwardRef<HTMLDivElement, KvEditorialProps>(
  ({ label, value, status = false, className = "", ...rest }, ref) => {
    const classes = ["strand-kv", "strand-kv--editorial", className]
      .filter(Boolean)
      .join(" ");

    const valueClasses = [
      "strand-kv__value",
      status && "strand-kv__value--status",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <span className="strand-kv__label">{label}</span>
        <span className={valueClasses}>{value}</span>
      </div>
    );
  },
);

KvEditorial.displayName = "KvEditorial";

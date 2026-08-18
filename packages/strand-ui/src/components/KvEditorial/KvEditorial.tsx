/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface KvEditorialProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "label" | "value"> {
  /** Label column, mono uppercase. */
  label: ComponentChildren;
  /** Value column, sans. */
  value: ComponentChildren;
  /** Tint the value as a status. */
  status?: boolean;
}

/**
 * Editorial key-value row for card metadata.
 *
 * @example
 * <KvEditorial label="Status" value="Live" status />
 */
export const KvEditorial = forwardRef<HTMLDivElement, KvEditorialProps>(
  ({ label, value, status = false, className = "", ...rest }, ref) => (
    <div ref={ref} className={cx("strand-kv", "strand-kv--editorial", className)} {...rest}>
      <span className="strand-kv__label">{label}</span>
      <span className={cx("strand-kv__value", status && "strand-kv__value--status")}>{value}</span>
    </div>
  ),
);
KvEditorial.displayName = "KvEditorial";

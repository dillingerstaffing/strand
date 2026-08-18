/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface ReserveProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "placeholder"> {
  /** The content has arrived. */
  ready?: boolean;
  /** The answer arrived and there is nothing to show; collapses the region and wins over `ready`. */
  empty?: boolean;
  /** Shown while waiting, usually `Skeleton`s. */
  placeholder?: ComponentChildren;
  /** Reserved minimum height at the base breakpoint. */
  height?: string;
  /** From 768px up; falls back to `height`. */
  heightMd?: string;
  /** From 1024px up; falls back to `heightMd`. */
  heightLg?: string;
}

/**
 * Holds its box while data loads, then cross-fades placeholder to content (DL 6.6.1, 6.6.2).
 *
 * @example
 * <Reserve ready={!!rows} empty={settled && !rows?.length} placeholder={<Skeleton />}>{rows && <Rows data={rows} />}</Reserve>
 */
export const Reserve = forwardRef<HTMLDivElement, ReserveProps>(
  ({ ready = false, empty = false, placeholder, height, heightMd, heightLg, className = "", children, style, ...rest }, ref) => {
    const vars: Record<string, string> = {};
    if (height) vars["--strand-reserve-h"] = height;
    if (heightMd) vars["--strand-reserve-h-md"] = heightMd;
    if (heightLg) vars["--strand-reserve-h-lg"] = heightLg;
    return (
      <div
        ref={ref}
        className={cx("strand-reserve", className)}
        data-strand-reserve={empty ? "empty" : ready ? "ready" : "pending"}
        style={{ ...vars, ...(style as object) }}
        {...rest}
      >
        <div className="strand-reserve__placeholder" aria-hidden="true">
          {placeholder}
        </div>
        <div className="strand-reserve__content">{children}</div>
      </div>
    );
  },
);
Reserve.displayName = "Reserve";

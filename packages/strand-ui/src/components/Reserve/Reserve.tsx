/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface ReserveProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "placeholder"> {
  /** Whether the real content has arrived. Drives the cross-fade. */
  ready?: boolean;
  /** What to show while waiting. Usually one or more `Skeleton`s. */
  placeholder?: ComponentChildren;
  /** Reserved minimum height, base breakpoint. Any CSS length. */
  height?: string;
  /** Reserved minimum height from 768px up. Falls back to `height`. */
  heightMd?: string;
  /** Reserved minimum height from 1024px up. Falls back to `heightMd`. */
  heightLg?: string;
}

/**
 * A region that holds its box while data loads, then cross-fades the
 * placeholder to the content.
 *
 * Implements design-language.md 6.6.1 (the space contract) and 6.6.2
 * (placeholder to content). This is a thin wrapper over the
 * `.strand-reserve` classes; the CSS is the primitive, and a vanilla-HTML
 * consumer flipping `data-strand-reserve` by hand gets identical behaviour.
 *
 * Sizing: if the placeholder already matches the shape of the content, the
 * region sizes itself and you need no height at all. Supply `height` only
 * when the placeholder is genuinely smaller than what replaces it.
 *
 * @example
 * ```tsx
 * import { Reserve, Skeleton } from '@dillingerstaffing/strand-ui';
 *
 * <Reserve ready={!!event} placeholder={<Skeleton variant="rectangle" height="42px" />}>
 *   {event ? <JoinLive event={event} /> : null}
 * </Reserve>
 *
 * // Taller reservation on wider screens
 * <Reserve ready={!!rows} height="180px" heightMd="120px" placeholder={<Rows.Skeleton />}>
 *   <Rows data={rows} />
 * </Reserve>
 * ```
 */
export const Reserve = forwardRef<HTMLDivElement, ReserveProps>(
  (
    {
      ready = false,
      placeholder,
      height,
      heightMd,
      heightLg,
      className = "",
      children,
      style,
      ...rest
    },
    ref,
  ) => {
    const classes = ["strand-reserve", className].filter(Boolean).join(" ");

    // Custom properties are the only per-instance values, so they ride on
    // style. Undefined keys are dropped rather than emitted empty, which
    // keeps the attribute absent entirely when no height is supplied.
    const vars: Record<string, string> = {};
    if (height) vars["--strand-reserve-h"] = height;
    if (heightMd) vars["--strand-reserve-h-md"] = heightMd;
    if (heightLg) vars["--strand-reserve-h-lg"] = heightLg;

    return (
      <div
        ref={ref}
        className={classes}
        data-strand-reserve={ready ? "ready" : "pending"}
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

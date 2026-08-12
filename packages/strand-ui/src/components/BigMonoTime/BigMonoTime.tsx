/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface BigMonoTimeProps
  extends Omit<JSX.HTMLAttributes<HTMLElement>, "start" | "size"> {
  /** The time, or the start of a range. Pre-formatted: "06:45". */
  value: string;
  /** End of a range. Omit for a single time. */
  until?: string;
  /** Separator between the two. */
  separator?: string;
  size?: "sm" | "md" | "lg";
  /**
   * Machine-readable value for `<time datetime>`, e.g. "2026-08-13T06:45".
   * Supplied means the element renders as `<time>`, which is what lets a
   * reader's tooling understand it as an instant rather than a string.
   */
  dateTime?: string;
  className?: string;
}

/**
 * An oversized monospace clock readout.
 *
 * The largest element in the rail it sits in, so its figure alignment
 * matters more than its size: `tabular-nums` is why `06:45` and `11:11`
 * are the same width and a column of times does not ripple.
 *
 * Not `DataReadout`, which pairs a label with a value and renders them as
 * a unit. This is the value alone at display scale; the rail supplies the
 * context.
 *
 * @example
 * ```tsx
 * <BigMonoTime value="06:45" dateTime="2026-08-13T06:45" />
 * <BigMonoTime value="06:45" until="08:30" size="lg" />
 * ```
 */
export const BigMonoTime = forwardRef<HTMLElement, BigMonoTimeProps>(
  (
    {
      value,
      until,
      separator = "–",
      size = "md",
      dateTime,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-big-mono-time",
      size !== "md" ? `strand-big-mono-time--${size}` : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const body = until ? (
      <>
        {value}
        {/* aria-hidden so a screen reader hears "06:45 to 08:30" from the
            label the rail supplies, rather than a dash read as
            punctuation in the middle of a time. */}
        <span class="strand-big-mono-time__sep" aria-hidden="true">
          {separator}
        </span>
        {until}
      </>
    ) : (
      value
    );

    // <time> when there is a machine-readable value to carry, <span>
    // otherwise. Emitting <time> without datetime would assert a
    // machine-readable instant that is not there.
    //
    // Two branches rather than a computed tag: `dateTime` is valid on
    // <time> and not on <span>, so no single element type accepts both
    // prop sets and a computed tag has to be cast past the checker.
    return dateTime ? (
      <time
        ref={ref as unknown as JSX.HTMLAttributes<HTMLTimeElement>["ref"]}
        class={classes}
        dateTime={dateTime}
        {...(rest as JSX.HTMLAttributes<HTMLTimeElement>)}
      >
        {body}
      </time>
    ) : (
      <span
        ref={ref as unknown as JSX.HTMLAttributes<HTMLSpanElement>["ref"]}
        class={classes}
        {...(rest as JSX.HTMLAttributes<HTMLSpanElement>)}
      >
        {body}
      </span>
    );
  },
);
BigMonoTime.displayName = "BigMonoTime";

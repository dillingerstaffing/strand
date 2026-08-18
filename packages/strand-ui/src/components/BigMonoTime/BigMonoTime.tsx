/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface BigMonoTimeProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "start" | "size"> {
  /** The time, pre-formatted ("06:45"), or the start of a range. */
  value: string;
  /** End of a range. */
  until?: string;
  /** Separator between the two. */
  separator?: string;
  size?: "sm" | "md" | "lg";
  /** Machine-readable value; renders `<time datetime>` when given. */
  dateTime?: string;
  className?: string;
}

/**
 * An oversized monospace clock readout with tabular figures.
 *
 * @example
 * <BigMonoTime value="06:45" until="08:30" dateTime="2026-08-13T06:45" />
 */
export const BigMonoTime = forwardRef<HTMLElement, BigMonoTimeProps>(
  ({ value, until, separator = "–", size = "md", dateTime, className = "", ...rest }, ref) => {
    const classes = cx("strand-big-mono-time", size !== "md" && `strand-big-mono-time--${size}`, className);
    const body = until ? (
      <>
        {value}
        <span className="strand-big-mono-time__sep" aria-hidden="true">
          {separator}
        </span>
        {until}
      </>
    ) : (
      value
    );
    // biome-ignore lint/suspicious/noExplicitAny: time and span take different attribute sets
    const Tag = (dateTime ? "time" : "span") as any;
    return (
      <Tag ref={ref} className={classes} dateTime={dateTime} {...rest}>
        {body}
      </Tag>
    );
  },
);
BigMonoTime.displayName = "BigMonoTime";

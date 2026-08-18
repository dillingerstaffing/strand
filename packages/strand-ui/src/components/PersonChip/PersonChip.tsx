/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface PersonChipProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** The person's name; the accessible name. */
  name: string;
  /** A quieter second label on the same line, part of the accessible name. */
  secondary?: string;
  /** Initials for the circle; derived from `name` when omitted. */
  initials?: string;
  /** Makes the chip a button. */
  onSelect?: () => void;
  className?: string;
}

/** First letters of the first and last words, up to two. */
export function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

/**
 * An initials avatar beside a name, in a pill; a button only when it does something.
 *
 * @example
 * <PersonChip name="Maria Klein" onSelect={() => open("maria")} />
 */
export const PersonChip = forwardRef<HTMLElement, PersonChipProps>(
  ({ name, secondary, initials, onSelect, className = "", ...rest }, ref) => {
    const classes = cx("strand-person-chip", onSelect && "strand-person-chip--action", className);
    const body = (
      <>
        <span className="strand-person-chip__avatar" aria-hidden="true">
          {initials ?? initialsFrom(name)}
        </span>
        <span className="strand-person-chip__name">{name}</span>
        {secondary ? <span className="strand-person-chip__secondary">{secondary}</span> : null}
      </>
    );
    return onSelect ? (
      <button
        ref={ref as unknown as JSX.HTMLAttributes<HTMLButtonElement>["ref"]}
        type="button"
        className={classes}
        onClick={onSelect}
        {...(rest as JSX.HTMLAttributes<HTMLButtonElement>)}
      >
        {body}
      </button>
    ) : (
      <span ref={ref as unknown as JSX.HTMLAttributes<HTMLSpanElement>["ref"]} className={classes} {...(rest as JSX.HTMLAttributes<HTMLSpanElement>)}>
        {body}
      </span>
    );
  },
);
PersonChip.displayName = "PersonChip";

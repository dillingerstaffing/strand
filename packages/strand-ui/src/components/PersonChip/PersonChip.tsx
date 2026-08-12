/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface PersonChipProps
  extends Omit<JSX.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** The person's name. This is the accessible name. */
  name: string;
  /**
   * Initials for the circle. Derived from `name` when omitted.
   * Decorative either way: the circle is aria-hidden.
   */
  initials?: string;
  /** Makes the chip a button, e.g. to open a profile. */
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
 * An initials avatar beside a name, in a pill.
 *
 * Shipped as one primitive rather than `Avatar` + `Tag` composed by hand,
 * because the pill has to align the circle's optical centre with the
 * name's baseline box, and a consumer composing two primitives gets that
 * right only by accident.
 *
 * The initials are DECORATIVE and the circle is `aria-hidden`: the name
 * beside them is the accessible name, and announcing "MK, Maria Klein"
 * reads the same person twice.
 *
 * @example
 * ```tsx
 * <PersonChip name="Maria Klein" />
 * <PersonChip name="Ana Ruiz" onSelect={() => open('ana')} />
 * ```
 */
export const PersonChip = forwardRef<HTMLElement, PersonChipProps>(
  ({ name, initials, onSelect, className = "", ...rest }, ref) => {
    const classes = [
      "strand-person-chip",
      onSelect ? "strand-person-chip--action" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const body = (
      <>
        <span class="strand-person-chip__avatar" aria-hidden="true">
          {initials ?? initialsFrom(name)}
        </span>
        <span class="strand-person-chip__name">{name}</span>
      </>
    );

    // A button only when it does something. A chip that merely names a
    // person is not a control, and a button role would promise an action
    // the user cannot take while adding a tab stop per person -- in a
    // strip of thirty, that is thirty stops.
    // Two branches rather than a computed tag: `type` is valid on a
    // button and not on a span, so no single element type accepts both
    // prop sets.
    return onSelect ? (
      <button
        ref={ref as unknown as JSX.HTMLAttributes<HTMLButtonElement>["ref"]}
        type="button"
        class={classes}
        onClick={onSelect}
        {...(rest as JSX.HTMLAttributes<HTMLButtonElement>)}
      >
        {body}
      </button>
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
PersonChip.displayName = "PersonChip";

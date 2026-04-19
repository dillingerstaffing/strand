/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { useState } from "preact/hooks";

export type StarRatingSize = "sm" | "md" | "lg";

export interface StarRatingProps
  extends Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    "onChange" | "role" | "aria-label" | "size"
  > {
  /** Currently selected value, 0 through 5 (0 = unset) */
  value: number;
  /** Handler invoked with the new value (1-5) */
  onChange?: (value: number) => void;
  /** Visual scale; controls icon and touch-target size */
  size?: StarRatingSize;
  /** When true, the control is non-interactive and stars render statically */
  readOnly?: boolean;
  /** Accessible group label (e.g. "Rate this event") */
  ariaLabel: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * Interactive 1-to-5 star rating control.
 *
 * Keyboard model: each star is a radio button. Arrow keys move between
 * stars via native focus, Space/Enter selects. Hover highlights stars up
 * to the pointer position. Reduced motion skips the fill transition.
 *
 * @example
 * ```tsx
 * import { StarRating } from '@dillingerstaffing/strand-ui';
 *
 * const [value, setValue] = useState(0);
 *
 * <StarRating
 *   value={value}
 *   onChange={setValue}
 *   ariaLabel="Rate this event"
 *   size="md"
 * />
 * ```
 */
export function StarRating({
  value,
  onChange,
  size = "md",
  readOnly = false,
  ariaLabel,
  className = "",
  ...rest
}: StarRatingProps) {
  const [hover, setHover] = useState(0);

  const classes = [
    "strand-star-rating",
    `strand-star-rating--${size}`,
    readOnly && "strand-star-rating--readonly",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const display = hover || value;

  function handleSelect(n: number) {
    if (readOnly) return;
    if (onChange) onChange(n);
  }

  function handleKey(e: KeyboardEvent, n: number) {
    if (readOnly) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleSelect(n);
    }
  }

  return (
    <div
      {...rest}
      className={classes}
      role="radiogroup"
      aria-label={ariaLabel}
      data-strand-component="star-rating"
      data-value={String(value)}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const isActive = n <= display;
        const starClass = [
          "strand-star-rating__star",
          isActive && "strand-star-rating__star--active",
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <button
            type="button"
            key={n}
            className={starClass}
            role="radio"
            aria-checked={n === value ? "true" : "false"}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            tabIndex={readOnly ? -1 : 0}
            disabled={readOnly}
            data-star-value={String(n)}
            onClick={() => handleSelect(n)}
            onKeyDown={(e) => handleKey(e as KeyboardEvent, n)}
            onMouseEnter={readOnly ? undefined : () => setHover(n)}
            onMouseLeave={readOnly ? undefined : () => setHover(0)}
            onFocus={readOnly ? undefined : () => setHover(n)}
            onBlur={readOnly ? undefined : () => setHover(0)}
          >
            <span className="strand-star-rating__glyph" aria-hidden="true">
              {"\u2605"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

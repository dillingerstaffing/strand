/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { useState } from "preact/hooks";
import { cx } from "../../internal/index.js";

export type StarRatingSize = "sm" | "md" | "lg";

export interface StarRatingProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "role" | "aria-label" | "size"> {
  /** 0 through 5; 0 is unset. */
  value: number;
  /** Called with the new value, 1 through 5. */
  onChange?: (value: number) => void;
  size?: StarRatingSize;
  readOnly?: boolean;
  /** Accessible name for the group. */
  ariaLabel: string;
  className?: string;
}

/**
 * Five-star rating control; each star is a radio.
 *
 * @example
 * <StarRating value={value} onChange={setValue} ariaLabel="Rate this event" />
 */
export function StarRating({ value, onChange, size = "md", readOnly = false, ariaLabel, className = "", ...rest }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  const select = (n: number) => {
    if (!readOnly) onChange?.(n);
  };
  return (
    <div
      {...rest}
      className={cx("strand-star-rating", `strand-star-rating--${size}`, readOnly && "strand-star-rating--readonly", className)}
      role="radiogroup"
      aria-label={ariaLabel}
      data-strand-component="star-rating"
      data-value={String(value)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className={cx("strand-star-rating__star", n <= display && "strand-star-rating__star--active")}
          role="radio"
          aria-checked={n === value ? "true" : "false"}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          tabIndex={readOnly ? -1 : 0}
          disabled={readOnly}
          data-star-value={String(n)}
          onClick={() => select(n)}
          onKeyDown={(e) => {
            if (readOnly) return;
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              select(n);
            }
          }}
          onMouseEnter={readOnly ? undefined : () => setHover(n)}
          onMouseLeave={readOnly ? undefined : () => setHover(0)}
          onFocus={readOnly ? undefined : () => setHover(n)}
          onBlur={readOnly ? undefined : () => setHover(0)}
        >
          <span className="strand-star-rating__glyph" aria-hidden="true">
            {"★"}
          </span>
        </button>
      ))}
    </div>
  );
}

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { useRef, useState } from "preact/hooks";
import { cx } from "../../internal/index.js";

export type StarRatingSize = "sm" | "md" | "lg";

export interface StarRatingProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "role" | "aria-label" | "size"> {
  /** 0 through count; 0 is unset. */
  value: number;
  /** Called with the new value, 1 through count, or 0 when allowClear re-selects the current star. */
  onChange?: (value: number) => void;
  /** Number of stars. */
  count?: number;
  /** Selecting the current star again clears the rating. */
  allowClear?: boolean;
  size?: StarRatingSize;
  /** Renders as an image named "{value} of {count} stars"; no controls. */
  readOnly?: boolean;
  /** Accessible name for the group. */
  ariaLabel: string;
  className?: string;
}

/**
 * Star rating control: each star is a radio; arrows, Home and End move the rating.
 *
 * @example
 * <StarRating value={value} onChange={setValue} ariaLabel="Rate this event" />
 */
export function StarRating({ value, onChange, count = 5, allowClear = false, size = "md", readOnly = false, ariaLabel, className = "", ...rest }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const stars = useRef(new Map<number, HTMLButtonElement>());
  const values = Array.from({ length: count }, (_, i) => i + 1);
  const display = hover || value;
  const rootClass = cx("strand-star-rating", `strand-star-rating--${size}`, readOnly && "strand-star-rating--readonly", className);
  const glyph = () => (
    <span className="strand-star-rating__glyph" aria-hidden="true">
      {"★"}
    </span>
  );

  if (readOnly) {
    return (
      <div {...rest} className={rootClass} role="img" aria-label={`${ariaLabel}, ${value} of ${count} stars`} data-strand-component="star-rating" data-value={String(value)}>
        {values.map((n) => (
          <span key={n} className={cx("strand-star-rating__star", n <= value && "strand-star-rating__star--active")} data-star-value={String(n)}>
            {glyph()}
          </span>
        ))}
      </div>
    );
  }

  const select = (n: number) => onChange?.(allowClear && n === value ? 0 : n);
  const moveTo = (n: number) => {
    const next = Math.min(count, Math.max(1, n));
    onChange?.(next);
    stars.current.get(next)?.focus();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const next: Record<string, number> = { ArrowRight: value + 1, ArrowUp: value + 1, ArrowLeft: value - 1, ArrowDown: value - 1, Home: 1, End: count };
    if (!(e.key in next)) return;
    e.preventDefault();
    moveTo(next[e.key]);
  };
  const focused = value || 1;

  return (
    <div {...rest} className={rootClass} role="radiogroup" aria-label={ariaLabel} data-strand-component="star-rating" data-value={String(value)} onKeyDown={onKeyDown}>
      {values.map((n) => (
        <button
          type="button"
          key={n}
          ref={(el) => {
            if (el) stars.current.set(n, el);
            else stars.current.delete(n);
          }}
          className={cx("strand-star-rating__star", n <= display && "strand-star-rating__star--active")}
          role="radio"
          aria-checked={n === value ? "true" : "false"}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          tabIndex={n === focused ? 0 : -1}
          data-star-value={String(n)}
          onClick={() => select(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
        >
          {glyph()}
        </button>
      ))}
    </div>
  );
}

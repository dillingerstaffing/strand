/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface SearchTriggerProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, "label"> {
  /** `field` fixed width, `full` spans, `icon` a square at the touch floor; choose per breakpoint with the hide utilities. */
  variant?: "field" | "full" | "icon";
  /** Visible standing text, and the accessible name (WCAG 2.5.3). */
  label?: string;
  /** Whether the overlay it opens is showing. */
  expanded?: boolean;
  /** `id` of that overlay. */
  controls?: string;
  className?: string;
}

/**
 * Looks like a search field, behaves like a button: opens a search overlay (`aria-haspopup="dialog"`).
 *
 * @example
 * <SearchTrigger label="Search events" expanded={open} controls="palette" onClick={() => setOpen(true)} />
 */
export const SearchTrigger = forwardRef<HTMLButtonElement, SearchTriggerProps>(
  ({ variant = "field", label = "Search", expanded, controls, className = "", ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cx("strand-search-field", variant === "full" && "strand-search-field--full", "strand-search-trigger", variant === "icon" && "strand-search-trigger--icon", className)}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls={controls}
      {...rest}
    >
      <svg className="strand-search-field__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5 14 14" />
      </svg>
      <span className="strand-search-trigger__label">{label}</span>
    </button>
  ),
);
SearchTrigger.displayName = "SearchTrigger";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface SearchFieldProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, "size" | "onInput"> {
  /** `field` is the fixed-width header presentation; `full` spans its container. Choose per breakpoint with the hide utilities, never by measuring in JS. */
  variant?: "field" | "full";
  /** Name real content. */
  placeholder?: string;
  value?: string;
  /** Accessible name; a placeholder is not one. */
  label?: string;
  /** Called with the value on every keystroke. */
  onValueChange?: (value: string) => void;
  /** Renders a clear control while the field is non-empty; needs `value`. */
  onClear?: () => void;
  /** Merged onto the wrapper. */
  className?: string;
}

/**
 * A search input for page chrome, a `role="search"` landmark that renders its geometry with no JavaScript. Not the map overlay `.strand-search-bar`.
 *
 * @example
 * <SearchField placeholder="Search events" value={q} onValueChange={setQ} onClear={() => setQ("")} />
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ variant = "field", placeholder = "Search", label = "Search", value, onValueChange, onClear, className = "", ...rest }, ref) => {
    const clearable = Boolean(onClear) && typeof value === "string";
    const hasValue = typeof value === "string" && value.length > 0;
    return (
      <div className={cx("strand-search-field", variant === "full" && "strand-search-field--full", className)} role="search">
        <svg className="strand-search-field__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5 14 14" />
        </svg>
        <input
          ref={ref}
          className="strand-search-field__input"
          type="search"
          aria-label={label}
          placeholder={placeholder}
          value={value}
          onInput={(event) => onValueChange?.((event.currentTarget as HTMLInputElement).value)}
          {...rest}
        />
        {clearable && (
          <button type="button" className="strand-search-field__clear" aria-label="Clear search" hidden={!hasValue} onClick={onClear}>
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true" focusable="false">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
SearchField.displayName = "SearchField";

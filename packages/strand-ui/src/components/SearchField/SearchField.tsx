/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface SearchFieldProps
  extends Omit<JSX.HTMLAttributes<HTMLInputElement>, "size" | "onInput"> {
  /**
   * `field` is the fixed-width header presentation. `full` spans its
   * container, for a narrow viewport or a filter rail.
   *
   * A prop rather than a second component: the two presentations differ
   * in exactly one CSS property, and both belong in the markup at once
   * when a layout swaps them at a breakpoint. Pair with
   * `strand-hide-below-md` / `strand-hide-from-md` to choose between
   * them in CSS, never by measuring the viewport in JS -- a control
   * chosen at runtime appears a frame late, which is a layout shift in
   * the one region of the page that can least afford one.
   */
  variant?: "field" | "full";
  /** Placeholder. Name real content: "Search trail runs, pottery, chess". */
  placeholder?: string;
  /**
   * Current value. Declared explicitly rather than inherited: Preact's
   * generic `JSX.HTMLAttributes<T>` carries no `value`, which lives on
   * the input-specific interface, and the clear control's whole contract
   * depends on this component being able to read it.
   */
  value?: string;
  /**
   * Accessible name for the input. Defaults to "Search". A field with a
   * placeholder and no label is unlabelled to a screen reader, because a
   * placeholder is a hint and disappears on the first keystroke.
   */
  label?: string;
  /** Called with the input's current value on every keystroke. */
  onValueChange?: (value: string) => void;
  /**
   * Renders a clear control when the field is non-empty. Requires
   * `value` to be supplied, since an uncontrolled field has no value
   * this component can read to decide whether the control applies.
   */
  onClear?: () => void;
  /** Class merged onto the wrapper, not the input. */
  className?: string;
}

/**
 * A search input for page chrome.
 *
 * Renders its full geometry from first paint with no JavaScript, so it
 * can be server-rendered into a header without moving the page when it
 * hydrates (design-language.md 6.6.1, the space contract).
 *
 * This is NOT `.strand-search-bar`, which is the overlay that floats on
 * an instrument viewport. Use that one on a map; use this one in a
 * header, a filter rail, or any ordinary document flow.
 *
 * Accessibility: the wrapper is a `role="search"` landmark, the input is
 * `type="search"`, and the input always carries an accessible name even
 * when the visible affordance is only a placeholder.
 *
 * @example
 * ```tsx
 * import { SearchField } from '@dillingerstaffing/strand-ui';
 *
 * // Both presentations in the markup, chosen by CSS at a breakpoint
 * <SearchField
 *   className="strand-hide-below-md"
 *   placeholder="Search trail runs, pottery, chess"
 *   value={q}
 *   onValueChange={setQ}
 *   onClear={() => setQ('')}
 * />
 * <SearchField
 *   variant="full"
 *   className="strand-hide-from-md"
 *   placeholder="Search events"
 *   value={q}
 *   onValueChange={setQ}
 * />
 * ```
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      variant = "field",
      placeholder = "Search",
      label = "Search",
      value,
      onValueChange,
      onClear,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-search-field",
      variant === "full" ? "strand-search-field--full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // An uncontrolled field has no value here to test, so the control is
    // withheld rather than rendered permanently: a clear button that is
    // always present on an always-empty-looking field is a control that
    // lies about whether there is anything to clear.
    const clearable = Boolean(onClear) && typeof value === "string";
    const hasValue = typeof value === "string" && value.length > 0;

    return (
      <div class={classes} role="search">
        <svg
          class="strand-search-field__icon"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5 14 14" />
        </svg>

        <input
          ref={ref}
          class="strand-search-field__input"
          type="search"
          aria-label={label}
          placeholder={placeholder}
          value={value}
          onInput={(event) => {
            onValueChange?.((event.currentTarget as HTMLInputElement).value);
          }}
          {...rest}
        />

        {clearable && (
          <button
            type="button"
            class="strand-search-field__clear"
            aria-label="Clear search"
            hidden={!hasValue}
            onClick={onClear}
          >
            <svg
              viewBox="0 0 16 16"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

SearchField.displayName = "SearchField";

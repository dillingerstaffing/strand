/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface SearchTriggerProps
  extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, "label"> {
  /**
   * `field` is the fixed-width header presentation. `full` spans its
   * container, for a narrow viewport.
   *
   * Pair the two with `strand-hide-below-md` / `strand-hide-from-md` so
   * both ship in the markup and CSS chooses. Choosing by measuring the
   * viewport in JS renders the control a frame late, in a header, which
   * is the one region of a page that can least afford a shift.
   */
  variant?: "field" | "full";
  /**
   * The visible standing text, which reads as a placeholder. Name real
   * content: "Search trail runs, pottery, chess".
   *
   * This is ALSO the accessible name, deliberately. There is no
   * `aria-label` override, because WCAG 2.5.3 (Label in Name) requires
   * the accessible name to contain the visible text: a speech-input user
   * saying what they can see must activate the control. An `aria-label`
   * of "Search" over visible text of "Search events" breaks that.
   */
  label?: string;
  /** Whether the overlay this opens is currently showing. */
  expanded?: boolean;
  /** `id` of the overlay, when one is rendered. */
  controls?: string;
  className?: string;
}

/**
 * A control that looks like a search field and behaves like a button:
 * it opens a search overlay rather than accepting text.
 *
 * Use this wherever search is palette-driven. Use `SearchField` only
 * where the input itself is the search — where typing filters something
 * on the page and the keystrokes have nowhere else to go.
 *
 * Renders its full geometry from first paint with no JavaScript, so it
 * can be server-rendered into a header without moving the page when it
 * hydrates (design-language.md 6.6.1, the space contract).
 *
 * Accessibility: a `<button>` with `aria-haspopup="dialog"`, so assistive
 * technology announces that activating it opens something rather than
 * promising that typing works here. An `<input>` that opened an overlay
 * on focus would violate WCAG 3.2.1 (On Focus).
 *
 * @example
 * ```tsx
 * import { SearchTrigger } from '@dillingerstaffing/strand-ui';
 *
 * <SearchTrigger
 *   className="strand-hide-below-md"
 *   label="Search trail runs, pottery, chess"
 *   expanded={paletteOpen}
 *   controls="search-palette"
 *   onClick={() => setPaletteOpen(true)}
 * />
 * ```
 */
export const SearchTrigger = forwardRef<HTMLButtonElement, SearchTriggerProps>(
  (
    {
      variant = "field",
      label = "Search",
      expanded,
      controls,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-search-field",
      variant === "full" ? "strand-search-field--full" : "",
      "strand-search-trigger",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} type="button" class={classes} aria-haspopup="dialog" aria-expanded={expanded} aria-controls={controls} {...rest}>
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
        <span class="strand-search-trigger__label">{label}</span>
      </button>
    );
  },
);

SearchTrigger.displayName = "SearchTrigger";

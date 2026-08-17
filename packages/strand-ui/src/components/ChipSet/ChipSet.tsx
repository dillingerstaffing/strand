/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface ChipSetItem {
  /** Stable identity, and what the change callback reports. */
  id: string;
  label: string;
}

export interface ChipSetProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: ChipSetItem[];
  /** ids currently selected. */
  selected?: string[];
  /**
   * `multi` is a set of independent toggles (rail interests). `single` is
   * a choice of one (the mobile "All" strip).
   *
   * Not cosmetic: multi renders toggle buttons carrying `aria-pressed`,
   * single renders a radiogroup. "Any of these" and "one of these" are
   * different promises, and painting them identically tells a screen
   * reader nothing about which it is.
   */
  mode?: "multi" | "single";
  /** `scroll` never wraps and scrolls sideways instead. */
  overflow?: "wrap" | "scroll";
  /**
   * Chip size. `md` is the default and is unchanged.
   *
   * `sm` exists because the chip's type and padding were constants: a filter
   * strip above a dense list is drawn smaller than one that is the page's main
   * control, and a consumer needing that had to override
   * `.strand-chip-set__chip`, which is the workaround the dogfood protocol
   * forbids. It is the same ladder Button and PersonChip already carry.
   */
  size?: "sm" | "md";
  /** Accessible name for the set. */
  label: string;
  /** Called with the ids selected after the interaction. */
  onSelectionChange?: (selected: string[]) => void;
  className?: string;
}

/**
 * A set of selectable chips that wraps in a rail and scrolls on a narrow
 * viewport.
 *
 * The overflow behaviour is the component rather than a detail of it:
 * `strand-stack--horizontal` + `--wrap` is correct in a desktop rail and
 * wrong at 390, where a filter strip wrapping to three lines pushes the
 * content it filters off the screen. It SCROLLS rather than clipping,
 * because a filter the reader cannot reach is not a filter.
 *
 * @example
 * ```tsx
 * <ChipSet label="Interests" items={topics}
 *   selected={picked} onSelectionChange={setPicked} />
 *
 * <ChipSet label="Filter" mode="single" overflow="scroll"
 *   items={filters} selected={[active]}
 *   onSelectionChange={([id]) => setActive(id)} />
 * ```
 */
export const ChipSet = forwardRef<HTMLDivElement, ChipSetProps>(
  (
    {
      items,
      selected = [],
      mode = "multi",
      overflow = "wrap",
      size = "md",
      label,
      onSelectionChange,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const scrolls = overflow === "scroll";
    const classes = [
      "strand-chip-set",
      scrolls ? "strand-chip-set--scroll" : "",
      size === "sm" ? "strand-chip-set--sm" : "",
      // Composes the scroll-row contract rather than restating it, so a
      // chip strip and every other scrolling row share one definition.
      scrolls ? "strand-scroll-row" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const toggle = (id: string) => {
      if (!onSelectionChange) return;
      if (mode === "single") {
        onSelectionChange([id]);
        return;
      }
      onSelectionChange(
        selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id],
      );
    };

    return (
      <div
        ref={ref}
        class={classes}
        role={mode === "single" ? "radiogroup" : "group"}
        aria-label={label}
        {...rest}
      >
        {items.map((item) => {
          const on = selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              class="strand-chip-set__chip"
              // The selected state is the ARIA attribute, which is also
              // what styles it, so painted and announced cannot drift.
              role={mode === "single" ? "radio" : undefined}
              aria-pressed={mode === "multi" ? on : undefined}
              aria-checked={mode === "single" ? on : undefined}
              onClick={() => toggle(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    );
  },
);
ChipSet.displayName = "ChipSet";

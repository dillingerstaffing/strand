/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface ChipSetItem {
  /** Stable identity, reported by `onSelectionChange`. */
  id: string;
  label: string;
}

export interface ChipSetProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: ChipSetItem[];
  /** ids currently selected. */
  selected?: string[];
  /** `multi` renders toggle buttons; `single` renders a radiogroup. */
  mode?: "multi" | "single";
  /** `scroll` never wraps and scrolls sideways. */
  overflow?: "wrap" | "scroll";
  size?: "sm" | "md";
  /** Accessible name for the set. */
  label: string;
  /** Called with the ids selected after the interaction. */
  onSelectionChange?: (selected: string[]) => void;
  className?: string;
}

/**
 * Selectable chips that wrap in a rail and scroll on a narrow viewport.
 *
 * @example
 * <ChipSet label="Interests" items={topics} selected={picked} onSelectionChange={setPicked} />
 */
export const ChipSet = forwardRef<HTMLDivElement, ChipSetProps>(
  ({ items, selected = [], mode = "multi", overflow = "wrap", size = "md", label, onSelectionChange, className = "", ...rest }, ref) => {
    const scrolls = overflow === "scroll";
    const toggle = (id: string) => {
      if (!onSelectionChange) return;
      if (mode === "single") return onSelectionChange([id]);
      onSelectionChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
    };
    return (
      <div
        ref={ref}
        className={cx("strand-chip-set", scrolls && "strand-chip-set--scroll", size === "sm" && "strand-chip-set--sm", scrolls && "strand-scroll-row", className)}
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
              className="strand-chip-set__chip"
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

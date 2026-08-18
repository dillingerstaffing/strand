/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useRef } from "preact/hooks";
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
    const single = mode === "single";
    const chips = useRef(new Map<string, HTMLButtonElement>());
    const toggle = (id: string) => {
      if (!onSelectionChange) return;
      if (single) return onSelectionChange([id]);
      onSelectionChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
    };
    const focused = single ? (items.find((i) => selected.includes(i.id)) ?? items[0])?.id : undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (!single || items.length === 0) return;
      const current = Math.max(0, items.findIndex((i) => i.id === focused));
      const next: Record<string, number> = {
        ArrowRight: (current + 1) % items.length,
        ArrowLeft: (current - 1 + items.length) % items.length,
        Home: 0,
        End: items.length - 1,
      };
      if (!(e.key in next)) return;
      e.preventDefault();
      const id = items[next[e.key]].id;
      onSelectionChange?.([id]);
      chips.current.get(id)?.focus();
    };
    return (
      <div
        ref={ref}
        className={cx("strand-chip-set", scrolls && "strand-chip-set--scroll", size === "sm" && "strand-chip-set--sm", scrolls && "strand-scroll-row", className)}
        role={single ? "radiogroup" : "group"}
        aria-label={label}
        onKeyDown={onKeyDown}
        {...rest}
      >
        {items.map((item) => {
          const on = selected.includes(item.id);
          return (
            <button
              key={item.id}
              ref={(el) => {
                if (el) chips.current.set(item.id, el);
                else chips.current.delete(item.id);
              }}
              type="button"
              className="strand-chip-set__chip"
              role={single ? "radio" : undefined}
              aria-pressed={single ? undefined : on}
              aria-checked={single ? on : undefined}
              tabIndex={single ? (item.id === focused ? 0 : -1) : undefined}
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

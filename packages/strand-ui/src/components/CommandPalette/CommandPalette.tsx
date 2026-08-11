/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useCallback, useEffect, useId, useRef, useState } from "preact/hooks";
import { Dialog } from "../Dialog/index.js";

export interface CommandPaletteItem {
  /** Stable identity. Used for keys and for the active-descendant id. */
  id: string;
  /** Primary text. This is what the user is scanning for. */
  label: string;
  /** Secondary text shown beneath the label. */
  sublabel?: string;
  /** Optional short trailing token, such as a category or shortcut hint. */
  badge?: string;
}

export interface CommandPaletteProps
  extends Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    // "title" is omitted for the same reason Dialog omits it, and it has to be
    // omitted HERE as well: the rest of these props are spread straight onto
    // Dialog, and JSX.HTMLAttributes types `title` as Signalish<string> while
    // DialogProps narrows it to a plain string. Leaving it in makes the spread
    // unassignable, which fails `tsc --emitDeclarationOnly` AFTER vite has
    // already emitted the CSS, so the build looks half-successful and no
    // dist/index.d.ts is written.
    "onSelect" | "onInput" | "open" | "title"
  > {
  /** Whether the palette is open */
  open: boolean;
  /** Called when the palette should close */
  onClose: () => void;
  /** Items to show, already filtered and ranked by the caller */
  items: CommandPaletteItem[];
  /** Current search text */
  query: string;
  /** Called as the user types */
  onQueryChange: (query: string) => void;
  /** Called when an item is chosen by Enter or by click */
  onSelect: (item: CommandPaletteItem) => void;
  /** Placeholder for the search field */
  placeholder?: string;
  /** Shown when items is empty */
  emptyLabel?: string;
  /** Accessible name for the palette */
  label?: string;
}

/** Wrap at both ends so the last item is one keypress from the first. */
function wrapIndex(index: number, delta: number, length: number): number {
  if (length <= 0) return 0;
  return (((index + delta) % length) + length) % length;
}

/**
 * Search-and-jump overlay: a filtered list the user drives entirely from the
 * keyboard. Composes Dialog, so focus trapping, focus restoration, scroll lock
 * and Escape dismissal are inherited rather than reimplemented.
 *
 * Filtering and ranking belong to the caller. What lives here is the part that
 * is easy to get subtly wrong: the combobox and listbox roles, the
 * active-descendant wiring that lets a screen reader announce the highlighted
 * row while focus stays in the text field, arrow-key selection with wrapping,
 * and keeping the highlighted row in view.
 *
 * @example
 * ```tsx
 * import { CommandPalette } from '@dillingerstaffing/strand-ui';
 *
 * <CommandPalette
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   items={results}
 *   query={query}
 *   onQueryChange={setQuery}
 *   onSelect={(item) => navigate(item.id)}
 *   placeholder="Jump to..."
 * />
 * ```
 */
export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      open,
      onClose,
      items,
      query,
      onQueryChange,
      onSelect,
      placeholder = "Search...",
      emptyLabel = "No matches",
      label = "Search",
      className = "",
      ...rest
    },
    ref,
  ) => {
    const [active, setActive] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);
    const baseId = useId();
    const listboxId = `${baseId}-listbox`;
    const optionId = (index: number) => `${baseId}-option-${index}`;

    // A shorter list can leave the highlight past the end, which would make
    // Enter select nothing. Reset whenever the result set changes identity.
    useEffect(() => {
      setActive(0);
    }, [items]);

    // Reopening should not resume someone else's old position.
    useEffect(() => {
      if (open) setActive(0);
    }, [open]);

    // Keyboard selection can move the highlight outside the scroll viewport,
    // where the user is driving a list they cannot see.
    useEffect(() => {
      const list = listRef.current;
      if (!list) return;
      const el = list.querySelector<HTMLElement>(`#${CSS.escape(optionId(active))}`);
      // Guarded rather than called bare: scrollIntoView is absent in jsdom and
      // in any non-browser renderer, and an unguarded call there throws on
      // every selection change. The scroll is a courtesy; losing it must not
      // break the component.
      if (typeof el?.scrollIntoView === "function") {
        el.scrollIntoView({ block: "nearest" });
      }
    }, [active]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActive((i) => wrapIndex(i, 1, items.length));
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActive((i) => wrapIndex(i, -1, items.length));
          return;
        }
        if (e.key === "Home") {
          e.preventDefault();
          setActive(0);
          return;
        }
        if (e.key === "End") {
          e.preventDefault();
          setActive(Math.max(0, items.length - 1));
          return;
        }
        if (e.key === "Enter") {
          const item = items[active];
          // Enter on an empty result set must do nothing rather than throw
          // while the user is mid-keystroke.
          if (!item) return;
          e.preventDefault();
          onSelect(item);
        }
      },
      [items, active, onSelect],
    );

    return (
      <Dialog
        open={open}
        onClose={onClose}
        closeOnOutsideClick
        closeOnEscape
        className={["strand-command-palette", className].filter(Boolean).join(" ")}
        aria-label={label}
        ref={ref}
        {...rest}
      >
        <div className="strand-command-palette__search">
          <svg
            className="strand-command-palette__icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
          <input
            type="text"
            className="strand-command-palette__input"
            value={query}
            placeholder={placeholder}
            onInput={(e) => onQueryChange((e.target as HTMLInputElement).value)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={items.length ? optionId(active) : undefined}
            aria-autocomplete="list"
            aria-label={label}
            autocomplete="off"
            spellcheck={false}
          />
        </div>

        <div
          ref={listRef}
          className="strand-command-palette__list"
          id={listboxId}
          role="listbox"
          aria-label={label}
        >
          {items.length === 0 && (
            <p className="strand-command-palette__empty">{emptyLabel}</p>
          )}
          {items.map((item, index) => (
            <div
              key={item.id}
              id={optionId(index)}
              role="option"
              tabIndex={-1}
              aria-selected={index === active}
              className={
                index === active
                  ? "strand-command-palette__option strand-command-palette__option--active"
                  : "strand-command-palette__option"
              }
              // Pointer and keyboard must agree: hovering moves the same
              // highlight Enter acts on, so the two never disagree about
              // what is selected.
              onMouseMove={() => setActive(index)}
              onClick={() => onSelect(item)}
            >
              <span className="strand-command-palette__label">{item.label}</span>
              {item.sublabel && (
                <span className="strand-command-palette__sublabel">
                  {item.sublabel}
                </span>
              )}
              {item.badge && (
                <span className="strand-command-palette__badge">{item.badge}</span>
              )}
            </div>
          ))}
        </div>
      </Dialog>
    );
  },
);

CommandPalette.displayName = "CommandPalette";

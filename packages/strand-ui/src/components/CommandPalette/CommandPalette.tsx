/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useId, useRef, useState } from "preact/hooks";
import { Dialog } from "../Dialog/index.js";
import { cx } from "../../internal/index.js";

export interface CommandPaletteItem {
  /** Stable identity, used for keys and the active-descendant id. */
  id: string;
  label: string;
  sublabel?: string;
  /** Short trailing token, such as a category or shortcut hint. */
  badge?: string;
}

export interface CommandPaletteProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect" | "onInput" | "open" | "title"> {
  open: boolean;
  onClose: () => void;
  /** Already filtered and ranked by the caller. */
  items: CommandPaletteItem[];
  query: string;
  onQueryChange: (query: string) => void;
  /** Chosen by Enter or click. */
  onSelect: (item: CommandPaletteItem) => void;
  placeholder?: string;
  emptyLabel?: string;
  /** Accessible name. */
  label?: string;
}

/** Wrap at both ends. */
function wrapIndex(index: number, delta: number, length: number): number {
  if (length <= 0) return 0;
  return (((index + delta) % length) + length) % length;
}

/**
 * Search-and-jump overlay driven from the keyboard: combobox, listbox, active descendant, wrapping arrows. Composes `Dialog`; filtering belongs to the caller.
 *
 * @example
 * <CommandPalette open={open} onClose={close} items={results} query={query} onQueryChange={setQuery} onSelect={(item) => navigate(item.id)} />
 */
export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  ({ open, onClose, items, query, onQueryChange, onSelect, placeholder = "Search...", emptyLabel = "No matches", label = "Search", className = "", ...rest }, ref) => {
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const options = useRef(new Map<number, HTMLDivElement>());
    const baseId = useId();
    const listboxId = `${baseId}-listbox`;
    const optionId = (index: number) => `${baseId}-option-${index}`;

    // A new result set or a reopen starts at the top.
    // biome-ignore lint/correctness/useExhaustiveDependencies: reset on identity, not on contents
    useEffect(() => setActive(0), [items, open]);

    // Keep the highlighted row in view; scrollIntoView is absent outside a browser.
    useEffect(() => {
      const el = options.current.get(active);
      if (typeof el?.scrollIntoView === "function") el.scrollIntoView({ block: "nearest" });
    }, [active]);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") setActive((i) => wrapIndex(i, 1, items.length));
      else if (e.key === "ArrowUp") setActive((i) => wrapIndex(i, -1, items.length));
      else if (e.key === "Home") setActive(0);
      else if (e.key === "End") setActive(Math.max(0, items.length - 1));
      else if (e.key === "Enter") {
        const item = items[active];
        if (!item) return;
        onSelect(item);
      } else return;
      e.preventDefault();
    };

    return (
      <Dialog
        open={open}
        onClose={onClose}
        closeOnOutsideClick
        closeOnEscape
        initialFocus={inputRef}
        className={cx("strand-command-palette", className)}
        aria-label={label}
        ref={ref}
        {...rest}
      >
        <div className="strand-command-palette__search">
          <svg className="strand-command-palette__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="strand-command-palette__input"
            value={query}
            placeholder={placeholder}
            onInput={(e) => onQueryChange((e.target as HTMLInputElement).value)}
            onKeyDown={onKeyDown}
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
        <div className="strand-command-palette__list" id={listboxId} role="listbox" aria-label={label}>
          {items.length === 0 && <p className="strand-command-palette__empty">{emptyLabel}</p>}
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) options.current.set(index, el);
                else options.current.delete(index);
              }}
              id={optionId(index)}
              role="option"
              tabIndex={-1}
              aria-selected={index === active}
              className={cx("strand-command-palette__option", index === active && "strand-command-palette__option--active")}
              onMouseMove={() => setActive(index)}
              onClick={() => onSelect(item)}
            >
              <span className="strand-command-palette__label">{item.label}</span>
              {item.sublabel && <span className="strand-command-palette__sublabel">{item.sublabel}</span>}
              {item.badge && <span className="strand-command-palette__badge">{item.badge}</span>}
            </div>
          ))}
        </div>
      </Dialog>
    );
  },
);
CommandPalette.displayName = "CommandPalette";

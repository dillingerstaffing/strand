/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX, VNode } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface TabBarItem {
  /** Stable identity, reported by `onNavigate`. */
  id: string;
  label: string;
  /** Destination; omit for a button driven by `onNavigate`. */
  href?: string;
  /** Decorative glyph. */
  icon?: VNode;
}

export interface TabBarProps extends JSX.HTMLAttributes<HTMLElement> {
  /** Three to five destinations (DL 19.1.1). */
  items: TabBarItem[];
  /** `id` of the current destination. */
  current?: string;
  /** Called with an item's `id`; a plain click on a link then stays client-side (cf: tabbar-modified-click). */
  onNavigate?: (id: string) => void;
  /** Accessible name for the landmark. */
  label?: string;
  className?: string;
}

/**
 * The persistent bottom navigation of an application shell on a touch viewport (DL 19.1.1); reserve its space with `strand-tabbar-offset`.
 *
 * @example
 * <TabBar current={route} onNavigate={setRoute} items={[{ id: "discover", label: "Discover", href: "/discover" }]} />
 */
export const TabBar = forwardRef<HTMLElement, TabBarProps>(({ items, current, onNavigate, label = "Primary", className = "", ...rest }, ref) => (
  <nav ref={ref} className={cx("strand-tabbar", className)} aria-label={label} {...rest}>
    {items.map((item) => {
      const isCurrent = item.id === current;
      const shared = {
        className: "strand-tabbar__item",
        "aria-current": isCurrent ? ("page" as const) : undefined,
        onClick: onNavigate
          ? (event: MouseEvent) => {
              if (item.href) {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
              }
              onNavigate(item.id);
            }
          : undefined,
      };
      const content = (
        <>
          {item.icon && (
            <span className="strand-tabbar__icon" aria-hidden="true">
              {item.icon}
            </span>
          )}
          <span className="strand-tabbar__label">{item.label}</span>
        </>
      );
      return item.href ? (
        <a key={item.id} href={item.href} {...shared}>
          {content}
        </a>
      ) : (
        <button key={item.id} type="button" {...shared}>
          {content}
        </button>
      );
    })}
  </nav>
));
TabBar.displayName = "TabBar";

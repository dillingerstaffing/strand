/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX, VNode } from "preact";
import { forwardRef } from "preact/compat";

export interface TabBarItem {
  /** Stable identity, and what `onNavigate` is called with. */
  id: string;
  /** Visible label. Kept short: it wraps rather than truncating. */
  label: string;
  /** Destination. Omit for a button-style item driven by `onNavigate`. */
  href?: string;
  /** Decorative glyph. Rendered `aria-hidden`; the label is the name. */
  icon?: VNode;
}

export interface TabBarProps extends JSX.HTMLAttributes<HTMLElement> {
  /**
   * The top-level destinations. Three to five, per design-language.md
   * 19.1.1: fewer is a link rather than a navigation, and more cannot sit
   * in a row at 320px without truncating a label.
   */
  items: TabBarItem[];
  /** `id` of the current destination. Sets `aria-current="page"`. */
  current?: string;
  /** Called with an item's `id`. Use for client-side routing. */
  onNavigate?: (id: string) => void;
  /** Accessible name for the landmark. Defaults to "Primary". */
  label?: string;
  className?: string;
}

/**
 * The persistent viewport-anchored navigation an application shell takes
 * on a touch viewport.
 *
 * Implements design-language.md 19.1.1, which is the CONDITION selecting
 * between this and the hamburger in 19.1. Read it before using this:
 * the commonest misuse is putting a tab bar on a content surface, where
 * the hamburger is correct and this costs 76px of every screen forever.
 *
 * Not `Tabs`, which switches content panels inside one view (19.3). Tabs
 * change what a region shows; this changes which destination the user is
 * on. Not `ActionDock` either: a dock carries the one ACTION a view
 * produces, this carries DESTINATIONS, and 19.1.1 forbids stacking them.
 *
 * Reserve the space it occupies by putting `strand-tabbar-offset` on the
 * scrolling content. Without it the last item of every list sits under
 * the bar, which is the defect every fixed bottom bar ships with.
 *
 * @example
 * ```tsx
 * import { TabBar } from '@dillingerstaffing/strand-ui';
 *
 * <TabBar
 *   current={route}
 *   onNavigate={setRoute}
 *   items={[
 *     { id: 'discover', label: 'Discover', href: '/discover', icon: <SearchIcon /> },
 *     { id: 'calendar', label: 'Calendar', href: '/calendar', icon: <CalIcon /> },
 *     { id: 'people',   label: 'People',   href: '/people',   icon: <PeopleIcon /> },
 *   ]}
 * />
 * ```
 */
export const TabBar = forwardRef<HTMLElement, TabBarProps>(
  ({ items, current, onNavigate, label = "Primary", className = "", ...rest }, ref) => {
    const classes = ["strand-tabbar", className].filter(Boolean).join(" ");

    return (
      <nav ref={ref} class={classes} aria-label={label} {...rest}>
        {items.map((item) => {
          const isCurrent = item.id === current;
          // aria-current is the styling hook as well as the announced
          // state, so the two cannot be set independently and drift.
          const shared = {
            class: "strand-tabbar__item",
            "aria-current": isCurrent ? ("page" as const) : undefined,
            onClick: onNavigate
              ? (event: MouseEvent) => {
                  // A destination with a href is a real link, so without this
                  // a consumer wiring onNavigate to a client-side router gets
                  // BOTH: the router sets its state and the browser then hard
                  // -navigates on top of it, discarding the application. The
                  // handler owns the click only when it is going to handle it.
                  //
                  // But only a plain primary click. A modified or middle
                  // click is the user asking for a new tab or window, which
                  // is the entire reason these stay links rather than
                  // buttons; swallowing it would take that away and leave no
                  // way to get it back. Those fall through untouched, and
                  // onNavigate is NOT called, because the current view is not
                  // the one changing.
                  if (item.href) {
                    if (
                      event.button !== 0 ||
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    ) {
                      return;
                    }
                    event.preventDefault();
                  }
                  onNavigate(item.id);
                }
              : undefined,
          };
          const content = (
            <>
              {item.icon && (
                <span class="strand-tabbar__icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span class="strand-tabbar__label">{item.label}</span>
            </>
          );

          // An item WITH a destination is a link, so it keeps middle-click,
          // open-in-new-tab and the status bar preview. Only a destination
          // that genuinely has no URL falls back to a button.
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
    );
  },
);

TabBar.displayName = "TabBar";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useRef } from "preact/hooks";
import { cx } from "../../internal/index.js";

export interface TabItem {
  id: string;
  label: string;
  content: ComponentChildren;
}

export interface TabsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: TabItem[];
  /** Active tab id (controlled). */
  activeTab: string;
  onChange: (id: string) => void;
}

/**
 * Tabbed content switcher with the ARIA tabs pattern: arrows, Home and End move and select.
 *
 * @example
 * <Tabs tabs={[{ id: "a", label: "A", content: <p>A</p> }]} activeTab="a" onChange={setTab} />
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(({ tabs, activeTab, onChange, className = "", ...rest }, ref) => {
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const select = (index: number) => {
    const tab = tabs[index];
    if (!tab) return;
    onChange(tab.id);
    buttons.current.get(tab.id)?.focus();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const current = tabs.findIndex((t) => t.id === activeTab);
    const next: Record<string, number> = {
      ArrowRight: (current + 1) % tabs.length,
      ArrowLeft: (current - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    select(next[e.key]);
  };
  return (
    <div ref={ref} className={cx("strand-tabs", className)} {...rest}>
      <div role="tablist" onKeyDown={onKeyDown}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) buttons.current.set(tab.id, el);
                else buttons.current.delete(tab.id);
              }}
              id={`tab-${tab.id}`}
              role="tab"
              type="button"
              className={cx("strand-tabs__tab", isActive && "strand-tabs__tab--active")}
              aria-selected={isActive ? "true" : "false"}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} id={`panel-${tab.id}`} role="tabpanel" aria-labelledby={`tab-${tab.id}`} hidden={tab.id !== activeTab} tabIndex={0}>
          {tab.content}
        </div>
      ))}
    </div>
  );
});
Tabs.displayName = "Tabs";

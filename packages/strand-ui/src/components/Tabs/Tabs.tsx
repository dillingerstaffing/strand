/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useId, useRef, useState } from "preact/hooks";
import { cx } from "../../internal/index.js";

export interface TabItem {
  id: string;
  label: string;
  content: ComponentChildren;
}

export interface TabsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: TabItem[];
  /** Active tab id; leave unset to let the tabs own it. */
  activeTab?: string;
  /** Initial tab of uncontrolled tabs; the first tab by default. */
  defaultActiveTab?: string;
  onChange?: (id: string) => void;
  /** `automatic` selects as the arrows move focus; `manual` moves focus only and selects on Enter or Space. */
  activation?: "automatic" | "manual";
  /** `instrument` renders the strip as a mono uppercase readout. */
  variant?: "default" | "instrument";
}

/**
 * Tabbed content switcher with the ARIA tabs pattern: arrows, Home and End move between tabs.
 *
 * @example
 * <Tabs tabs={[{ id: "a", label: "A", content: <p>A</p> }]} activeTab="a" onChange={setTab} />
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, activeTab, defaultActiveTab, onChange, activation = "automatic", variant = "default", className = "", ...rest }, ref) => {
    const base = useId();
    const buttons = useRef(new Map<string, HTMLButtonElement>());
    const [ownActive, setOwnActive] = useState(defaultActiveTab ?? tabs[0]?.id);
    const active = activeTab ?? ownActive;
    const select = (id: string) => {
      if (activeTab === undefined) setOwnActive(id);
      onChange?.(id);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const focused = tabs.findIndex((t) => buttons.current.get(t.id) === e.target);
      const current = focused >= 0 ? focused : tabs.findIndex((t) => t.id === active);
      const next: Record<string, number> = {
        ArrowRight: (current + 1) % tabs.length,
        ArrowLeft: (current - 1 + tabs.length) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      if (!(e.key in next)) return;
      e.preventDefault();
      const tab = tabs[next[e.key]];
      if (!tab) return;
      if (activation === "automatic") select(tab.id);
      buttons.current.get(tab.id)?.focus();
    };
    return (
      <div ref={ref} className={cx("strand-tabs", variant !== "default" && `strand-tabs--${variant}`, className)} {...rest}>
        <div role="tablist" onKeyDown={onKeyDown}>
          {tabs.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) buttons.current.set(tab.id, el);
                  else buttons.current.delete(tab.id);
                }}
                id={`${base}-tab-${tab.id}`}
                role="tab"
                type="button"
                className="strand-tabs__tab"
                aria-selected={isActive ? "true" : "false"}
                aria-controls={`${base}-panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        {tabs.map((tab) => (
          <div key={tab.id} id={`${base}-panel-${tab.id}`} role="tabpanel" aria-labelledby={`${base}-tab-${tab.id}`} hidden={tab.id !== active} tabIndex={0}>
            {tab.content}
          </div>
        ))}
      </div>
    );
  },
);
Tabs.displayName = "Tabs";

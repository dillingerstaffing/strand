/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useRef, useCallback } from "preact/hooks";

export interface TabItem {
  id: string;
  label: string;
  content: ComponentChildren;
}

export interface TabsProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Tab definitions */
  tabs: TabItem[];
  /** Currently active tab id (controlled) */
  activeTab: string;
  /** Called when active tab changes */
  onChange: (id: string) => void;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, activeTab, onChange, className = "", ...rest }, ref) => {
    const tablistRef = useRef<HTMLDivElement>(null);

    const classes = ["strand-tabs", className].filter(Boolean).join(" ");

    const focusAndSelect = useCallback(
      (index: number) => {
        const tab = tabs[index];
        if (tab) {
          onChange(tab.id);
          const buttons =
            tablistRef.current?.querySelectorAll<HTMLButtonElement>(
              '[role="tab"]',
            );
          buttons?.[index]?.focus();
        }
      },
      [tabs, onChange],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        const currentIndex = tabs.findIndex((t) => t.id === activeTab);
        let nextIndex: number | null = null;

        switch (e.key) {
          case "ArrowRight":
            nextIndex = (currentIndex + 1) % tabs.length;
            break;
          case "ArrowLeft":
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            break;
          case "Home":
            nextIndex = 0;
            break;
          case "End":
            nextIndex = tabs.length - 1;
            break;
          default:
            return;
        }

        e.preventDefault();
        focusAndSelect(nextIndex);
      },
      [tabs, activeTab, focusAndSelect],
    );

    return (
      <div ref={ref} className={classes} {...rest}>
        <div
          ref={tablistRef}
          role="tablist"
          onKeyDown={handleKeyDown}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const buttonClasses = [
              "strand-tabs__tab",
              isActive && "strand-tabs__tab--active",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                type="button"
                className={buttonClasses}
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

        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <div
              key={tab.id}
              id={`panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              hidden={!isActive}
              tabIndex={0}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    );
  },
);

Tabs.displayName = "Tabs";

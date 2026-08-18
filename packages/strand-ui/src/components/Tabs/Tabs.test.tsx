import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Tabs } from "./Tabs.js";

const sampleTabs = [
  { id: "one", label: "Tab One", content: <div>Content One</div> },
  { id: "two", label: "Tab Two", content: <div>Content Two</div> },
  { id: "three", label: "Tab Three", content: <div>Content Three</div> },
];

describe("Tabs", () => {
  it("renders a tablist whose selected tab is the only one in the tab order and whose panel is the only one shown", () => {
    const { getAllByRole, getByRole } = render(<Tabs tabs={sampleTabs} activeTab="two" onChange={() => {}} />);
    expect(getByRole("tablist")).toBeTruthy();
    const tabs = getAllByRole("tab");
    expect(tabs.map((t) => t.getAttribute("aria-selected"))).toEqual(["false", "true", "false"]);
    expect(tabs.map((t) => t.tabIndex)).toEqual([-1, 0, -1]);
    const panels = getAllByRole("tabpanel", { hidden: true });
    expect(panels.map((p) => p.hidden)).toEqual([true, false, true]);
  });

  it("wires each panel to its tab with ids that do not collide across two sets", () => {
    const { container } = render(
      <div>
        <Tabs tabs={sampleTabs} activeTab="one" onChange={() => {}} />
        <Tabs tabs={sampleTabs} activeTab="one" onChange={() => {}} />
      </div>,
    );
    const tabs = Array.from(container.querySelectorAll('[role="tab"]'));
    const ids = tabs.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const tab of tabs) {
      const panel = container.querySelector(`#${CSS.escape(tab.getAttribute("aria-controls") as string)}`);
      expect(panel?.getAttribute("aria-labelledby")).toBe(tab.id);
    }
  });

  it("clicking a tab calls onChange with its id", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(<Tabs tabs={sampleTabs} activeTab="one" onChange={onChange} />);
    fireEvent.click(getAllByRole("tab")[1]);
    expect(onChange).toHaveBeenCalledWith("two");
  });

  it("owns the selection when uncontrolled: the first tab, or defaultActiveTab, then whatever is clicked", () => {
    const { getAllByRole } = render(<Tabs tabs={sampleTabs} defaultActiveTab="three" />);
    const tabs = getAllByRole("tab");
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    fireEvent.click(tabs[0]);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[2]).toHaveAttribute("aria-selected", "false");
    const first = render(<Tabs tabs={sampleTabs} />);
    expect(first.getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
  });

  it("the arrows, Home and End select and focus, wrapping at the ends", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(<Tabs tabs={sampleTabs} activeTab="one" onChange={onChange} />);
    const tabs = getAllByRole("tab");
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("two");
    expect(document.activeElement).toBe(tabs[1]);
    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith("three");
    fireEvent.keyDown(tabs[0], { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith("three");
    fireEvent.keyDown(tabs[0], { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith("one");
  });

  it("with manual activation the arrows move focus only, and Enter or Space (a click) selects", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(<Tabs tabs={sampleTabs} activeTab="one" onChange={onChange} activation="manual" />);
    const tabs = getAllByRole("tab");
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(document.activeElement).toBe(tabs[1]);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.keyDown(tabs[1], { key: "ArrowRight" });
    expect(document.activeElement).toBe(tabs[2]);
    fireEvent.click(tabs[2]);
    expect(onChange).toHaveBeenCalledWith("three");
  });

  it("the instrument variant is a class on the root", () => {
    const { container } = render(<Tabs tabs={sampleTabs} variant="instrument" />);
    expect(container.querySelector(".strand-tabs.strand-tabs--instrument")).toBeTruthy();
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./Tabs.fixtures.js";

snapshotFixtures(Tabs, fixtures);

snapshotStylesheet(resolve(__dirname, "./Tabs.css"));

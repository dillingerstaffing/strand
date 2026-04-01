import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Tabs } from "./Tabs.js";

const sampleTabs = [
  { id: "one", label: "Tab One", content: <div>Content One</div> },
  { id: "two", label: "Tab Two", content: <div>Content Two</div> },
  { id: "three", label: "Tab Three", content: <div>Content Three</div> },
];

describe("Tabs", () => {
  // ── Structure ──

  it("renders tablist role", () => {
    const { getByRole } = render(
      <Tabs tabs={sampleTabs} activeTab="one" onChange={() => {}} />,
    );
    expect(getByRole("tablist")).toBeTruthy();
  });

  it("renders tab buttons for each tab", () => {
    const { getAllByRole } = render(
      <Tabs tabs={sampleTabs} activeTab="one" onChange={() => {}} />,
    );
    expect(getAllByRole("tab")).toHaveLength(3);
  });

  // ── Active state ──

  it("active tab has aria-selected true", () => {
    const { getAllByRole } = render(
      <Tabs tabs={sampleTabs} activeTab="one" onChange={() => {}} />,
    );
    const tabs = getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("inactive tabs have aria-selected false", () => {
    const { getAllByRole } = render(
      <Tabs tabs={sampleTabs} activeTab="one" onChange={() => {}} />,
    );
    const tabs = getAllByRole("tab");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    expect(tabs[2]).toHaveAttribute("aria-selected", "false");
  });

  it("active tab has tabindex 0, inactive tabs have tabindex -1", () => {
    const { getAllByRole } = render(
      <Tabs tabs={sampleTabs} activeTab="two" onChange={() => {}} />,
    );
    const tabs = getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("tabindex", "-1");
    expect(tabs[1]).toHaveAttribute("tabindex", "0");
    expect(tabs[2]).toHaveAttribute("tabindex", "-1");
  });

  // ── Interaction ──

  it("clicking tab calls onChange with the tab id", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <Tabs tabs={sampleTabs} activeTab="one" onChange={onChange} />,
    );
    fireEvent.click(getAllByRole("tab")[1]);
    expect(onChange).toHaveBeenCalledWith("two");
  });

  // ── Panels ──

  it("active panel is visible", () => {
    const { getByText } = render(
      <Tabs tabs={sampleTabs} activeTab="one" onChange={() => {}} />,
    );
    expect(getByText("Content One").closest("[role='tabpanel']")).not.toHaveAttribute("hidden");
  });

  it("inactive panels are hidden", () => {
    const { getByText } = render(
      <Tabs tabs={sampleTabs} activeTab="one" onChange={() => {}} />,
    );
    expect(getByText("Content Two").closest("[role='tabpanel']")).toHaveAttribute("hidden");
    expect(getByText("Content Three").closest("[role='tabpanel']")).toHaveAttribute("hidden");
  });

  it("tabpanel has aria-labelledby pointing to its tab", () => {
    const { getAllByRole } = render(
      <Tabs tabs={sampleTabs} activeTab="one" onChange={() => {}} />,
    );
    const panels = getAllByRole("tabpanel", { hidden: true });
    expect(panels[0]).toHaveAttribute("aria-labelledby", "tab-one");
  });

  // ── Keyboard navigation ──

  it("ArrowRight moves to next tab", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <Tabs tabs={sampleTabs} activeTab="one" onChange={onChange} />,
    );
    fireEvent.keyDown(getAllByRole("tab")[0], { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("two");
  });

  it("ArrowLeft moves to previous tab", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <Tabs tabs={sampleTabs} activeTab="two" onChange={onChange} />,
    );
    fireEvent.keyDown(getAllByRole("tab")[1], { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith("one");
  });

  it("ArrowRight wraps to first tab from last", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <Tabs tabs={sampleTabs} activeTab="three" onChange={onChange} />,
    );
    fireEvent.keyDown(getAllByRole("tab")[2], { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("one");
  });

  it("ArrowLeft wraps to last tab from first", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <Tabs tabs={sampleTabs} activeTab="one" onChange={onChange} />,
    );
    fireEvent.keyDown(getAllByRole("tab")[0], { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith("three");
  });

  it("Home moves focus to first tab", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <Tabs tabs={sampleTabs} activeTab="three" onChange={onChange} />,
    );
    fireEvent.keyDown(getAllByRole("tab")[2], { key: "Home" });
    expect(onChange).toHaveBeenCalledWith("one");
  });

  it("End moves focus to last tab", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <Tabs tabs={sampleTabs} activeTab="one" onChange={onChange} />,
    );
    fireEvent.keyDown(getAllByRole("tab")[0], { key: "End" });
    expect(onChange).toHaveBeenCalledWith("three");
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { container } = render(
      <Tabs
        tabs={sampleTabs}
        activeTab="one"
        onChange={() => {}}
        className="custom"
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("strand-tabs");
    expect(root.className).toContain("custom");
  });
});

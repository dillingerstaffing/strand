import { resolve } from "node:path";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/preact";
import { Tooltip } from "./Tooltip.js";

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders children", () => {
    const { getByText } = render(
      <Tooltip content="Hint">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    expect(getByText("Hover me")).toBeTruthy();
  });

  it("renders tooltip content text", () => {
    const { container } = render(
      <Tooltip content="Helpful tip">
        <button type="button">Target</button>
      </Tooltip>,
    );
    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).toBeTruthy();
    expect(tooltip!.textContent).toBe("Helpful tip");
  });

  it("tooltip is hidden by default", () => {
    const { container } = render(
      <Tooltip content="Hidden">
        <button type="button">Target</button>
      </Tooltip>,
    );
    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
  });

  it("shows tooltip on mouseenter after delay", () => {
    const { container } = render(
      <Tooltip content="Visible" delay={100}>
        <button type="button">Target</button>
      </Tooltip>,
    );
    const wrapper = container.querySelector(".strand-tooltip__wrapper")!;
    const tooltip = container.querySelector('[role="tooltip"]')!;

    fireEvent.mouseEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(tooltip).toHaveAttribute("aria-hidden", "false");
  });

  it("hides tooltip on mouseleave", () => {
    const { container } = render(
      <Tooltip content="Gone" delay={100}>
        <button type="button">Target</button>
      </Tooltip>,
    );
    const wrapper = container.querySelector(".strand-tooltip__wrapper")!;
    const tooltip = container.querySelector('[role="tooltip"]')!;

    fireEvent.mouseEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(tooltip).toHaveAttribute("aria-hidden", "false");

    fireEvent.mouseLeave(wrapper);
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
  });

  it("shows for a keyboard user when the trigger takes focus, and hides when it leaves", () => {
    const { container } = render(
      <Tooltip content="Focused" delay={100}>
        <button type="button">Target</button>
      </Tooltip>,
    );
    const button = container.querySelector("button")!;
    const tooltip = container.querySelector('[role="tooltip"]')!;
    act(() => {
      button.focus();
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(tooltip).toHaveAttribute("aria-hidden", "false");
    act(() => {
      button.blur();
    });
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
  });

  it("tooltip has role tooltip", () => {
    const { container } = render(
      <Tooltip content="Accessible">
        <button type="button">Target</button>
      </Tooltip>,
    );
    expect(container.querySelector('[role="tooltip"]')).toBeTruthy();
  });

  it("the trigger element itself is described by the tooltip", () => {
    const { container } = render(
      <Tooltip content="Described">
        <button type="button">Target</button>
      </Tooltip>,
    );
    const button = container.querySelector("button")!;
    const tooltip = container.querySelector('[role="tooltip"]')!;
    expect(button).toHaveAttribute("aria-describedby", tooltip.getAttribute("id"));
    expect(container.querySelector(".strand-tooltip__wrapper")).not.toHaveAttribute("aria-describedby");
  });

  it("describes through the wrapper when the trigger is plain text", () => {
    const { container } = render(<Tooltip content="Described">Target</Tooltip>);
    const tooltip = container.querySelector('[role="tooltip"]')!;
    expect(container.querySelector(".strand-tooltip__wrapper")).toHaveAttribute("aria-describedby", tooltip.getAttribute("id"));
  });

  it("Escape dismisses an open tooltip and reports the change", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Tooltip content="Dismiss me" delay={0} onOpenChange={onOpenChange}>
        <button type="button">Target</button>
      </Tooltip>,
    );
    const wrapper = container.querySelector(".strand-tooltip__wrapper")!;
    const tooltip = container.querySelector('[role="tooltip"]')!;
    act(() => {
      container.querySelector("button")!.focus();
    });
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(tooltip).toHaveAttribute("aria-hidden", "false");
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    fireEvent.keyDown(wrapper, { key: "Escape" });
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("a controlled tooltip shows what its owner says, whatever the pointer does", () => {
    const { container, rerender } = render(
      <Tooltip content="Owned" open={true}>
        <button type="button">Target</button>
      </Tooltip>,
    );
    const tooltip = container.querySelector('[role="tooltip"]')!;
    expect(tooltip).toHaveAttribute("aria-hidden", "false");
    fireEvent.mouseLeave(container.querySelector(".strand-tooltip__wrapper")!);
    expect(tooltip).toHaveAttribute("aria-hidden", "false");
    rerender(
      <Tooltip content="Owned" open={false}>
        <button type="button">Target</button>
      </Tooltip>,
    );
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
  });

  it("starts open when asked, and still closes on leave", () => {
    const { container } = render(
      <Tooltip content="Open first" defaultOpen>
        <button type="button">Target</button>
      </Tooltip>,
    );
    const tooltip = container.querySelector('[role="tooltip"]')!;
    expect(tooltip).toHaveAttribute("aria-hidden", "false");
    fireEvent.mouseLeave(container.querySelector(".strand-tooltip__wrapper")!);
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
  });

  it("cancels show if mouseleave before delay completes", () => {
    const { container } = render(
      <Tooltip content="Cancelled" delay={300}>
        <button type="button">Target</button>
      </Tooltip>,
    );
    const wrapper = container.querySelector(".strand-tooltip__wrapper")!;
    const tooltip = container.querySelector('[role="tooltip"]')!;

    fireEvent.mouseEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    fireEvent.mouseLeave(wrapper);
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(tooltip).toHaveAttribute("aria-hidden", "true");
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./Tooltip.fixtures.js";

snapshotFixtures(Tooltip, fixtures);

snapshotStylesheet(resolve(__dirname, "./Tooltip.css"));

import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Button } from "./Button.js";

describe("Button", () => {
  // ── Rendering ──

  it("renders with children text", () => {
    const { getByRole } = render(<Button>Click me</Button>);
    expect(getByRole("button")).toHaveTextContent("Click me");
  });

  it("renders as a button element by default", () => {
    const { getByRole } = render(<Button>Test</Button>);
    expect(getByRole("button").tagName).toBe("BUTTON");
  });

  it("has type='button' by default to prevent form submission", () => {
    const { getByRole } = render(<Button>Test</Button>);
    expect(getByRole("button")).toHaveAttribute("type", "button");
  });

  it("allows type override to submit", () => {
    const { getByRole } = render(<Button type="submit">Submit</Button>);
    expect(getByRole("button")).toHaveAttribute("type", "submit");
  });

  // ── Variants ──

  // ── Sizes ──

  // ── Icon-only ──

  // ── Interaction ──

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    const { getByRole } = render(
      <Button onClick={onClick} disabled>Click</Button>
    );
    fireEvent.click(getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  // ── Disabled state ──

  it("sets disabled attribute when disabled", () => {
    const { getByRole } = render(<Button disabled>Test</Button>);
    expect(getByRole("button")).toBeDisabled();
  });

  it("sets aria-disabled when disabled", () => {
    const { getByRole } = render(<Button disabled>Test</Button>);
    expect(getByRole("button")).toHaveAttribute("aria-disabled", "true");
  });

  // ── Loading state ──

  it("shows loading state", () => {
    const { getByRole } = render(<Button loading>Test</Button>);
    const btn = getByRole("button");
    expect(btn.className).toContain("strand-btn--loading");
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("disables interaction when loading", () => {
    const onClick = vi.fn();
    const { getByRole } = render(
      <Button loading onClick={onClick}>Test</Button>
    );
    fireEvent.click(getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders spinner element when loading", () => {
    const { container } = render(<Button loading>Test</Button>);
    expect(container.querySelector(".strand-btn__spinner")).toBeTruthy();
  });

  // ── Accessibility ──

  it("is focusable via keyboard", () => {
    const { getByRole } = render(<Button>Test</Button>);
    const btn = getByRole("button");
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it("is not focusable when disabled", () => {
    const { getByRole } = render(<Button disabled>Test</Button>);
    const btn = getByRole("button");
    expect(btn).toBeDisabled();
  });

  it("supports aria-label", () => {
    const { getByRole } = render(<Button aria-label="Close dialog">X</Button>);
    expect(getByRole("button")).toHaveAttribute("aria-label", "Close dialog");
  });

  it("forwards additional props", () => {
    const { getByRole } = render(
      <Button data-testid="custom" id="my-btn">Test</Button>
    );
    expect(getByRole("button")).toHaveAttribute("id", "my-btn");
  });

  // ── Custom className ──

  // ── Full width ──

  // ── Anchor (link styled as a button) ──

  it("renders an anchor with the button classes when href is given", () => {
    const { getByRole } = render(<Button href="/go">Go</Button>);
    const link = getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/go");
    expect(link.className).toContain("strand-btn");
    expect(link.className).toContain("strand-btn--primary");
  });

  it("wraps anchor children in the strand-btn__content span", () => {
    const { getByRole } = render(<Button href="/go">Go</Button>);
    expect(
      getByRole("link").querySelector(".strand-btn__content"),
    ).toBeTruthy();
  });

  it("forwards anchor attributes (target, rel, download)", () => {
    const { getByRole } = render(
      <Button href="/f.ics" download="f.ics" target="_blank" rel="noopener">
        Download
      </Button>,
    );
    const link = getByRole("link");
    expect(link).toHaveAttribute("download", "f.ics");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("drops href and marks aria-disabled when a disabled anchor", () => {
    const { getByText } = render(
      <Button href="/go" disabled>
        Go
      </Button>,
    );
    const link = getByText("Go").closest("a");
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./Button.fixtures.js";

snapshotFixtures(Button, fixtures);

snapshotStylesheet(resolve(__dirname, "./Button.css"));

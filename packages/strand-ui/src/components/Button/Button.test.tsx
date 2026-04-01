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

  it("applies primary variant class by default", () => {
    const { getByRole } = render(<Button>Test</Button>);
    expect(getByRole("button").className).toContain("strand-btn--primary");
  });

  it("applies secondary variant class", () => {
    const { getByRole } = render(<Button variant="secondary">Test</Button>);
    expect(getByRole("button").className).toContain("strand-btn--secondary");
  });

  it("applies ghost variant class", () => {
    const { getByRole } = render(<Button variant="ghost">Test</Button>);
    expect(getByRole("button").className).toContain("strand-btn--ghost");
  });

  it("applies danger variant class", () => {
    const { getByRole } = render(<Button variant="danger">Test</Button>);
    expect(getByRole("button").className).toContain("strand-btn--danger");
  });

  // ── Sizes ──

  it("applies md size class by default", () => {
    const { getByRole } = render(<Button>Test</Button>);
    expect(getByRole("button").className).toContain("strand-btn--md");
  });

  it("applies sm size class", () => {
    const { getByRole } = render(<Button size="sm">Test</Button>);
    expect(getByRole("button").className).toContain("strand-btn--sm");
  });

  it("applies lg size class", () => {
    const { getByRole } = render(<Button size="lg">Test</Button>);
    expect(getByRole("button").className).toContain("strand-btn--lg");
  });

  // ── Icon-only ──

  it("applies icon-only class when iconOnly is true", () => {
    const { getByRole } = render(
      <Button iconOnly aria-label="Close">X</Button>
    );
    expect(getByRole("button").className).toContain("strand-btn--icon-only");
  });

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

  it("merges custom className with component classes", () => {
    const { getByRole } = render(<Button className="custom">Test</Button>);
    const btn = getByRole("button");
    expect(btn.className).toContain("strand-btn");
    expect(btn.className).toContain("custom");
  });

  // ── Full width ──

  it("applies full-width class when fullWidth is true", () => {
    const { getByRole } = render(<Button fullWidth>Test</Button>);
    expect(getByRole("button").className).toContain("strand-btn--full-width");
  });
});

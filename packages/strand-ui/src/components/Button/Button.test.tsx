import { resolve } from "node:path";
import { readFileSync } from "node:fs";
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

  // ── Gap #106: chrome density was tied to a container, not to the control ──

  it("offers a compact modifier that tightens a word", () => {
    const css = readFileSync(resolve(__dirname, "Button.css"), "utf8");
    expect(css).toMatch(/\.strand-btn--compact:not\(\.strand-btn--icon-only\)/);
  });

  it("never compacts an icon-only button, which would deform it into a pill", () => {
    // #100 is exactly this mistake made once: a declaration written for a word
    // applied to a shape measured 58x34 where the design draws a 34 circle.
    // The exclusion is in the selector rather than in source order, so it holds
    // however the stylesheets are concatenated.
    const css = readFileSync(resolve(__dirname, "Button.css"), "utf8");
    const compact = css.match(/\.strand-btn--compact[^{]*\{([^}]*)\}/)?.[1] || "";
    expect(compact).toMatch(/padding-inline/);
    expect(compact, "compact is horizontal noise, not a touch-target decision").not.toMatch(
      /min-height|min-block-size/,
    );
  });
  // The 44px floor used to be unconditional on every size, so a consumer
  // needing the design's 34px secondary control could only override
  // `.strand-btn`. The default is unchanged; what is new is that it can be
  // answered without an override.
  it("floors at the touch target by default, and lets a token lower it", () => {
    const css = readFileSync(resolve(__dirname, "Button.css"), "utf8");
    expect(css).toContain("var(--strand-btn-min-block-size, var(--strand-touch-target))");
    // The bare floor is what made a compact control unreachable.
    expect(css).not.toMatch(/min-height:\s*var\(--strand-touch-target\)\s*;/);
  });
});

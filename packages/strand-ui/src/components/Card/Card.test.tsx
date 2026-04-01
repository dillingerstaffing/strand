import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Card } from "./Card.js";

describe("Card", () => {
  // ── Rendering ──

  it("renders a div element", () => {
    const { container } = render(<Card>Content</Card>);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("DIV");
  });

  it("renders children", () => {
    const { getByText } = render(<Card>Hello world</Card>);
    expect(getByText("Hello world")).toBeTruthy();
  });

  // ── Variants ──

  it("applies elevated variant class by default", () => {
    const { container } = render(<Card>Test</Card>);
    expect(container.firstElementChild?.className).toContain(
      "strand-card--elevated",
    );
  });

  it("applies outlined variant class", () => {
    const { container } = render(<Card variant="outlined">Test</Card>);
    expect(container.firstElementChild?.className).toContain(
      "strand-card--outlined",
    );
  });

  it("applies interactive variant class with cursor pointer", () => {
    const { container } = render(<Card variant="interactive">Test</Card>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-card--interactive");
  });

  // ── Padding ──

  it("applies md padding class by default", () => {
    const { container } = render(<Card>Test</Card>);
    expect(container.firstElementChild?.className).toContain(
      "strand-card--pad-md",
    );
  });

  it("applies none padding class", () => {
    const { container } = render(<Card padding="none">Test</Card>);
    expect(container.firstElementChild?.className).toContain(
      "strand-card--pad-none",
    );
  });

  it("applies sm padding class", () => {
    const { container } = render(<Card padding="sm">Test</Card>);
    expect(container.firstElementChild?.className).toContain(
      "strand-card--pad-sm",
    );
  });

  it("applies lg padding class", () => {
    const { container } = render(<Card padding="lg">Test</Card>);
    expect(container.firstElementChild?.className).toContain(
      "strand-card--pad-lg",
    );
  });

  // ── Custom className ──

  it("merges custom className with component classes", () => {
    const { container } = render(<Card className="custom">Test</Card>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-card");
    expect(el?.className).toContain("custom");
  });

  // ── Props forwarding ──

  it("forwards additional props", () => {
    const { container } = render(
      <Card data-testid="my-card" id="card-1">
        Test
      </Card>,
    );
    expect(container.firstElementChild?.getAttribute("id")).toBe("card-1");
  });
});

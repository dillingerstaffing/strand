import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Container } from "./Container.js";

describe("Container", () => {
  // ── Rendering ──

  it("renders a div element", () => {
    const { container } = render(<Container>content</Container>);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("renders children", () => {
    const { getByText } = render(
      <Container>
        <p>Hello world</p>
      </Container>,
    );
    expect(getByText("Hello world")).toBeTruthy();
  });

  // ── Size variants ──

  it("applies default size class by default", () => {
    const { container } = render(<Container>content</Container>);
    expect(container.firstElementChild?.className).toContain(
      "strand-container--default",
    );
  });

  it("applies narrow size class", () => {
    const { container } = render(<Container size="narrow">content</Container>);
    expect(container.firstElementChild?.className).toContain(
      "strand-container--narrow",
    );
  });

  it("applies wide size class", () => {
    const { container } = render(<Container size="wide">content</Container>);
    expect(container.firstElementChild?.className).toContain(
      "strand-container--wide",
    );
  });

  it("applies full size class", () => {
    const { container } = render(<Container size="full">content</Container>);
    expect(container.firstElementChild?.className).toContain(
      "strand-container--full",
    );
  });

  // ── Base class ──

  it("has base container class for auto margin", () => {
    const { container } = render(<Container>content</Container>);
    expect(container.firstElementChild?.className).toContain(
      "strand-container",
    );
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { container } = render(
      <Container className="custom">content</Container>,
    );
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-container");
    expect(el?.className).toContain("custom");
  });

  // ── Props forwarding ──

  it("forwards additional props", () => {
    const { container } = render(
      <Container data-testid="my-container" id="c1">
        content
      </Container>,
    );
    expect(container.firstElementChild).toHaveAttribute("id", "c1");
  });
});

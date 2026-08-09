import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Stack } from "./Stack.js";

describe("Stack", () => {
  // ── Rendering ──

  it("renders a div element", () => {
    const { container } = render(<Stack>content</Stack>);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("renders children", () => {
    const { getByText } = render(
      <Stack>
        <span>Child A</span>
        <span>Child B</span>
      </Stack>,
    );
    expect(getByText("Child A")).toBeTruthy();
    expect(getByText("Child B")).toBeTruthy();
  });

  // ── Direction ──

  it("applies vertical direction class by default", () => {
    const { container } = render(<Stack>content</Stack>);
    expect(container.firstElementChild?.className).toContain(
      "strand-stack--vertical",
    );
  });

  it("applies horizontal direction class", () => {
    const { container } = render(
      <Stack direction="horizontal">content</Stack>,
    );
    expect(container.firstElementChild?.className).toContain(
      "strand-stack--horizontal",
    );
  });

  // ── Gap ──

  it("applies default gap as the strand-stack--gap-4 primitive class", () => {
    const { container } = render(<Stack>content</Stack>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("strand-stack--gap-4");
    expect(el.style.gap).toBe("");
  });

  it("applies custom gap as the strand-stack--gap-{n} primitive class", () => {
    const { container } = render(<Stack gap={8}>content</Stack>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("strand-stack--gap-8");
    expect(el.style.gap).toBe("");
  });

  it("supports a zero gap via strand-stack--gap-0", () => {
    const { container } = render(<Stack gap={0}>content</Stack>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("strand-stack--gap-0");
    expect(el.style.gap).toBe("");
  });

  // ── Alignment ──

  it("applies align-center class", () => {
    const { container } = render(<Stack align="center">content</Stack>);
    expect(container.firstElementChild?.className).toContain(
      "strand-stack--align-center",
    );
  });

  it("applies align-start class", () => {
    const { container } = render(<Stack align="start">content</Stack>);
    expect(container.firstElementChild?.className).toContain(
      "strand-stack--align-start",
    );
  });

  it("does not apply alignment class for default stretch", () => {
    const { container } = render(<Stack>content</Stack>);
    expect(container.firstElementChild?.className).not.toContain(
      "strand-stack--align-",
    );
  });

  // ── Justification ──

  it("applies justify-between class", () => {
    const { container } = render(<Stack justify="between">content</Stack>);
    expect(container.firstElementChild?.className).toContain(
      "strand-stack--justify-between",
    );
  });

  it("applies justify-center class", () => {
    const { container } = render(<Stack justify="center">content</Stack>);
    expect(container.firstElementChild?.className).toContain(
      "strand-stack--justify-center",
    );
  });

  // ── Wrap ──

  it("applies wrap class when wrap is true", () => {
    const { container } = render(<Stack wrap>content</Stack>);
    expect(container.firstElementChild?.className).toContain(
      "strand-stack--wrap",
    );
  });

  it("does not apply wrap class by default", () => {
    const { container } = render(<Stack>content</Stack>);
    expect(container.firstElementChild?.className).not.toContain(
      "strand-stack--wrap",
    );
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { container } = render(<Stack className="custom">content</Stack>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-stack");
    expect(el?.className).toContain("custom");
  });

  // ── Props forwarding ──

  it("forwards additional props", () => {
    const { container } = render(
      <Stack data-testid="my-stack" id="s1">
        content
      </Stack>,
    );
    expect(container.firstElementChild).toHaveAttribute("id", "s1");
  });

  // ── Polymorphic element ──

  it("renders a div by default", () => {
    const { container } = render(<Stack>content</Stack>);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("renders the semantic element given by the as prop", () => {
    const { container } = render(<Stack as="ul">content</Stack>);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("UL");
    expect(el?.className).toContain("strand-stack");
  });
});

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Grid } from "./Grid.js";

describe("Grid", () => {
  // ── Rendering ──

  it("renders a div element", () => {
    const { container } = render(<Grid>content</Grid>);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("renders children in grid", () => {
    const { getByText } = render(
      <Grid>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Grid>,
    );
    expect(getByText("Item 1")).toBeTruthy();
    expect(getByText("Item 2")).toBeTruthy();
    expect(getByText("Item 3")).toBeTruthy();
  });

  // ── Display ──

  it("has display grid class", () => {
    const { container } = render(<Grid>content</Grid>);
    expect(container.firstElementChild?.className).toContain("strand-grid");
  });

  // ── Columns ──

  it("defaults to 1 column in inline style", () => {
    const { container } = render(<Grid>content</Grid>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe("repeat(1, 1fr)");
  });

  it("applies custom column count in inline style", () => {
    const { container } = render(<Grid columns={3}>content</Grid>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe("repeat(3, 1fr)");
  });

  it("applies 4-column layout", () => {
    const { container } = render(<Grid columns={4}>content</Grid>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe("repeat(4, 1fr)");
  });

  // ── Gap ──

  it("applies default gap as inline style", () => {
    const { container } = render(<Grid>content</Grid>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gap).toBe("var(--strand-space-4)");
  });

  it("applies custom gap as inline style", () => {
    const { container } = render(<Grid gap={8}>content</Grid>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gap).toBe("var(--strand-space-8)");
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { container } = render(<Grid className="custom">content</Grid>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-grid");
    expect(el?.className).toContain("custom");
  });

  // ── Props forwarding ──

  it("forwards additional props", () => {
    const { container } = render(
      <Grid data-testid="my-grid" id="g1">
        content
      </Grid>,
    );
    expect(container.firstElementChild).toHaveAttribute("id", "g1");
  });
});

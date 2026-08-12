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

  // ── Auto-fit (minColWidth) ──

  it("renders a responsive auto-fit track when minColWidth is set", () => {
    const { container } = render(<Grid minColWidth={220}>content</Grid>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe(
      "repeat(auto-fit, minmax(220px, 1fr))",
    );
  });

  it("lets minColWidth win over columns (auto-fit, not fixed count)", () => {
    const { container } = render(
      <Grid columns={3} minColWidth={220}>
        content
      </Grid>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe(
      "repeat(auto-fit, minmax(220px, 1fr))",
    );
  });

  it("keeps the gap alongside an auto-fit track", () => {
    const { container } = render(
      <Grid minColWidth={220} gap={3}>
        content
      </Grid>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe(
      "repeat(auto-fit, minmax(220px, 1fr))",
    );
    expect(el.style.gap).toBe("var(--strand-space-3)");
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

  // ── Sidebar preset ──
  //
  // The library made this decision three times privately (.strand-ref-shell
  // at 256px, .strand-ref-example at 200px, .strand-ref-taxonomy__list at
  // 160px) and published none of them. Its GEOMETRY -- 264px beside a
  // flexible track at desktop, one column below md -- is asserted in the
  // layout tier, because jsdom neither lays out nor resolves media queries.

  it("renders the sidebar preset as a class, not an inline template", () => {
    // The column definition changes at a breakpoint and an inline style
    // cannot carry a media query, so emitting one here would produce a
    // declaration the stylesheet then has to fight at every width.
    const { container } = render(<Grid sidebar />);
    const grid = container.querySelector(".strand-grid") as HTMLElement;
    expect(grid.classList.contains("strand-grid--sidebar")).toBe(true);
    expect(grid.style.gridTemplateColumns).toBe("");
  });

  it("keeps the gap when the sidebar preset owns the columns", () => {
    const { container } = render(<Grid sidebar gap={6} />);
    const grid = container.querySelector(".strand-grid") as HTMLElement;
    expect(grid.style.gap).toBe("var(--strand-space-6)");
  });

  it("lets the sidebar preset win over columns and minColWidth", () => {
    // A sidebar layout is a statement about the TRACKS rather than about
    // how many of them there are, so a stale `columns` must not leak an
    // inline template that overrides the preset.
    const { container } = render(<Grid sidebar columns={4} minColWidth={220} />);
    const grid = container.querySelector(".strand-grid") as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe("");
    expect(grid.classList.contains("strand-grid--sidebar")).toBe(true);
  });

  it("does not apply the preset unless asked", () => {
    const { container } = render(<Grid columns={2} />);
    const grid = container.querySelector(".strand-grid") as HTMLElement;
    expect(grid.classList.contains("strand-grid--sidebar")).toBe(false);
    expect(grid.style.gridTemplateColumns).toBe("repeat(2, 1fr)");
  });
});

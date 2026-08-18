import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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
    expect(el.style.gridTemplateColumns).toBe("repeat(1, minmax(0, 1fr))");
  });

  it("applies custom column count in inline style", () => {
    const { container } = render(<Grid columns={3}>content</Grid>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe("repeat(3, minmax(0, 1fr))");
  });

  it("applies 4-column layout", () => {
    const { container } = render(<Grid columns={4}>content</Grid>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe("repeat(4, minmax(0, 1fr))");
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
    expect(grid.style.gridTemplateColumns).toBe("repeat(2, minmax(0, 1fr))");
  });

  it("renders the split preset as a class, not an inline template", () => {
    const { container } = render(<Grid split />);
    const grid = container.querySelector(".strand-grid") as HTMLElement;
    expect(grid.classList.contains("strand-grid--split")).toBe(true);
    expect(grid.style.gridTemplateColumns).toBe("");
  });

  it("lets the split preset win over columns and minColWidth", () => {
    const { container } = render(<Grid split columns={4} minColWidth={220} />);
    expect(
      (container.querySelector(".strand-grid") as HTMLElement).style.gridTemplateColumns,
    ).toBe("");
  });

  it("does not apply the split preset unless asked", () => {
    const { container } = render(<Grid columns={2} />);
    expect(
      container.querySelector(".strand-grid")?.classList.contains("strand-grid--split"),
    ).toBe(false);
  });
});

// ── Gap #114: the grid was clipping its children's hover affordance ──
//
// THESE READ THE STYLESHEET, and that is the only tier that can see this.
// Clipping is a PAINT operation: it changes no box, so `getBoundingClientRect`
// is identical either way and the browser layout tier is as blind to it as
// jsdom. The regression this guards against is a one-word edit, so the source
// is where it has to be caught. Same instrument, same reason, as gap #113's
// clipped-not-hidden label guard.
describe("Grid CSS source", () => {
  // COMMENTS ARE STRIPPED FIRST, and this is not tidiness. The first version
  // of the no-clip guard below read the raw file and failed against its own
  // explanatory comment, which contains the word "overflow" in prose. A source
  // guard that matches commentary is measuring what a rule SAYS instead of
  // what it DOES, and it fails and passes for the wrong reasons in both
  // directions.
  const css = readFileSync(resolve(__dirname, "Grid.css"), "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  const ruleFor = (sel: string) =>
    css.match(new RegExp(`\\${sel}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

  it("reads declarations rather than commentary", () => {
    // The guard on the guard. If the comment stripper stops working, the
    // no-clip assertion starts reading prose again, and it would have caught
    // that on the day rather than the next time someone edits this file.
    expect(css).not.toContain("/*");
    expect(ruleFor(".strand-grid")).toContain("display: grid");
  });

  it("does not clip, because a layout primitive has no padding zone to protect", () => {
    // 10.4 gives two remedies for two kinds of thing: Container components
    // clip, layout primitives set `min-width: 0` on their children. A grid is
    // the second. Clipping it protected nothing and cut the hover lift and
    // shadow that Part XI mandates off any child sitting on its edge.
    expect(ruleFor(".strand-grid")).not.toMatch(/overflow/);
  });

  it("still applies 10.4's actual remedy for a layout primitive", () => {
    // The rule above removes a mechanism, so this pins the one that replaces
    // it. Without this pair, deleting BOTH would pass the test above.
    expect(css).toMatch(/\.strand-grid\s*>\s*\*\s*\{[^}]*min-width:\s*0/);
  });

  it("floors no fixed track at min-content, which is what the clip was hiding", () => {
    // A bare `1fr` floors at min-content, so one long unbroken string widened
    // the grid past its container and the clip painted over the result. Every
    // fixed track now carries `minmax(0, 1fr)`, so the protection is
    // structural. Asserted per-utility rather than by counting, so adding a
    // `--cols-5` with a bare `1fr` fails rather than passing on a stale total.
    for (const n of [2, 3, 4]) {
      expect(
        ruleFor(`.strand-grid--cols-${n}`),
        `--cols-${n} must not floor at min-content`,
      ).toContain(`repeat(${n}, minmax(0, 1fr))`);
    }
  });

  // ── The spacing ladder (gap #122) ──

  it("an off-ladder gap resolves to a real token instead of an undefined one", () => {
    // The defect: `gap={7}` wrote `gap: var(--strand-space-7)` inline, the
    // token does not exist, and an undefined custom property invalidates the
    // WHOLE declaration. The grid rendered with no gap.
    const { container } = render(<Grid gap={7}>x</Grid>);
    const style = (container.firstElementChild as HTMLElement).getAttribute("style") || "";
    expect(style).toContain("--strand-space-6");
    expect(style).not.toContain("--strand-space-7");
  });

  it("an on-ladder gap is untouched, so no existing consumer moves", () => {
    const { container } = render(<Grid gap={6}>x</Grid>);
    const style = (container.firstElementChild as HTMLElement).getAttribute("style") || "";
    expect(style).toContain("--strand-space-6");
  });

});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./Grid.fixtures.js";

snapshotFixtures(Grid, fixtures);

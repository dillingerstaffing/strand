import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { SPACING_STEPS } from "../../spacing.js";
import { Stack } from "./Stack.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

  // ── Justification ──

  // ── Wrap ──

  // ── Custom className ──

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

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./Stack.fixtures.js";

snapshotFixtures(Stack, fixtures);

snapshotStylesheet(resolve(__dirname, "./Stack.css"));

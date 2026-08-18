import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Badge } from "./Badge.js";

describe("Badge", () => {
  // ── Rendering ──

  it("renders a span element", () => {
    const { container } = render(<Badge count={5} />);
    expect(container.firstElementChild?.tagName).toBe("SPAN");
  });

  // ── Count variant ──

  it("displays count number", () => {
    const { getByRole } = render(<Badge count={7} />);
    expect(getByRole("status")).toHaveTextContent("7");
  });

  it("truncates count at maxCount", () => {
    const { getByRole } = render(<Badge count={150} maxCount={99} />);
    expect(getByRole("status")).toHaveTextContent("99+");
  });

  it("does not truncate count at maxCount boundary", () => {
    const { getByRole } = render(<Badge count={99} maxCount={99} />);
    expect(getByRole("status")).toHaveTextContent("99");
  });

  it("supports custom maxCount", () => {
    const { getByRole } = render(<Badge count={15} maxCount={9} />);
    expect(getByRole("status")).toHaveTextContent("9+");
  });

  // ── Dot variant ──

  it("renders dot variant as small circle", () => {
    const { container } = render(<Badge variant="dot" />);
    const indicator = container.querySelector(".strand-badge__indicator");
    expect(indicator?.className).toContain("strand-badge--dot");
  });

  // ── Status colors ──

  it("applies default status class by default", () => {
    const { container } = render(<Badge count={1} />);
    const indicator = container.querySelector(".strand-badge__indicator");
    expect(indicator?.className).toContain("strand-badge--default");
  });

  it("applies teal status class", () => {
    const { container } = render(<Badge count={1} status="teal" />);
    const indicator = container.querySelector(".strand-badge__indicator");
    expect(indicator?.className).toContain("strand-badge--teal");
  });

  it("applies red status class", () => {
    const { container } = render(<Badge count={1} status="red" />);
    const indicator = container.querySelector(".strand-badge__indicator");
    expect(indicator?.className).toContain("strand-badge--red");
  });

  it("applies amber status class", () => {
    const { container } = render(<Badge count={1} status="amber" />);
    const indicator = container.querySelector(".strand-badge__indicator");
    expect(indicator?.className).toContain("strand-badge--amber");
  });

  it("applies blue status class", () => {
    const { container } = render(<Badge count={1} status="blue" />);
    const indicator = container.querySelector(".strand-badge__indicator");
    expect(indicator?.className).toContain("strand-badge--blue");
  });

  // ── Children wrapping ──

  it("wraps children and positions badge", () => {
    const { getByText, container } = render(
      <Badge count={3}>
        <span>Inbox</span>
      </Badge>,
    );
    expect(getByText("Inbox")).toBeTruthy();
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("strand-badge");
    expect(wrapper?.className).not.toContain("strand-badge--inline");
  });

  it("renders inline without children", () => {
    const { container } = render(<Badge count={5} />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("strand-badge--inline");
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { container } = render(<Badge count={1} className="custom" />);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-badge");
    expect(el?.className).toContain("custom");
  });

  // ── Accessibility ──

  it("has aria-label for count variant", () => {
    const { getByRole } = render(<Badge count={5} />);
    expect(getByRole("status")).toHaveAttribute(
      "aria-label",
      "5 notifications",
    );
  });

  it("has aria-label for dot variant", () => {
    const { getByRole } = render(<Badge variant="dot" />);
    expect(getByRole("status")).toHaveAttribute(
      "aria-label",
      "Status indicator",
    );
  });
});

// ── Fill contrast (source guard) ──
//
// The indicator paints white at --strand-text-xs (11px), so every badge fill
// carries SMALL text and answers to 4.5:1. The base accent rungs are tuned as
// fills behind large text and do not clear it: teal-vital was 2.49:1,
// blue-primary 3.29:1, red-alert 3.76:1. All three shipped.
//
// They survived the repo's contrast checker because it reads `color:` rules
// and pairs them with the page surfaces the design language sanctions. Here
// the colour and the background live in DIFFERENT rules -- `__indicator` sets
// the text, `--blue` sets the fill -- and are only joined at runtime by class
// composition, which a static pass over CSS cannot see (and deliberately does
// not try to). So the pairing needs a guard where the composition is known,
// which is here.
describe("Badge fills carry small white text at AA", () => {
  const css = readFileSync(resolve(__dirname, "Badge.css"), "utf8");
  const tokensCss = readFileSync(resolve(__dirname, "../../../../tokens/css/tokens.css"), "utf8");

  const tokenValue = (name: string): string => {
    const found = tokensCss.match(new RegExp(`--strand-${name}:\\s*(#[0-9A-Fa-f]{6})`));
    if (!found) throw new Error(`token --strand-${name} not found`);
    return found[1];
  };

  const luminance = (hex: string): number => {
    const channels = [1, 3, 5].map((i) => {
      const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const contrast = (a: string, b: string) => {
    const [x, y] = [luminance(a), luminance(b)];
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };

  // Variants that override the indicator's colour opt out of the white rule
  // and are checked against their own declared text colour instead.
  const rules = [...css.matchAll(/\.strand-badge--([a-z]+)\s*\{([^}]*)\}/g)]
    .map(([, name, body]) => ({
      name,
      fill: body.match(/background:\s*var\(--strand-([a-z0-9-]+)\)/)?.[1],
      text: body.match(/\bcolor:\s*var\(--strand-([a-z0-9-]+)\)/)?.[1],
    }))
    .filter((r) => r.fill);

  const indicatorText = css.match(
    /\.strand-badge__indicator\s*\{[^}]*\bcolor:\s*var\(--strand-([a-z0-9-]+)\)/,
  )?.[1];

  it("finds the variants and the indicator colour (guards the parse itself)", () => {
    // Without this an edit to the CSS shape would yield an empty rule list and
    // every assertion below would pass while checking nothing.
    expect(indicatorText).toBeDefined();
    expect(rules.map((r) => r.name).sort()).toEqual(["amber", "blue", "default", "red", "teal"]);
  });

  for (const variant of ["default", "teal", "blue", "amber", "red"]) {
    it(`${variant} fill reaches 4.5:1 against the text painted on it`, () => {
      const rule = rules.find((r) => r.name === variant);
      if (!rule?.fill) throw new Error(`no fill for ${variant}`);
      const text = tokenValue(rule.text ?? (indicatorText as string));
      expect(contrast(text, tokenValue(rule.fill))).toBeGreaterThanOrEqual(4.5);
    });
  }

  // A dot that is alive rather than merely present. The design language ships
  // the alive signal as `.strand-pulse`, which APPENDS a trailing pseudo-dot,
  // so a leading status dot could not be made live without re-implementing the
  // keyframe at the call site.
  it("pulses when live, and does not when it is not", () => {
    const { container: live } = render(<Badge variant="dot" status="teal" live />);
    expect(live.querySelector(".strand-badge--live")).not.toBeNull();

    const { container: still } = render(<Badge variant="dot" status="teal" />);
    expect(still.querySelector(".strand-badge--live")).toBeNull();
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./Badge.fixtures.js";

snapshotFixtures(Badge, fixtures);

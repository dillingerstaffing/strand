import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { snapshotFixtures } from "../../test/snapshot.js";
import { Badge } from "./Badge.js";
import { fixtures } from "./Badge.fixtures.js";

snapshotFixtures(Badge, fixtures);

// The indicator paints small text; every fill must clear 4.5:1 against it. The
// colour and the fill live in different rules, joined only by composition, so
// the repository's static contrast pass cannot see the pair; this can.
describe("Badge fills carry small text at AA", () => {
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
  const rules = [...css.matchAll(/\.strand-badge--([a-z]+)\s*\{([^}]*)\}/g)]
    .map(([, name, body]) => ({
      name,
      fill: body.match(/background:\s*var\(--strand-([a-z0-9-]+)\)/)?.[1],
      text: body.match(/\bcolor:\s*var\(--strand-([a-z0-9-]+)\)/)?.[1],
    }))
    .filter((r) => r.fill);
  const indicatorText = css.match(/\.strand-badge__indicator\s*\{[^}]*\bcolor:\s*var\(--strand-([a-z0-9-]+)\)/)?.[1];

  it("finds the variants and the indicator colour", () => {
    expect(indicatorText).toBeDefined();
    expect(rules.map((r) => r.name).sort()).toEqual(["amber", "blue", "default", "red", "teal"]);
  });
  for (const variant of ["default", "teal", "blue", "amber", "red"]) {
    it(`${variant} fill reaches 4.5:1 against the text painted on it`, () => {
      const rule = rules.find((r) => r.name === variant);
      if (!rule?.fill) throw new Error(`no fill for ${variant}`);
      expect(contrast(tokenValue(rule.text ?? (indicatorText as string)), tokenValue(rule.fill))).toBeGreaterThanOrEqual(4.5);
    });
  }
});

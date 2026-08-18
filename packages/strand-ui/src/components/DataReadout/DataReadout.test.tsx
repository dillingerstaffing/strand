import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { snapshotFixtures } from "../../test/snapshot.js";
import { DataReadout } from "./DataReadout.js";
import { fixtures } from "./DataReadout.fixtures.js";

snapshotFixtures(DataReadout, fixtures);

// The size API (DL 11.2.1) is a property contract in the stylesheet, which
// jsdom cannot compute, so it is read as text.
describe("size API", () => {
  const css = readFileSync(resolve(__dirname, "./DataReadout.css"), "utf-8");
  it("both sizes read from named properties with the ladder as fallback", () => {
    expect(css).toContain("font-size: var(--strand-data-readout-label-size, var(--strand-text-xs));");
    expect(css).toContain("font-size: var(--strand-data-readout-value-size, var(--strand-text-3xl));");
    const block = css.slice(css.indexOf(".strand-data-readout {"), css.indexOf(".strand-data-readout__label"));
    expect(block).not.toContain("--strand-data-readout-label-size:");
    expect(block).not.toContain("--strand-data-readout-value-size:");
  });
  it("each size modifier sets the value property on the block and never moves the label", () => {
    for (const [modifier, size] of [["sm", "var(--strand-text-xl)"], ["lg", "var(--strand-text-4xl)"], ["xl", "clamp(4.5rem, 10vw, 7rem)"]] as const) {
      expect(css).toContain(`.strand-data-readout--${modifier} {\n  --strand-data-readout-value-size: ${size};\n}`);
      const rule = css.slice(css.indexOf(`.strand-data-readout--${modifier} {`));
      expect(rule.slice(0, rule.indexOf("}"))).not.toContain("label-size");
    }
  });
});

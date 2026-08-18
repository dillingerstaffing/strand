import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// cf: surface-tokens
const dir = resolve(__dirname, "../components");
const sheet = (name: string) => readFileSync(resolve(dir, name, `${name}.css`), "utf8");
const all = readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => {
    try {
      return sheet(d.name);
    } catch {
      return "";
    }
  })
  .concat(readFileSync(resolve(__dirname, "../typography.css"), "utf8"), readFileSync(resolve(__dirname, "../utilities.css"), "utf8"))
  .join("\n");

const block = (css: string, selector: string) => {
  const m = css.match(new RegExp(`${selector.replace(/[.\-]/g, "\\$&")}[^{]*\\{([^}]*)\\}`, "g"));
  return (m ?? []).map((x) => x.replace(/^[^{]*\{/, "").replace(/\}$/, "")).join("\n");
};
const tokensSet = (body: string) => [...body.matchAll(/(--strand-[a-z0-9-]+)\s*:/g)].map((m) => m[1]);

describe("a surface recolours the primitives inside it through their tokens", () => {
  const dark = tokensSet(block(sheet("InstrumentViewport"), ".strand-instrument-viewport,\n.strand-body--instrument"));
  const feature = tokensSet(block(sheet("FeatureSurface"), ".strand-feature-surface"));
  const recessed = tokensSet(block(sheet("Section"), ".strand-section--bg-recessed"));

  it("every token a surface sets is read by a primitive, with a light fallback", () => {
    for (const t of new Set([...dark, ...feature, ...recessed])) {
      expect(all, `${t} is set but nothing reads it`).toMatch(new RegExp(`var\\(${t},`));
    }
  });

  it("no surface reaches into another primitive with a descendant selector", () => {
    const surfaces = ["InstrumentViewport", "FeatureSurface", "Section", "DetailPanel"];
    for (const name of surfaces) {
      const css = sheet(name).replace(/\/\*[\s\S]*?\*\//g, "");
      const reaching = [...css.matchAll(/^\s*\.strand-(?:instrument-viewport|body--instrument|feature-surface|section--bg-recessed|detail-panel)[^,{]*\s\.strand-(?!instrument-viewport__map|detail-panel)[a-z0-9_-]+[^{]*\{([^}]*)\}/gm)]
        .filter((m) => /(^|;)\s*(color|background|background-color|border[a-z-]*|stroke|fill)\s*:/.test(m[1]))
        .map((m) => m[0].split("{")[0].trim());
      expect(reaching, `${name}.css still recolours another primitive by selector`).toEqual([]);
    }
  });

  it("a light island returns every dark token to its light value", () => {
    const island = block(sheet("DetailPanel"), ".strand-detail-panel");
    const utility = block(readFileSync(resolve(__dirname, "../utilities.css"), "utf8"), ".strand-surface-light");
    for (const t of new Set([...dark, ...feature])) {
      expect(island, `.strand-detail-panel does not reset ${t}`).toMatch(new RegExp(`${t}\\s*:`));
      expect(utility, `.strand-surface-light does not reset ${t}`).toMatch(new RegExp(`${t}\\s*:`));
    }
    // A colours-only utility: it sets custom properties and nothing else.
    expect(utility.split(";").map((d) => d.trim()).filter(Boolean).every((d) => d.startsWith("--strand-"))).toBe(true);
  });
});

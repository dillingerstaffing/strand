import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** The selectors a stylesheet declares, in order, comments stripped, at-rule preludes included. */
export function selectorsOf(css: string): string[] {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const out: string[] = [];
  let buf = "";
  let depth = 0;
  for (const ch of src) {
    if (ch === "{") {
      const prelude = buf.replace(/\s+/g, " ").trim();
      if (prelude) out.push(depth === 0 ? prelude : `  ${prelude}`);
      buf = "";
      depth++;
      continue;
    }
    if (ch === "}") {
      depth--;
      buf = "";
      continue;
    }
    if (ch === ";" && depth === 0) {
      buf = "";
      continue;
    }
    buf += ch;
  }
  return out;
}

/** One snapshot of a class-only primitive: the selectors are its whole API. */
export function snapshotStylesheet(cssPath: string): void {
  describe("stylesheet", () => {
    it("declares its selectors", () => {
      expect(selectorsOf(readFileSync(cssPath, "utf8"))).toMatchSnapshot();
    });
  });
}

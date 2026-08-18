import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { snapshotStylesheet } from "./test/stylesheet.js";

const path = resolve(__dirname, "./static.css");
const css = readFileSync(path, "utf8");

snapshotStylesheet(path);

describe("presentation mode renders components at full fidelity without interaction", () => {
  it("blocks pointer events, restores disabled opacity, and pins floating elements", () => {
    expect(css).toMatch(/\.strand-static\s*\{\s*pointer-events:\s*none/);
    expect(css).toMatch(/\.strand-static \[disabled\][^{]*\{\s*opacity:\s*1/);
    expect(css).toMatch(/\.strand-static \.strand-toast\s*\{\s*position:\s*static/);
  });
});

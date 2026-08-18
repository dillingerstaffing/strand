import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { snapshotStylesheet } from "./test/stylesheet.js";

const path = resolve(__dirname, "./utilities.css");
const css = readFileSync(path, "utf8");
const ruleFor = (selector: string) => css.match(new RegExp(`${selector.replace(/[.\\-]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

snapshotStylesheet(path);

describe("strand-tabbar-offset reserves the bar's height only where the bar shows", () => {
  it("sits inside the media query, once, and shares the bar's token", () => {
    expect(css).toMatch(/@media\s*\(max-width:\s*767\.98px\)\s*\{\s*\.strand-tabbar-offset\s*\{\s*padding-block-end:/);
    expect(css.match(/\.strand-tabbar-offset\s*\{/g)).toHaveLength(1);
    expect(ruleFor(".strand-tabbar-offset")).toContain("--strand-tabbar-height");
    expect(ruleFor(".strand-tabbar-offset")).toContain("env(safe-area-inset-bottom");
  });
});

describe("strand-scroll-col is a bounded vertical scrollport", () => {
  const rule = ruleFor(".strand-scroll-col");
  it("bounds its height from a knob and scrolls the overflow", () => {
    expect(rule).toContain("overflow-y: auto");
    expect(rule).toContain("--strand-scroll-col-h");
  });
  it("keeps its scrollbar, keeps the other axis visible, and contains overscroll", () => {
    expect(rule).not.toContain("scrollbar-width: none");
    expect(rule).toContain("overflow-x: visible");
    expect(rule).toContain("overscroll-behavior-y: contain");
  });
});

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { snapshotStylesheet } from "./test/stylesheet.js";

const path = resolve(__dirname, "./typography.css");
const css = readFileSync(path, "utf8");
const ruleFor = (selector: string) => css.match(new RegExp(`${selector.replace(/[.\\-]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

snapshotStylesheet(path);

describe("size utilities shrink a value in place", () => {
  it("set only font-size, so the host keeps its color", () => {
    expect(ruleFor(".strand-text-sm")).toMatch(/^\s*font-size:\s*var\(--strand-text-sm\);\s*$/);
    expect(ruleFor(".strand-text-xs")).toMatch(/^\s*font-size:\s*var\(--strand-text-xs\);\s*$/);
  });
});

describe("value tone utilities win any component color rule", () => {
  // Component rules such as `.strand-kv--editorial .strand-kv__value` set
  // color at higher specificity, so a tone composed onto a value must carry
  // !important or the composition silently loses the cascade.
  it("positive and negative tones are !important", () => {
    expect(ruleFor(".strand-value--positive")).toMatch(/color:\s*var\(--strand-green-positive-deep\)\s*!important/);
    expect(ruleFor(".strand-value--negative")).toMatch(/color:\s*var\(--strand-red-alert-deep\)\s*!important/);
  });
});

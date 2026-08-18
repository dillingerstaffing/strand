import { describe, expect, it } from "vitest";
import { classify, pointersIn, summarize } from "../cf-refs-check.mjs";

describe("pointersIn", () => {
  it("finds pointers in TypeScript and CSS comment forms", () => {
    expect(pointersIn("// cf: dialog-scroll-lock\nx;\n/* cf: spacing-ladder */")).toEqual(["dialog-scroll-lock", "spacing-ladder"]);
  });
  it("ignores prose that merely says cf without a slug", () => {
    expect(pointersIn("the cf: Idea, and CF: shouted")).toEqual([]);
  });
});

describe("classify", () => {
  it("a pointer with no article is dangling; an article with no pointer is an orphan", () => {
    const r = classify(new Map([["a.ts", ["one", "two"]]]), new Set(["one", "three", "README"]));
    expect(r.dangling).toEqual([{ file: "a.ts", slug: "two" }]);
    expect(r.orphans).toEqual(["three"]);
    expect(summarize(r, 2).ok).toBe(false);
  });
  it("passes when every pointer resolves and every article is used", () => {
    const r = classify(new Map([["a.ts", ["one"]]]), new Set(["one"]));
    expect(summarize(r, 1).ok).toBe(true);
  });
});

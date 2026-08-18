import { describe, expect, it } from "vitest";
import { familiesOf, guard, mayCollide, specificity, summarize, targetsMeet, targetsOf } from "../css-move-guard.mjs";

describe("specificity", () => {
  it("counts ids, classes and elements, seeing through :not()", () => {
    expect(specificity(".strand-btn:not(.strand-btn--sm) span")).toEqual([0, 2, 1]);
    expect(specificity("#x .a::before")).toEqual([1, 1, 1]);
  });
});

describe("guard", () => {
  it("passes when the same rules appear in a different file order with no equal-specificity overlap", () => {
    const before = ".strand-a { color: red; }\n.strand-b { color: blue; }";
    const after = ".strand-b { color: blue; }\n.strand-a { color: red; }";
    expect(summarize(guard(before, after)).ok).toBe(true);
  });
  it("fails when two rules that share a block at equal specificity swap order", () => {
    const before = ".strand-a { color: red; }\n.strand-a--x { color: blue; }";
    const after = ".strand-a--x { color: blue; }\n.strand-a { color: red; }";
    const r = guard(before, after);
    expect(r.reordered).toHaveLength(1);
    expect(summarize(r).ok).toBe(false);
  });
  it("fails on a lost or altered rule, and reports an added one", () => {
    const r = guard(".strand-a { color: red; }", ".strand-a { color: blue; }");
    expect(r.removed).toEqual([" || .strand-a || color: blue;".replace("blue", "red")]);
    expect(r.added).toHaveLength(1);
    expect(summarize(r).ok).toBe(false);
    expect(summarize(r, true).ok).toBe(true);
  });
  it("passes when equal-specificity rules that swap order cannot meet on one element", () => {
    const before = ".strand-panel .strand-headline { color: red; }\n.strand-panel__close:hover { color: blue; }";
    const after = ".strand-panel__close:hover { color: blue; }\n.strand-panel .strand-headline { color: red; }";
    expect(summarize(guard(before, after)).ok).toBe(true);
  });
  it("passes when the swapped rules meet on one element but set unrelated properties", () => {
    const before = ".strand-a { color: red; }\n.strand-a--x { margin: 0; }";
    const after = ".strand-a--x { margin: 0; }\n.strand-a { color: red; }";
    expect(summarize(guard(before, after)).ok).toBe(true);
  });
  it("targetsOf reads the last compound of every branch: class sans modifier, tag, universal, pseudo-element kept", () => {
    expect([...targetsOf(".strand-card__section--header .strand-btn--sm, .strand-x > *")]).toEqual(["strand-btn", "*"]);
    expect([...targetsOf(".strand-a strong")]).toEqual(["strong"]);
    expect([...targetsOf(".strand-a--pulse::before, .strand-b::after")]).toEqual(["strand-a::before", "strand-b::after"]);
  });
  it("targetsMeet: same tag or class, universal for anything, never across pseudo-elements", () => {
    expect(targetsMeet(targetsOf(".strand-prose p"), targetsOf(".strand-select::after"))).toBe(false);
    expect(targetsMeet(targetsOf(".strand-prose strong"), targetsOf(".strand-log__text strong"))).toBe(true);
    expect(targetsMeet(targetsOf(".strand-x > *"), targetsOf(".strand-y"))).toBe(true);
    expect(targetsMeet(targetsOf(".strand-x > *"), targetsOf(".strand-y::before"))).toBe(false);
  });
  it("targetsMeet: two blocks a consumer composes on one element meet, and only with the same pseudo-element", () => {
    const pairs = new Set(["strand-empty-collection__action strand-link"]);
    expect(targetsMeet(targetsOf(".strand-link"), targetsOf(".strand-empty-collection__action"))).toBe(false);
    expect(targetsMeet(targetsOf(".strand-link"), targetsOf(".strand-empty-collection__action"), pairs)).toBe(true);
    expect(targetsMeet(targetsOf(".strand-link::before"), targetsOf(".strand-empty-collection__action"), pairs)).toBe(false);
  });
  it("guard reports a swap between two rules that meet only through a recorded pair", () => {
    const before = ".strand-link { color: red }\n.strand-empty-collection__action { color: blue }";
    const after = ".strand-empty-collection__action { color: blue }\n.strand-link { color: red }";
    expect(guard(before, after).reordered).toEqual([]);
    expect(guard(before, after, new Set(["strand-empty-collection__action strand-link"])).reordered).toHaveLength(1);
  });
  it("familiesOf folds longhands into their shorthand family", () => {
    expect([...familiesOf("border-color: red; background-image: none; -webkit-backdrop-filter: blur(1px)")]).toEqual(["border", "background", "backdrop"]);
  });
  it("mayCollide needs a shared target and a shared family", () => {
    const rule = (selector, declarations) => ({ r: { declarations }, targets: targetsOf(selector), families: familiesOf(declarations) });
    expect(mayCollide(rule(".strand-a", "color: red"), rule(".strand-a--x", "color: blue"))).toBe(true);
    expect(mayCollide(rule(".strand-a", "color: red"), rule(".strand-b", "color: blue"))).toBe(false);
    expect(mayCollide(rule(".strand-a", "color: red"), rule(".strand-x > *", "color: blue"))).toBe(true);
    expect(mayCollide(rule(".strand-a", "color: red"), rule(".strand-a--x", "color: red"))).toBe(false);
    expect(mayCollide(rule(".strand-a", "border: 1px solid red"), rule(".strand-a--x", "border-color: blue"))).toBe(true);
  });
});

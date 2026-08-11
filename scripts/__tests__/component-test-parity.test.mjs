// Unit tests for the pure half of the component/test parity guard.
//
// The case that matters most is the browser-tier one. ActionDock is a
// positioning primitive whose entire contract is geometry, and jsdom reports
// zero for every box, so a jsdom test of it could only assert that class names
// are spelled correctly: a test that passes while the dock sits off screen.
// If that case were not modelled, this guard would force someone to write a
// worthless test, and a rule that forces worthless tests gets deleted.
//
// The second is the STALE declaration. A component declared browser-tier-only
// that has since been tested everywhere it ships is not untidy, it is a hole:
// it would keep a future untested port of the same component invisible, which
// is precisely what this guard exists to prevent.

import { describe, expect, it } from "vitest";
import { classifyComponentTests, summarize } from "../component-test-parity.mjs";

const c = (pkg, name, hasTest) => ({ pkg, name, hasTest });

describe("classifyComponentTests", () => {
  it("a tested component is fine", () => {
    const r = classifyComponentTests([c("strand-ui", "Button", true)], new Map());
    expect(r.tested).toHaveLength(1);
    expect(r.untested).toEqual([]);
  });

  it("an untested component is reported with the package that ships it", () => {
    const r = classifyComponentTests([c("strand-vue", "ActionDock", false)], new Map());
    expect(r.untested).toHaveLength(1);
    expect(r.untested[0]).toMatchObject({ pkg: "strand-vue", name: "ActionDock" });
  });

  it("a component declared browser-tier-only is covered, and carries the tier for the reader", () => {
    const r = classifyComponentTests(
      [c("strand-vue", "ActionDock", false)],
      new Map([["ActionDock", "layout"]]),
    );
    expect(r.untested).toEqual([]);
    expect(r.covered[0]).toMatchObject({ name: "ActionDock", tier: "layout" });
  });

  it("the declaration covers the component in EVERY package that lacks a test", () => {
    // ActionDock is untested in both ports; one declaration answers for both,
    // because the tier that covers it is a property of the component.
    const r = classifyComponentTests(
      [
        c("strand-ui", "ActionDock", true),
        c("strand-vue", "ActionDock", false),
        c("strand-svelte", "ActionDock", false),
      ],
      new Map([["ActionDock", "layout"]]),
    );
    expect(r.untested).toEqual([]);
    expect(r.covered).toHaveLength(2);
    expect(r.tested).toHaveLength(1);
  });

  it("a declaration for a component tested everywhere is STALE", () => {
    const r = classifyComponentTests(
      [c("strand-ui", "Dialog", true), c("strand-vue", "Dialog", true)],
      new Map([["Dialog", "layout"]]),
    );
    expect(r.staleDeclarations).toEqual(["Dialog"]);
  });

  it("a declaration is NOT stale while any package still lacks a test", () => {
    const r = classifyComponentTests(
      [c("strand-ui", "ActionDock", true), c("strand-svelte", "ActionDock", false)],
      new Map([["ActionDock", "layout"]]),
    );
    expect(r.staleDeclarations).toEqual([]);
  });

  it("separates several components across several packages in one pass", () => {
    const r = classifyComponentTests(
      [
        c("strand-ui", "Button", true),
        c("strand-vue", "Button", true),
        c("strand-vue", "ActionDock", false),
        c("strand-svelte", "Ghost", false),
      ],
      new Map([["ActionDock", "layout"]]),
    );
    expect(r.tested.map((x) => x.pkg)).toEqual(["strand-ui", "strand-vue"]);
    expect(r.covered.map((x) => x.name)).toEqual(["ActionDock"]);
    expect(r.untested.map((x) => x.name)).toEqual(["Ghost"]);
  });
});

describe("summarize", () => {
  it("passes only when nothing is untested and no declaration is stale", () => {
    const r = summarize({
      untested: [],
      covered: [{ name: "ActionDock", tier: "layout" }],
      tested: [{ name: "Button" }],
      staleDeclarations: [],
    });
    expect(r.ok).toBe(true);
    expect(r.text).toContain("PASS");
  });

  it("names the package and the component so the fix is unambiguous", () => {
    const r = summarize({
      untested: [{ pkg: "strand-vue", name: "ActionDock" }],
      covered: [],
      tested: [],
      staleDeclarations: [],
    });
    expect(r.ok).toBe(false);
    expect(r.text).toContain("strand-vue ships ActionDock");
    // The remedy has to be in the failure, or the next person guesses.
    expect(r.text).toContain("browserTierOnlyComponents");
  });

  it("fails on a stale declaration even with nothing untested", () => {
    const r = summarize({
      untested: [],
      covered: [],
      tested: [{ name: "Dialog" }],
      staleDeclarations: ["Dialog"],
    });
    expect(r.ok).toBe(false);
    expect(r.text).toContain("STALE");
  });
});

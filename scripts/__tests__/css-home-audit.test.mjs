// Unit tests for the pure half of the CSS home audit.

import { describe, expect, it } from "vitest";
import {
  auditFiles,
  classifySelector,
  ownedBlocks,
  ownerIndex,
  parseRules,
  summarize,
} from "../css-home-audit.mjs";

describe("parseRules", () => {
  it("reads flat rules, nested media rules, and skips keyframes and comments", () => {
    const css = `/* prose .strand-comment { } */
.strand-a { color: red; }
@media (min-width: 768px) {
  .strand-a--wide { width: 100%; }
}
@keyframes strand-spin { from { opacity: 0 } to { opacity: 1 } }
.strand-b:hover, .strand-c { margin: 0 }
`;
    const rules = parseRules(css);
    expect(rules.map((r) => r.selector)).toEqual([".strand-a", ".strand-a--wide", ".strand-b:hover, .strand-c"]);
    expect(rules[1].atRule).toBe("@media (min-width: 768px)");
    expect(rules[0].declarations).toBe("color: red;");
  });
});

describe("classifySelector", () => {
  it("a bare compound defines its block, element and modifier stripped", () => {
    expect(classifySelector(".strand-card__section--header").defines).toBe("strand-card");
  });
  it("a combinator makes the first compound context rather than a definition", () => {
    const c = classifySelector(".strand-instrument-viewport .strand-headline");
    expect(c.defines).toBeNull();
    expect(c.context).toBe("strand-instrument-viewport");
    expect(c.targets).toEqual(["strand-instrument-viewport", "strand-headline"]);
  });
  it("an element or attribute selector defines nothing", () => {
    expect(classifySelector("body:has(.strand-nav--glass)").defines).toBeNull();
    expect(classifySelector("[data-strand-reserve='empty']").defines).toBeNull();
  });
});

describe("ownedBlocks", () => {
  it("owns both spellings of its own name", () => {
    expect([...ownedBlocks("InstrumentViewport")]).toEqual(["strand-instrument-viewport", "strand-instrumentviewport"]);
  });
  it("owns what its component renders, but not what a comment mentions", () => {
    const src = `// see .strand-dialog__close\nexport const Button = () => <button className={\`strand-btn strand-btn--\${v}\`} />;`;
    const owned = ownedBlocks("Button", src);
    expect(owned.has("strand-btn")).toBe(true);
    expect(owned.has("strand-dialog")).toBe(false);
  });
  it("name-based ownership beats a render mention from another component", () => {
    const idx = ownerIndex(["CommandPalette", "Dialog"], {
      CommandPalette: `<div className="strand-command-palette strand-dialog__panel" />`,
      Dialog: `<div className="strand-dialog" />`,
    });
    expect(idx.get("strand-dialog")).toBe("Dialog");
    expect(idx.get("strand-command-palette")).toBe("CommandPalette");
  });
});

describe("auditFiles", () => {
  const dirs = ["Button", "Card", "Nav"];
  const sources = { Button: `<button className="strand-btn" />`, Card: `<div className="strand-card" />`, Nav: `<nav className="strand-nav" />` };
  it("a stylesheet defining its own block is clean", () => {
    const { rows } = auditFiles([{ name: "Button.css", dir: "Button", css: ".strand-btn { } .strand-btn--sm { }" }], dirs, sources);
    expect(rows[0].own).toEqual({ "strand-btn": 2 });
    expect(rows[0].foreignHomed).toEqual({});
    expect(rows[0].homeless).toEqual({});
  });
  it("names the component that owns a misplaced block, and the blocks nobody owns", () => {
    const { rows, split } = auditFiles(
      [
        { name: "Card.css", dir: "Card", css: ".strand-card { } .strand-nav { } .strand-channel-grid { }" },
        { name: "Nav.css", dir: "Nav", css: ".strand-nav { }" },
      ],
      dirs,
      sources,
    );
    expect(rows[0].foreignHomed).toEqual({ "strand-nav -> Nav": 1 });
    expect(rows[0].homeless).toEqual({ "strand-channel-grid": 1 });
    expect(split).toEqual([{ block: "strand-nav", files: ["Card.css", "Nav.css"] }]);
  });
  it("a global file owns nothing, so everything it defines is misplaced or homeless", () => {
    const { rows } = auditFiles([{ name: "static.css", dir: null, css: ".strand-btn { } .strand-mt-4 { } .strand-x .strand-y { }" }], dirs, sources);
    expect(rows[0].foreignHomed).toEqual({ "strand-btn -> Button": 1 });
    expect(rows[0].homeless).toEqual({ "strand-mt-4": 1 });
    expect(rows[0].context).toBe(1);
  });
});

describe("summarize", () => {
  it("totals the misplaced and homeless rules, fails on either, and fails an empty run", () => {
    const r = auditFiles([{ name: "static.css", dir: null, css: ".strand-btn { } .strand-mt-4 { }" }], ["Button"], { Button: "strand-btn" });
    const out = summarize(r);
    expect(out.ok).toBe(false);
    expect(out.text).toMatch(/1 rules define a block another component owns, 1 rules define blocks no component owns/);
    expect(summarize({ rows: [], split: [] }).ok).toBe(false);
    const clean = auditFiles([{ name: "Button.css", dir: "Button", css: ".strand-btn { }" }], ["Button"], { Button: `<button className="strand-btn" />` });
    expect(summarize(clean).ok).toBe(true);
  });
});

describe("open and owning global sheets", () => {
  it("an open sheet is the home for standalone classes, even ones a component renders", () => {
    const files = [{ name: "utilities.css", dir: null, open: true, css: ".strand-sr-only { } .strand-mt-4 { }" }];
    const { rows } = auditFiles(files, ["CalendarGrid"], { CalendarGrid: `<span className="strand-sr-only" />` });
    expect(rows[0].own).toEqual({ "strand-sr-only": 1, "strand-mt-4": 1 });
    expect(rows[0].foreignHomed).toEqual({});
  });
  it("an open sheet still may not define a block a component owns by name, by declaration, or by rendering what its own sheet defines", () => {
    const files = [
      { name: "Button.css", dir: "Button", css: ".strand-btn { }" },
      { name: "utilities.css", dir: null, open: true, css: ".strand-btn { } .strand-hero-bg { } .strand-card { }" },
    ];
    const { rows } = auditFiles(files, ["Button", "Card", "Hero"], { Button: `<button className="strand-btn" />` }, { Hero: ["strand-hero-bg"] });
    expect(rows[1].foreignHomed).toEqual({ "strand-btn -> Button": 1, "strand-hero-bg -> Hero": 1, "strand-card -> Card": 1 });
  });
  it("a sheet with `owns` owns exactly those blocks, and a class on body is a document mode", () => {
    const files = [{ name: "base.css", dir: null, owns: ["strand-prose"], css: ".strand-prose p { } .strand-prose { } body.strand-grain-wood::after { } .strand-x { }" }];
    const { rows } = auditFiles(files, [], {});
    expect(rows[0].own).toEqual({ "strand-prose": 1 });
    expect(rows[0].homeless).toEqual({ "strand-x": 1 });
    expect(rows[0].global).toBe(1);
    expect(rows[0].context).toBe(1);
  });
  it("a declared css-only block and a recorded foreign block are strong ownership", () => {
    const { rows } = auditFiles(
      [{ name: "InstrumentViewport.css", dir: "InstrumentViewport", css: ".strand-body--instrument { }" }],
      ["InstrumentViewport"],
      {},
      { InstrumentViewport: ["strand-body"] },
    );
    expect(rows[0].own).toEqual({ "strand-body": 1 });
  });
});

// Unit tests for the pure half of the CSS/export parity guard.
//
// The case that matters most is the CSS-ONLY one. A guard that simply demands
// "every stylesheet has an exported component" is wrong for this system:
// Banner ships Banner.css with no component on purpose, because its consumer
// injects the markup server-side and never mounts anything. If that case were
// not modelled, the first person to run the check would either delete a
// working primitive or switch the check off, and both outcomes are worse than
// the orphan it was written to catch.
//
// The second most important case is the STALE declaration: a component that
// was declared css-only and has since been exported. Left alone it is not
// merely untidy, it is a hole, because it would keep a future orphan of the
// same name invisible.

import { describe, expect, it } from "vitest";
import {
  classifyCssComponents,
  classifyForeignBlocks,
  expectedBlocksFor,
  findForeignBlocks,
  parseExportedComponents,
  selectorBlocks,
  summarize,
} from "../css-export-parity.mjs";

const comp = (name, gzipBytes = 100) => ({ name, gzipBytes });

describe("parseExportedComponents", () => {
  it("finds every component re-exported through its index", () => {
    const src = `
      export { Button } from "./components/Button/index.js";
      export type { ButtonProps } from "./components/Button/index.js";
      export { Card } from "./components/Card/index.js";
    `;
    expect(parseExportedComponents(src)).toEqual(new Set(["Button", "Card"]));
  });

  it("does not mistake a css import or a deep path for an export", () => {
    const src = `
      import "./components/Banner/Banner.css";
      export { Dialog } from "./components/Dialog/index.js";
    `;
    const found = parseExportedComponents(src);
    expect(found.has("Dialog")).toBe(true);
    expect(found.has("Banner")).toBe(false);
  });

  it("returns an empty set for source with no exports, so the caller can fail loudly", () => {
    expect(parseExportedComponents("// nothing here").size).toBe(0);
  });
});

describe("classifyCssComponents", () => {
  it("a stylesheet backed by an exported component is fine", () => {
    const r = classifyCssComponents([comp("Button")], new Set(["Button"]), new Set());
    expect(r.backed).toEqual(["Button"]);
    expect(r.orphans).toEqual([]);
  });

  it("a deliberate css-only primitive is fine when declared", () => {
    // Banner: CSS in the bundle, no component, consumed by injected markup.
    const r = classifyCssComponents([comp("Banner")], new Set(["Button"]), new Set(["Banner"]));
    expect(r.cssOnly).toEqual(["Banner"]);
    expect(r.orphans).toEqual([]);
  });

  it("an undeclared, unexported stylesheet is an orphan and keeps its byte cost", () => {
    const r = classifyCssComponents(
      [comp("CommandPalette", 1218)],
      new Set(["Button"]),
      new Set(["Banner"]),
    );
    expect(r.orphans).toHaveLength(1);
    expect(r.orphans[0]).toMatchObject({ name: "CommandPalette", gzipBytes: 1218 });
  });

  it("export wins over a css-only declaration, and the stale declaration is reported", () => {
    // Not cosmetic: a stale declaration would suppress a future orphan of the
    // same name, which is the one thing this guard must never do.
    const r = classifyCssComponents(
      [comp("CommandPalette")],
      new Set(["CommandPalette"]),
      new Set(["CommandPalette"]),
    );
    expect(r.backed).toEqual(["CommandPalette"]);
    expect(r.orphans).toEqual([]);
    expect(r.staleDeclarations).toEqual(["CommandPalette"]);
  });

  it("separates several components in one pass", () => {
    const r = classifyCssComponents(
      [comp("Button"), comp("Banner"), comp("CommandPalette", 1218), comp("Ghost", 40)],
      new Set(["Button"]),
      new Set(["Banner"]),
    );
    expect(r.backed).toEqual(["Button"]);
    expect(r.cssOnly).toEqual(["Banner"]);
    expect(r.orphans.map((o) => o.name)).toEqual(["CommandPalette", "Ghost"]);
  });
});

describe("summarize", () => {
  it("passes only when there are no orphans and no stale declarations", () => {
    const r = summarize(
      { orphans: [], cssOnly: ["Banner"], backed: ["Button"], staleDeclarations: [] },
      54000,
    );
    expect(r.ok).toBe(true);
    expect(r.text).toContain("PASS");
  });

  it("names the orphan, its gzipped cost, and its share of the bundle", () => {
    const r = summarize(
      {
        orphans: [{ name: "CommandPalette", gzipBytes: 1218 }],
        cssOnly: [],
        backed: [],
        staleDeclarations: [],
      },
      54568,
    );
    expect(r.ok).toBe(false);
    expect(r.text).toContain("CommandPalette");
    expect(r.text).toContain("1218 B gzipped");
    // The percentage is what makes the cost legible; a raw byte count in a
    // 54 KB bundle does not tell a reader whether to care.
    expect(r.text).toContain("2.2%");
  });

  it("fails on a stale declaration even with zero orphans", () => {
    const r = summarize(
      { orphans: [], cssOnly: [], backed: ["Dialog"], staleDeclarations: ["Dialog"] },
      54000,
    );
    expect(r.ok).toBe(false);
    expect(r.text).toContain("STALE");
  });

  it("does not divide by zero when the built bundle is absent", () => {
    const r = summarize(
      { orphans: [{ name: "X", gzipBytes: 10 }], cssOnly: [], backed: [], staleDeclarations: [] },
      0,
    );
    expect(r.text).toContain("?%");
    expect(r.ok).toBe(false);
  });
});

// ── The second invariant: a class must live in its own component's stylesheet.
//
// The first invariant pairs a stylesheet FILE with an export, so it can only
// see a component that has a file of its own. Five primitives -- the search
// overlay, the result card, the results panel, the map pins and the cluster
// marker -- were defined INSIDE InstrumentViewport.css. InstrumentViewport is
// exported, so the file passed, and those five were invisible to every guard
// in the repo: absent from parity-manifest.json, absent from the component
// count, with no component in any of the eight consumer types and no test
// anywhere. A consumer could only reach them by hand-writing class strings.
//
// That is the same shape as the orphan this file already catches. There the
// two pipelines disagreed about what a component is; here a stylesheet's
// FILENAME and its CONTENTS disagree about the same thing.
//
// The distinction that makes this correct is CONTEXTUAL styling, which is
// legitimate and pervasive: InstrumentViewport's dark cascade sets
// `.strand-instrument-viewport .strand-progress--bar`, and that must not read
// as InstrumentViewport defining Progress. A foreign class reached through a
// DESCENDANT is being scoped; a foreign class standing alone is being defined.

describe("selectorBlocks", () => {
  it("reads the block a lone class selector defines", () => {
    expect(selectorBlocks(".strand-search-bar")).toEqual(["strand-search-bar"]);
  });

  it("strips element and modifier suffixes back to the block", () => {
    expect(selectorBlocks(".strand-search-bar__inner")).toEqual(["strand-search-bar"]);
    expect(selectorBlocks(".strand-search-bar--shifted")).toEqual(["strand-search-bar"]);
  });

  it("still reads the block through a pseudo-class or an attribute", () => {
    expect(selectorBlocks(".strand-search-bar__inner:focus-within")).toEqual([
      "strand-search-bar",
    ]);
    expect(selectorBlocks(".strand-search-bar__action[hidden]")).toEqual([
      "strand-search-bar",
    ]);
  });

  // The load-bearing case. Without it the dark cascade would report
  // InstrumentViewport as defining Progress, KV, Button, Link and six others,
  // and the guard would be so noisy it would be turned off.
  it("ignores a foreign class reached as a descendant, which is scoping and not defining", () => {
    expect(selectorBlocks(".strand-instrument-viewport .strand-progress--bar")).toEqual(
      [],
    );
    expect(selectorBlocks(".strand-body--instrument .strand-log__time")).toEqual([]);
  });

  it("ignores a compound that qualifies its own block", () => {
    // `.strand-progress--bar.strand-progress--indeterminate` is one element,
    // not a descendant, and it is Progress styling Progress.
    expect(
      selectorBlocks(".strand-progress--bar.strand-progress--indeterminate"),
    ).toEqual(["strand-progress"]);
  });

  it("reads every branch of a selector list", () => {
    expect(selectorBlocks(".strand-map-pin, .strand-cluster-marker")).toEqual([
      "strand-map-pin",
      "strand-cluster-marker",
    ]);
  });

  it("ignores non-strand classes and bare element selectors", () => {
    expect(selectorBlocks("html")).toEqual([]);
    expect(selectorBlocks(".search-bar")).toEqual([]);
  });
});

describe("expectedBlocksFor", () => {
  it("accepts the kebab-cased form of the directory name", () => {
    expect(expectedBlocksFor("InstrumentViewport")).toContain(
      "strand-instrument-viewport",
    );
    expect(expectedBlocksFor("SearchField")).toContain("strand-search-field");
  });

  // ActionDock's class is `strand-actiondock`, not `strand-action-dock`. The
  // matcher tolerates both forms rather than renaming a shipped class, because
  // a rename would break every consumer to satisfy a checker.
  it("also accepts the concatenated form, which ActionDock ships", () => {
    expect(expectedBlocksFor("ActionDock")).toContain("strand-actiondock");
    expect(expectedBlocksFor("ActionDock")).toContain("strand-action-dock");
  });

  it("accepts a single-word component", () => {
    expect(expectedBlocksFor("Card")).toContain("strand-card");
  });
});

describe("findForeignBlocks", () => {
  it("passes a stylesheet that defines only its own block", () => {
    const css = `
      .strand-card { padding: 1rem; }
      .strand-card__title { font-weight: 500; }
      .strand-card--outlined { border: 1px solid; }
    `;
    expect(findForeignBlocks("Card", css, new Set())).toEqual([]);
  });

  it("catches a primitive defined inside a neighbour's stylesheet", () => {
    const css = `
      .strand-instrument-viewport { background: #0F192A; }
      .strand-search-bar { position: absolute; }
      .strand-search-bar__inner { display: flex; }
    `;
    expect(findForeignBlocks("InstrumentViewport", css, new Set())).toEqual([
      "strand-search-bar",
    ]);
  });

  it("does not flag contextual styling of another component", () => {
    const css = `
      .strand-instrument-viewport { background: #0F192A; }
      .strand-instrument-viewport .strand-progress--bar { background: red; }
      .strand-body--instrument .strand-kv__label { color: blue; }
    `;
    expect(findForeignBlocks("InstrumentViewport", css, new Set())).toEqual([]);
  });

  it("accepts a foreign block that is declared, so a deliberate grouping can stay", () => {
    const css = `.strand-map-pin { width: 12px; }`;
    expect(findForeignBlocks("InstrumentViewport", css, new Set(["strand-map-pin"]))).toEqual(
      [],
    );
  });

  it("reports each foreign block once however many rules it has", () => {
    const css = `
      .strand-result-card { padding: 1rem; }
      .strand-result-card__title { font-weight: 500; }
      .strand-result-card--active { border-color: blue; }
    `;
    expect(findForeignBlocks("InstrumentViewport", css, new Set())).toEqual([
      "strand-result-card",
    ]);
  });

  // A guard that inspects nothing and reports success is the failure mode this
  // file exists to prevent in others, so an unparseable stylesheet must not
  // read as a clean one.
  it("finds nothing in an empty stylesheet rather than throwing", () => {
    expect(findForeignBlocks("Card", "", new Set())).toEqual([]);
  });

  it("is not fooled by a class name inside a comment or a media query", () => {
    const css = `
      /* .strand-search-bar used to live here */
      @media (min-width: 768px) {
        .strand-card { padding: 2rem; }
      }
    `;
    expect(findForeignBlocks("Card", css, new Set())).toEqual([]);
  });
});

describe("classifyForeignBlocks", () => {
  it("passes when every foreign block is recorded", () => {
    const r = classifyForeignBlocks({ Button: ["strand-btn"] }, { Button: ["strand-btn"] });
    expect(r.undeclared).toEqual([]);
    expect(r.stale).toEqual([]);
  });

  // The whole point of the ratchet: 39 recorded blocks must not become 40
  // without somebody saying so.
  it("catches a NEW foreign block in a stylesheet that already has recorded ones", () => {
    const r = classifyForeignBlocks(
      { Button: ["strand-btn", "strand-btn-group"] },
      { Button: ["strand-btn"] },
    );
    expect(r.undeclared).toEqual([{ name: "Button", block: "strand-btn-group" }]);
  });

  it("catches a foreign block in a stylesheet with no record at all", () => {
    const r = classifyForeignBlocks({ Card: ["strand-widget"] }, {});
    expect(r.undeclared).toEqual([{ name: "Card", block: "strand-widget" }]);
  });

  // Same reasoning as the stale css-only declaration this file already
  // guards: a record that outlives its need would hide a future foreign
  // block of the same name.
  it("reports a record that no longer matches reality", () => {
    const r = classifyForeignBlocks({}, { Button: ["strand-btn"] });
    expect(r.stale).toEqual([{ name: "Button", block: "strand-btn" }]);
  });

  it("reports both directions at once", () => {
    const r = classifyForeignBlocks(
      { Card: ["strand-new"] },
      { Button: ["strand-gone"] },
    );
    expect(r.undeclared).toEqual([{ name: "Card", block: "strand-new" }]);
    expect(r.stale).toEqual([{ name: "Button", block: "strand-gone" }]);
  });

  it("is clean when nothing is foreign and nothing is recorded", () => {
    const r = classifyForeignBlocks({}, {});
    expect(r.undeclared).toEqual([]);
    expect(r.stale).toEqual([]);
  });
});

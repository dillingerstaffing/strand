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
  parseExportedComponents,
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

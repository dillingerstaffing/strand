// Unit tests for the pure half of the specification-contrast gate.
//
// The asymmetry this closes: `pnpm test:contrast` reads the BUILT CSS, so the
// library was corrected twice while docs/design-language.md was never touched.
// For several releases the DOCUMENTED values were the failing ones and the
// SHIPPED values were correct, so anyone reading the spec to learn the system
// learned the defect. A hand sweep found seven; a gate finds the eighth.

import { describe, expect, it } from "vitest";
import {
  auditDeclaration,
  fencedCssBlocks,
  summarize,
  textColorDeclarations,
} from "../doc-contrast-check.mjs";

const PALETTE = {
  "--strand-gray-400": "#94A5B8",
  "--strand-gray-500": "#5D6E81",
  "--strand-blue-primary": "#3B8EF6",
  "--strand-blue-deep": "#1D5AD8",
  "--strand-teal-vital": "#14B8A6",
};

describe("fencedCssBlocks", () => {
  it("finds css blocks and reports the line each starts on", () => {
    const md = "# Title\n\nprose\n\n```css\n.a { color: red; }\n```\n";
    const blocks = fencedCssBlocks(md);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].line).toBe(5);
    expect(blocks[0].css).toContain(".a");
  });

  // A markup example is not a prescription about colour, and reading them
  // would produce findings nobody can act on.
  it("ignores fences of other languages", () => {
    const md = '```html\n<p style="color:#94A5B8">x</p>\n```\n```tsx\nconst c = "#94A5B8"\n```\n';
    expect(fencedCssBlocks(md)).toEqual([]);
  });

  it("finds every block, not just the first", () => {
    expect(fencedCssBlocks("```css\n.a{}\n```\ntext\n```css\n.b{}\n```")).toHaveLength(2);
  });
});

describe("textColorDeclarations", () => {
  it("reads a color declaration and its selector", () => {
    const d = textColorDeclarations(".field { color: var(--strand-gray-400); }");
    expect(d).toEqual([
      { selector: ".field", token: "--strand-gray-400", sizeName: null, bold: false },
    ]);
  });

  // The entire distinction 14.2b draws. Auditing a background or a border
  // against a text threshold would reproduce the mistake this check exists
  // to catch, in the check itself.
  it("ignores fill-tier declarations, which answer to 3:1 and are not text", () => {
    const css = `
      .a { background: var(--strand-blue-primary); }
      .b { border-color: var(--strand-gray-400); }
      .c { stroke: var(--strand-teal-vital); }
      .d { border-top-color: var(--strand-blue-primary); }`;
    expect(textColorDeclarations(css)).toEqual([]);
  });

  it("does not mistake border-color for color", () => {
    // `color:` appears inside `border-color:` as a substring; the boundary
    // guard is what stops every border in the document being audited as text.
    expect(textColorDeclarations(".a { border-color: var(--strand-gray-400); }")).toEqual([]);
  });

  it("picks up the declared font size, which raises the threshold", () => {
    const d = textColorDeclarations(
      ".a { font-size: var(--strand-text-xs); color: var(--strand-gray-500); }",
    );
    expect(d[0].sizeName).toBe("xs");
  });

  it("reports the selector without the comment that precedes it", () => {
    // Otherwise a finding names a paragraph instead of a rule.
    const d = textColorDeclarations("/* Link, underline grows */\n.link { color: var(--strand-blue-primary); }");
    expect(d[0].selector).toBe(".link");
  });
});

describe("auditDeclaration", () => {
  it("fails a fill-tier value used as text", () => {
    const f = auditDeclaration(
      { selector: ".field-input::placeholder", token: "--strand-gray-400", sizeName: null, bold: false },
      PALETTE,
    );
    expect(f).not.toBeNull();
    expect(f.ratio).toBeLessThan(4.5);
    // The darkest sanctioned surface binds, as it does in the library check.
    expect(f.surface).toBe("surface-recessed");
  });

  it("passes the text-tier value of the same hue", () => {
    expect(
      auditDeclaration(
        { selector: ".a", token: "--strand-blue-deep", sizeName: null, bold: false },
        PALETTE,
      ),
    ).toBeNull();
  });

  it("skips a dark-context example, where a light surface is meaningless", () => {
    const decl = { selector: ".strand-instrument-viewport .x", token: "--strand-gray-400", sizeName: null, bold: false };
    expect(
      auditDeclaration(decl, PALETTE, { darkContext: (s) => /instrument/.test(s) }),
    ).toBeNull();
  });

  it("ignores a token the palette does not define rather than guessing", () => {
    expect(
      auditDeclaration({ selector: ".a", token: "--strand-nope", sizeName: null, bold: false }, PALETTE),
    ).toBeNull();
  });
});

describe("summarize", () => {
  it("passes on an empty finding list", () => {
    const r = summarize([]);
    expect(r.ok).toBe(true);
    expect(r.text).toContain("PASS");
  });

  it("names the ratio, the token, the selector and the line", () => {
    // Without the line the reader greps the specification for a selector
    // that appears three times.
    const r = summarize([
      {
        ratio: 2.29, threshold: 4.5, token: "--strand-gray-400",
        surface: "surface-recessed", px: 16, selector: ".field-input::placeholder", line: 1349,
      },
    ]);
    expect(r.ok).toBe(false);
    expect(r.text).toContain("2.29:1");
    expect(r.text).toContain(".field-input::placeholder");
    expect(r.text).toContain("design-language.md:1349");
    // The remedy is named, so the reader does not have to know 14.2b exists.
    expect(r.text).toContain("14.2b");
  });
});

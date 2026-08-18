// Unit tests for the pure half of the component audit.
//
// The audit reads a component's source and its test file and reports the
// facts a reviewer needs to answer five questions: is it a pure function of
// its props, does it reach past its own refs into the document, does its
// test file snapshot the rendered output or assert class names one by one,
// how much of the file is prose rather than interface, and does the state it
// holds belong to it. Every fact is a count with a line reference, so a
// verdict written from it can be re-checked without opening the file.

import { describe, expect, it } from "vitest";
import {
  analyzeSource,
  analyzeTest,
  classify,
  summarize,
} from "../component-audit.mjs";

const PURE = `/*! Strand UI | MIT License | example.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface BoxProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: "a" | "b";
}

/**
 * A box.
 *
 * @example
 * <Box variant="a" />
 */
export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ variant = "a", className = "", children, ...rest }, ref) => {
    const classes = ["strand-box", \`strand-box--\${variant}\`, className]
      .filter(Boolean)
      .join(" ");
    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  },
);

Box.displayName = "Box";
`;

const STATEFUL = `/*! Strand UI | MIT License | example.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";

let counter = 0;

export interface PanelProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Whether it is open */
  open: boolean;
}

// The scroll lock writes to the body because a class cannot carry a
// measured value. This paragraph is prose, not interface, and it is
// four lines long so the ratio has something to count.
export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ open, ...rest }, ref) => {
    const [visible, setVisible] = useState(open);
    const idRef = useRef(\`panel-\${++counter}\`);
    useLayoutEffect(() => {
      document.body.style.overflow = "hidden";
      const first = document.querySelector("button");
      first?.focus();
      window.addEventListener("resize", () => {});
      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);
    useEffect(() => {
      const t = setTimeout(() => setVisible(true), 10);
      const io = new IntersectionObserver(() => {});
      return () => clearTimeout(t);
    }, []);
    return (
      <div ref={ref} style={{ visibility: visible ? "visible" : "hidden" }} {...rest}>
        <span dangerouslySetInnerHTML={{ __html: "<b>x</b>" }} />
      </div>
    );
  },
);

Panel.displayName = "Panel";
`;

const CLASS_ASSERT_TEST = `import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Box } from "./Box.js";

describe("Box", () => {
  it("applies the a variant by default", () => {
    const { container } = render(<Box />);
    expect(container.firstChild.className).toContain("strand-box--a");
  });
  it("applies the b variant", () => {
    const { container } = render(<Box variant="b" />);
    expect(container.firstChild).toHaveClass("strand-box--b");
  });
  it("forwards a ref", () => {
    expect(true).toBe(true);
  });
});
`;

const SNAPSHOT_TEST = `import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Box } from "./Box.js";

describe("Box", () => {
  it("renders every variant", () => {
    for (const variant of ["a", "b"]) {
      const { container } = render(<Box variant={variant} />);
      expect(container.innerHTML).toMatchSnapshot();
    }
  });
  it("renders children inline", () => {
    const { container } = render(<Box>hi</Box>);
    expect(container.innerHTML).toMatchInlineSnapshot(\`"<div class=\\"strand-box strand-box--a\\">hi</div>"\`);
  });
});
`;

describe("analyzeSource", () => {
  it("a pure forwardRef component has no hooks, no state, no dom reach", () => {
    const f = analyzeSource(PURE);
    expect(f.forwardRef).toBe(true);
    expect(f.hooks).toEqual({});
    expect(f.stateful).toBe(false);
    expect(f.effects).toBe(false);
    expect(f.dom.globals).toEqual({});
    expect(f.dom.queries).toEqual({});
    expect(f.dom.imperativeCalls).toEqual({});
    expect(f.dom.styleWrites).toBe(0);
    expect(f.dom.timers).toEqual({});
    expect(f.dom.observers).toEqual({});
    expect(f.dom.listeners).toBe(0);
    expect(f.dom.rawHtml).toBe(0);
    expect(f.moduleState).toBe(0);
    expect(f.inlineStyleProps).toBe(0);
    expect(f.displayName).toBe(true);
  });

  it("counts jsdoc and prose comment lines separately, and never counts the licence banner", () => {
    const f = analyzeSource(PURE);
    // 1 line for the prop doc, 6 for the component doc block.
    expect(f.comments.jsdoc).toBe(7);
    expect(f.comments.prose).toBe(0);
    expect(f.comments.banner).toBe(1);
    expect(f.lines).toBe(PURE.split("\n").length);
  });

  it("a stateful component reports every hook, every dom reach, and module state", () => {
    const f = analyzeSource(STATEFUL);
    expect(f.hooks).toEqual({ useEffect: 1, useLayoutEffect: 1, useRef: 1, useState: 1 });
    expect(f.stateful).toBe(true);
    expect(f.effects).toBe(true);
    expect(f.dom.globals).toEqual({ "document.body": 2, "document.querySelector": 1, "window.addEventListener": 1 });
    expect(f.dom.queries).toEqual({ querySelector: 1 });
    expect(f.dom.imperativeCalls).toEqual({ focus: 1 });
    expect(f.dom.styleWrites).toBe(2);
    expect(f.dom.timers).toEqual({ setTimeout: 1, clearTimeout: 1 });
    expect(f.dom.observers).toEqual({ IntersectionObserver: 1 });
    expect(f.dom.listeners).toBe(1);
    expect(f.dom.rawHtml).toBe(1);
    expect(f.moduleState).toBe(1);
    expect(f.inlineStyleProps).toBe(1);
  });

  it("prose is comment lines outside jsdoc blocks", () => {
    const f = analyzeSource(STATEFUL);
    expect(f.comments.prose).toBe(3);
    expect(f.comments.jsdoc).toBe(1);
    expect(f.comments.verboseJsdoc).toBe(0);
  });

  it("a doc comment past its allowance is verbose jsdoc, and an @example block gets room", () => {
    const f = analyzeSource(
      `/**\n * one\n * two\n * three\n * four\n */\nexport const a = 1;\n/**\n * doc\n *\n * @example\n * <X />\n */\nexport const b = 2;\n`,
    );
    // The first block is 6 lines against an allowance of 2; the second is
    // 6 lines with an @example, inside its allowance.
    expect(f.comments.verboseJsdoc).toBe(4);
    expect(f.comments.jsdoc).toBe(12);
  });

  it("a hook call with a type argument is still a call", () => {
    const f = analyzeSource(
      `import { useRef, useState } from "preact/hooks";\nexport function X() {\n  const r = useRef<HTMLDivElement>(null);\n  const [a] = useState<Map<string, number> | null>(null);\n  r.current?.querySelector<HTMLElement>("x")?.focus();\n  return null;\n}\n`,
    );
    expect(f.hooks).toEqual({ useRef: 1, useState: 1 });
    expect(f.stateful).toBe(true);
    expect(f.dom.queries).toEqual({ querySelector: 1 });
  });

  it("a hook named inside a string or a comment is not a hook call", () => {
    const f = analyzeSource(`// useState is not used here\nconst s = "useEffect";\nexport function X() { return null; }\n`);
    expect(f.hooks).toEqual({});
  });

  it("does not count a document. reference that lives in a comment", () => {
    const f = analyzeSource(`// document.body is mentioned here\nexport function X() { return null; }\n`);
    expect(f.dom.globals).toEqual({});
  });
});

describe("analyzeTest", () => {
  it("counts tests, snapshots, and class-name assertions", () => {
    const t = analyzeTest(CLASS_ASSERT_TEST);
    expect(t.tests).toBe(3);
    expect(t.snapshots).toBe(0);
    expect(t.classAssertions).toBe(2);
  });

  it("recognises both snapshot forms", () => {
    const t = analyzeTest(SNAPSHOT_TEST);
    expect(t.tests).toBe(2);
    expect(t.snapshots).toBe(2);
    expect(t.classAssertions).toBe(0);
  });

  it("an absent test file is zero everywhere", () => {
    const t = analyzeTest(null);
    expect(t).toEqual({ tests: 0, snapshots: 0, classAssertions: 0, lines: 0, sourceGuards: 0 });
  });

  it("a test that reads a css or tsx file from disk is a source guard", () => {
    const t = analyzeTest(`import { readFileSync } from "node:fs";\nconst css = readFileSync(new URL("./Box.css", import.meta.url), "utf-8");\nit("x", () => { expect(css).toContain("--strand"); });\n`);
    expect(t.sourceGuards).toBe(1);
  });
});

describe("classify", () => {
  it("a pure component with no dom reach and no prose is clean on the mechanical axes", () => {
    const c = classify(analyzeSource(PURE), analyzeTest(SNAPSHOT_TEST));
    expect(c.pure).toBe(true);
    expect(c.reachesDom).toBe(false);
    expect(c.proseRatio).toBe(0);
    expect(c.snapshotted).toBe(true);
    expect(c.flags).toEqual([]);
  });

  it("names each mechanical smell as a flag a reviewer can act on", () => {
    const c = classify(analyzeSource(STATEFUL), analyzeTest(CLASS_ASSERT_TEST));
    expect(c.pure).toBe(false);
    expect(c.reachesDom).toBe(true);
    expect(c.snapshotted).toBe(false);
    expect(c.flags).toEqual(
      expect.arrayContaining([
        "stateful",
        "effects",
        "dom-globals",
        "style-writes",
        "raw-html",
        "module-state",
        "inline-style",
        "no-snapshots",
        "class-assertions",
      ]),
    );
  });

  it("verbose jsdoc counts toward the prose ratio and is named as its own flag", () => {
    const heavy = `/**\n * one\n * two\n * three\n * four\n * five\n * six\n * seven\n * eight\n * nine\n * ten\n * eleven\n */\nexport function X() { return null; }\n`;
    const c = classify(analyzeSource(heavy), analyzeTest(null));
    expect(c.flags).toContain("verbose-jsdoc");
    expect(c.flags).toContain("prose");
  });

  it("prose above the threshold is flagged with the ratio", () => {
    const heavy = `${"// prose\n".repeat(20)}export function X() { return null; }\n`;
    const c = classify(analyzeSource(heavy), analyzeTest(null));
    expect(c.proseRatio).toBeGreaterThan(0.5);
    expect(c.flags).toContain("prose");
  });

  it("a component with no test file is flagged untested rather than no-snapshots", () => {
    const c = classify(analyzeSource(PURE), analyzeTest(null));
    expect(c.flags).toContain("untested");
    expect(c.flags).not.toContain("no-snapshots");
  });
});

describe("summarize", () => {
  it("prints one row per component and a total line, and reports an empty run as a failure", () => {
    const rows = [
      { name: "Box", facts: analyzeSource(PURE), test: analyzeTest(SNAPSHOT_TEST) },
      { name: "Panel", facts: analyzeSource(STATEFUL), test: analyzeTest(CLASS_ASSERT_TEST) },
    ].map((r) => ({ ...r, verdict: classify(r.facts, r.test) }));
    const out = summarize(rows);
    expect(out.ok).toBe(true);
    expect(out.text).toContain("Box");
    expect(out.text).toContain("Panel");
    expect(out.text).toMatch(/2 components/);
    expect(summarize([]).ok).toBe(false);
  });
});

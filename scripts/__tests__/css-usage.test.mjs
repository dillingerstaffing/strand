import { describe, expect, it } from "vitest";
import {
  branchVerdict,
  collectPairs,
  collectUsage,
  isUsed,
  mergeUsage,
  prune,
  selectorClasses,
  summarize,
  unusedKeyframes,
} from "../css-usage.mjs";

describe("collectUsage", () => {
  it("collects every strand class token a source mentions", () => {
    const u = collectUsage([{ file: "a.tsx", text: `<div className="strand-card strand-card__title strand-mt-4" />` }]);
    expect(u.literals.has("strand-card")).toBe(true);
    expect(u.literals.has("strand-card__title")).toBe(true);
    expect(u.literals.has("strand-mt-4")).toBe(true);
  });
  it("records a dynamic prefix when a class is composed at runtime, in each template flavour", () => {
    const sources = [
      { file: "a.tsx", text: "const c = `strand-btn--${variant}`;" },
      { file: "b.vue", text: `:class="'strand-alert--' + tone"` },
      { file: "c.svelte", text: `class="strand-tag strand-tag--{size}"` },
      { file: "d.js", text: `el.classList.add("strand-badge__" + part);` },
    ];
    const u = collectUsage(sources);
    expect([...u.prefixes]).toEqual(expect.arrayContaining(["strand-btn--", "strand-alert--", "strand-tag--", "strand-badge__"]));
  });
  it("a whole token followed by interpolation is a literal with an appendix, not a prefix", () => {
    const u = collectUsage([{ file: "a.tsx", text: "const c = `strand-switch${on ? \" strand-switch--checked\" : \"\"}`;" }]);
    expect(u.prefixes.size).toBe(0);
    expect(u.literals.has("strand-switch--checked")).toBe(true);
  });
  it("collects data attributes and ignores comments", () => {
    const u = collectUsage([{ file: "a.tsx", text: `// strand-ghost is not rendered\nel.setAttribute("data-strand-reserve", "empty");` }]);
    expect(u.literals.has("strand-ghost")).toBe(false);
    expect(u.attributes.has("data-strand-reserve")).toBe(true);
  });
});

describe("isUsed", () => {
  const usage = { literals: new Set(["strand-card", "strand-card__title"]), prefixes: new Set(["strand-btn--"]), attributes: new Set() };
  it("a literal mention is use", () => {
    expect(isUsed("strand-card__title", usage)).toBe(true);
    expect(isUsed("strand-card__body", usage)).toBe(false);
  });
  it("a dynamic prefix keeps every class it could produce", () => {
    expect(isUsed("strand-btn--danger", usage)).toBe(true);
    expect(isUsed("strand-btn", usage)).toBe(false);
  });
});

describe("selectorClasses", () => {
  it("lists the strand classes and attributes one branch needs; a class inside :not() is not needed", () => {
    expect(selectorClasses(".strand-card:not(.strand-card--flat) > .strand-btn[data-strand-x]")).toEqual({
      classes: ["strand-card", "strand-btn"],
      attributes: ["data-strand-x"],
      foreignClasses: [],
    });
  });
  it("names non-strand classes so a reviewer can judge them", () => {
    expect(selectorClasses(".strand-detail-panel.open").foreignClasses).toEqual(["open"]);
  });
});

describe("branchVerdict", () => {
  const usage = { literals: new Set(["strand-card", "strand-btn", "data-strand-x"]), prefixes: new Set(), attributes: new Set(["data-strand-x"]) };
  it("a branch whose every strand class and attribute is used is live", () => {
    expect(branchVerdict(".strand-card .strand-btn[data-strand-x]", usage)).toBe("live");
  });
  it("a branch with any unused strand class is dead", () => {
    expect(branchVerdict(".strand-card .strand-btn--ghost", usage)).toBe("dead");
    expect(branchVerdict("[data-strand-nope]", usage)).toBe("dead");
  });
  it("a branch with no strand class at all is kept, since it is not ours to judge", () => {
    expect(branchVerdict("body:has(.strand-card)", usage)).toBe("live");
    expect(branchVerdict("html", usage)).toBe("live");
  });
  it("a live branch that also carries a foreign class is reported for review rather than deleted", () => {
    expect(branchVerdict(".strand-card.is-open", usage)).toBe("review");
  });
});

describe("prune", () => {
  const usage = { literals: new Set(["strand-card", "strand-card__title", "strand-spin"]), prefixes: new Set(), attributes: new Set() };
  it("removes dead rules and dead branches, keeps live ones, and reports what went", () => {
    const css = `/*! banner */
.strand-card { padding: 1rem; }
.strand-card__title, .strand-card__ghost { font-weight: 500; }
.strand-card__ghost:hover { color: red; }
@media (min-width: 40rem) {
  .strand-card__ghost { display: none; }
  .strand-card { padding: 2rem; }
}
@keyframes strand-fade { from { opacity: 0 } to { opacity: 1 } }
.strand-card__title { animation: strand-fade 1s; }
`;
    const { css: out, removed } = prune(css, usage);
    expect(out).toContain(".strand-card { padding: 1rem; }");
    expect(out).toContain(".strand-card__title { font-weight: 500; }");
    expect(out).not.toContain("strand-card__ghost");
    expect(out).toContain("@media (min-width: 40rem)");
    expect(out).toContain("padding: 2rem;");
    expect(out).toContain("@keyframes strand-fade");
    expect(removed.map((r) => r.selector)).toEqual([".strand-card__ghost", ".strand-card__ghost:hover", ".strand-card__ghost"]);
    expect(out.startsWith("/*! banner */")).toBe(true);
  });
  it("drops an at-rule block whose every rule died", () => {
    const { css: out } = prune("@media print { .strand-nope { color: red } }", usage);
    expect(out.trim()).toBe("");
  });
  it("leaves review branches in place", () => {
    const { css: out, review } = prune(".strand-card.is-open { color: red }", usage);
    expect(out).toContain(".strand-card.is-open");
    expect(review).toHaveLength(1);
  });
});

describe("unusedKeyframes", () => {
  it("names keyframes no remaining rule animates", () => {
    const css = "@keyframes strand-a { } @keyframes strand-b { } .x { animation: strand-a 1s; } .y { animation-name: strand-c; }";
    expect(unusedKeyframes(css)).toEqual(["strand-b"]);
  });
});

describe("summarize", () => {
  it("counts removed rules per file, fails on any unused, and fails an empty scan", () => {
    const out = summarize([{ file: "Card.css", removed: [{ selector: ".a" }, { selector: ".b" }], review: [] }], 3);
    expect(out.text).toMatch(/Card.css\s+2 unused/);
    expect(out.ok).toBe(false);
    expect(summarize([{ file: "Card.css", removed: [], review: [] }], 3).ok).toBe(true);
    expect(summarize([], 0).ok).toBe(false);
  });
});

describe("mergeUsage", () => {
  it("folds a recorded consumer into the usage sets", () => {
    const u = mergeUsage({ literals: new Set(), prefixes: new Set(), attributes: new Set() }, { classes: ["strand-x"], prefixes: ["strand-y--"], attributes: ["data-strand-z"] });
    expect(u.literals.has("strand-x")).toBe(true);
    expect(isUsed("strand-y--any", u)).toBe(true);
    expect(u.attributes.has("data-strand-z")).toBe(true);
  });
});

describe("collectPairs", () => {
  it("records the blocks that share one class attribute, modifiers folded into their block", () => {
    const pairs = collectPairs([{ file: "a.html", text: '<a class="strand-link strand-link--cta strand-empty-collection__action">x</a>' }], {});
    expect(pairs).toEqual([["strand-empty-collection__action", "strand-link"]]);
  });
  it("reads class expressions in JSX, htm and Svelte, including cx() calls", () => {
    const sources = [
      { file: "a.tsx", text: 'const x = <div className={cx("strand-card", on && "strand-card--active", "strand-scroll-row")} />;' },
      { file: "b.js", text: "html`<span class=${`strand-chip ${on ? \"strand-chip--joined\" : \"\"} strand-mt-2`}>`" },
      { file: "c.svelte", text: "<div class={['strand-stack', 'strand-value--positive'].filter(Boolean).join(' ')}></div>" },
    ];
    expect(collectPairs(sources, {})).toEqual([
      ["strand-card", "strand-scroll-row"],
      ["strand-chip", "strand-mt-2"],
      ["strand-stack", "strand-value"],
    ]);
  });
  it("pairs a class given to a component with the block that component renders", () => {
    const sources = [
      { file: "a.jsx", text: 'import { Link } from "./ui.js";\n<Link className="strand-empty-collection__action" href="/">Browse</Link>' },
      { file: "b.js", text: 'import { Button } from "./ui.js";\nhtml`<${Button} class="strand-mt-4">Go</${Button}>`' },
      { file: "c.tsx", text: 'const Tag = as; return <Tag className="strand-card">x</Tag>;' },
    ];
    expect(collectPairs(sources, { Link: "strand-link", Button: "strand-btn" })).toEqual([
      ["strand-btn", "strand-mt-4"],
      ["strand-empty-collection__action", "strand-link"],
    ]);
  });
  it("ignores a lone class and a class that only meets its own modifiers", () => {
    expect(collectPairs([{ file: "a.html", text: '<div class="strand-stack strand-stack--vertical strand-stack--gap-4"></div>' }], {})).toEqual([]);
  });
});

#!/usr/bin/env node
// Component audit: the mechanical facts behind a component review.
//
// For every Preact component in strand-ui, reads the source and its test and
// reports counts a reviewer can re-check by grep: hooks called, state held,
// effects run, reaches into `document`/`window`, imperative style writes,
// timers, observers, raw HTML, module-level state, inline `style=` props,
// comment lines split into licence banner / JSDoc / prose, and on the test
// side the number of tests, snapshot assertions, one-class-at-a-time
// assertions, and tests that read a source file from disk.
//
// It decides nothing about quality. Whether a piece of state belongs to a
// component, or a `document.activeElement` read is the only way to restore
// focus, is a judgment the reviewer writes down beside these numbers.
//
//   pnpm audit-components            table on stdout
//   pnpm audit-components --json f   also write the rows as JSON

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const COMPONENTS = join(ROOT, "packages/strand-ui/src/components");

// ── Pure decision layer ─────────────────────────────────────────────────

/**
 * Split source into comment spans and comment-free code. Strings and template
 * literals are honoured so a `//` inside a string is not a comment. The code
 * text keeps its line structure (comments become spaces) so line numbers and
 * per-line classification survive.
 *
 * @param {string} src
 * @returns {{code: string, comments: {kind: "banner"|"jsdoc"|"block"|"line", start: number, end: number}[]}}
 */
export function splitComments(src) {
  const comments = [];
  let code = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const ch = src[i];
    const next = src[i + 1];
    if (ch === "/" && next === "/") {
      const start = i;
      while (i < n && src[i] !== "\n") i++;
      comments.push({ kind: "line", start, end: i });
      code += " ".repeat(i - start);
      continue;
    }
    if (ch === "/" && next === "*") {
      const start = i;
      const kind = src[i + 2] === "!" ? "banner" : src[i + 2] === "*" && src[i + 3] !== "/" ? "jsdoc" : "block";
      const close = src.indexOf("*/", i + 2);
      const end = close === -1 ? n : close + 2;
      comments.push({ kind, start, end });
      code += src.slice(start, end).replace(/[^\n]/g, " ");
      i = end;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let j = i + 1;
      while (j < n) {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src[j] === quote) break;
        if (quote !== "`" && src[j] === "\n") break;
        j++;
      }
      code += src.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    code += ch;
    i++;
  }
  return { code, comments };
}

const countMatches = (text, re) => {
  const counts = {};
  for (const m of text.matchAll(re)) counts[m[1]] = (counts[m[1]] || 0) + 1;
  return counts;
};

// A call, with or without a type argument: `useRef(null)`, `useRef<T>(null)`,
// `useState<A | B>(x)`. One level of nested generics is enough for hooks.
const HOOK_CALL =
  /\b(useState|useReducer|useEffect|useLayoutEffect|useRef|useMemo|useCallback|useContext|useId|useImperativeHandle|useErrorBoundary|useSignal|useComputed|useSignalEffect)\s*(?:<(?:[^<>]|<[^<>]*>)*>)?\s*\(/g;
const STATE_HOOKS = new Set(["useState", "useReducer", "useContext", "useSignal", "useComputed"]);
const EFFECT_HOOKS = new Set(["useEffect", "useLayoutEffect", "useSignalEffect"]);

/**
 * Facts about one component source file.
 * @param {string} src
 */
export function analyzeSource(src) {
  const { code, comments } = splitComments(src);
  const lines = src.split("\n").length;

  // A comment LINE is a source line that holds no code. Classified by the
  // comment that owns it; a block spanning several lines owns each of them.
  const lineKind = new Array(lines).fill(null);
  const codeLines = code.split("\n");
  let offset = 0;
  const lineStarts = [];
  for (const l of src.split("\n")) {
    lineStarts.push(offset);
    offset += l.length + 1;
  }
  const lineOf = (pos) => {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= pos) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };
  for (const c of comments) {
    const first = lineOf(c.start);
    const last = lineOf(Math.max(c.start, c.end - 1));
    for (let ln = first; ln <= last; ln++) {
      if (codeLines[ln].trim() === "" && lineKind[ln] === null) lineKind[ln] = c.kind;
    }
  }
  const commentCounts = { banner: 0, jsdoc: 0, prose: 0, verboseJsdoc: 0 };
  for (const k of lineKind) {
    if (k === "banner") commentCounts.banner++;
    else if (k === "jsdoc") commentCounts.jsdoc++;
    else if (k === "block" || k === "line") commentCounts.prose++;
  }
  // A JSDoc block is interface when it is short. A prop doc gets two lines;
  // a block carrying an @example gets room for the example. Lines past
  // that are prose that happens to sit inside a doc comment.
  for (const c of comments) {
    if (c.kind !== "jsdoc") continue;
    const text = src.slice(c.start, c.end);
    const n = text.split("\n").length;
    const allowance = text.includes("@example") ? JSDOC_EXAMPLE_ALLOWANCE : JSDOC_ALLOWANCE;
    if (n > allowance) commentCounts.verboseJsdoc += n - allowance;
  }

  const hooks = countMatches(code, HOOK_CALL);
  const contexts = (code.match(/\bcreateContext\s*[<(]/g) || []).length;
  const stateful = contexts > 0 || Object.keys(hooks).some((h) => STATE_HOOKS.has(h));
  const effects = Object.keys(hooks).some((h) => EFFECT_HOOKS.has(h));

  const globals = countMatches(code, /(?<![\w$.])((?:document|window|globalThis|navigator)\.[A-Za-z_$][\w$]*)/g);
  const queries = countMatches(
    code,
    /\.(querySelectorAll|querySelector|getElementById|getElementsByClassName|getElementsByTagName|closest)\s*(?:<[^<>]*>)?\s*\(/g,
  );
  const imperativeCalls = countMatches(
    code,
    /\.(focus|blur|click|select|scrollIntoView|scrollTo|showModal|showPopover|hidePopover)\s*\(/g,
  );
  const styleWrites =
    (code.match(/\.style\.[A-Za-z]+\s*=[^=]/g) || []).length +
    (code.match(/\.style\.(?:setProperty|removeProperty)\s*\(/g) || []).length;
  const classListWrites = (code.match(/\.classList\.(?:add|remove|toggle|replace)\s*\(/g) || []).length;
  const timers = countMatches(
    code,
    /\b(setTimeout|clearTimeout|setInterval|clearInterval|requestAnimationFrame|cancelAnimationFrame)\s*\(/g,
  );
  const observers = countMatches(code, /\bnew\s+(IntersectionObserver|ResizeObserver|MutationObserver)\b/g);
  const listeners = (code.match(/\.addEventListener\s*\(/g) || []).length;
  const rawHtml = (code.match(/dangerouslySetInnerHTML|\.innerHTML\s*=/g) || []).length;
  const moduleState = (code.match(/^let\s+/gm) || []).length;
  const inlineStyleProps = (code.match(/\bstyle=\{/g) || []).length;

  return {
    lines,
    comments: commentCounts,
    forwardRef: /\bforwardRef\s*[<(]/.test(code),
    displayName: /\.displayName\s*=/.test(code),
    hooks,
    contexts,
    stateful,
    effects,
    moduleState,
    inlineStyleProps,
    dom: { globals, queries, imperativeCalls, styleWrites, classListWrites, timers, observers, listeners, rawHtml },
  };
}

/**
 * Facts about one test file. `null` means there is no file.
 * @param {string|null} src
 */
export function analyzeTest(src) {
  if (src == null) return { tests: 0, snapshots: 0, classAssertions: 0, lines: 0, sourceGuards: 0 };
  const { code } = splitComments(src);
  return {
    lines: src.split("\n").length,
    tests: (code.match(/\b(?:it|test)(?:\.each\([^)]*\))?\s*\(/g) || []).length,
    snapshots: (code.match(/toMatch(?:Inline|File)?Snapshot\s*\(/g) || []).length,
    classAssertions:
      (code.match(/toHaveClass\s*\(/g) || []).length +
      (code.match(/className\)\s*\.\s*(?:toContain|toBe|toMatch|toEqual)\s*\(/g) || []).length +
      (code.match(/classList\.contains\s*\(/g) || []).length,
    sourceGuards: (code.match(/\breadFile(?:Sync)?\s*\(/g) || []).length,
  };
}

const PROSE_THRESHOLD = 0.1;
const JSDOC_ALLOWANCE = 2;
const JSDOC_EXAMPLE_ALLOWANCE = 16;

/**
 * Mechanical verdict: booleans and named flags. No opinion about whether a
 * flag is a defect; that is the reviewer's line, written next to the row.
 */
export function classify(facts, test) {
  const d = facts.dom;
  const has = (o) => Object.keys(o).length > 0;
  const reachesDom =
    has(d.globals) || has(d.queries) || d.styleWrites > 0 || d.classListWrites > 0 || d.listeners > 0 || has(d.observers) || d.rawHtml > 0;
  const proseRatio =
    facts.lines === 0 ? 0 : (facts.comments.prose + facts.comments.verboseJsdoc) / facts.lines;
  const flags = [];
  if (facts.stateful) flags.push("stateful");
  if (facts.effects) flags.push("effects");
  if (has(d.globals) || has(d.queries)) flags.push("dom-globals");
  if (has(d.imperativeCalls)) flags.push("imperative-calls");
  if (d.styleWrites > 0) flags.push("style-writes");
  if (d.classListWrites > 0) flags.push("classlist-writes");
  if (d.listeners > 0) flags.push("listeners");
  if (has(d.observers)) flags.push("observers");
  if (has(d.timers)) flags.push("timers");
  if (d.rawHtml > 0) flags.push("raw-html");
  if (facts.moduleState > 0) flags.push("module-state");
  if (facts.inlineStyleProps > 0) flags.push("inline-style");
  if (proseRatio > PROSE_THRESHOLD) flags.push("prose");
  if (facts.comments.verboseJsdoc > 0) flags.push("verbose-jsdoc");
  if (test.tests === 0) flags.push("untested");
  else if (test.snapshots === 0) flags.push("no-snapshots");
  if (test.classAssertions > 0) flags.push("class-assertions");
  return {
    pure: !has(facts.hooks) && !facts.stateful && !reachesDom,
    stateless: !facts.stateful && !facts.effects,
    reachesDom,
    proseRatio: Number(proseRatio.toFixed(3)),
    snapshotted: test.snapshots > 0,
    flags,
  };
}

const pad = (s, w) => String(s).padEnd(w);
const num = (s, w) => String(s).padStart(w);

/** Human-readable table. An empty run is a failure, not a clean report. */
export function summarize(rows) {
  if (rows.length === 0) return { ok: false, text: "  FAIL  audited zero components. The layout moved." };
  const lines = [];
  lines.push(
    `  ${pad("component", 19)}${num("tsx", 5)}${num("test", 5)}${num("n", 4)}${num("snap", 5)}${num("cls", 4)}${num("prose", 6)}  ${pad("hooks", 34)}  flags`,
  );
  for (const r of rows) {
    const hooks = Object.entries(r.facts.hooks)
      .map(([k, v]) => `${k.replace(/^use/, "")}:${v}`)
      .join(" ");
    lines.push(
      `  ${pad(r.name, 19)}${num(r.facts.lines, 5)}${num(r.test.lines, 5)}${num(r.test.tests, 4)}${num(r.test.snapshots, 5)}${num(r.test.classAssertions, 4)}${num(`${Math.round(r.verdict.proseRatio * 100)}%`, 6)}  ${pad(hooks, 34)}  ${r.verdict.flags.join(",")}`,
    );
  }
  const pure = rows.filter((r) => r.verdict.pure).length;
  const stateless = rows.filter((r) => r.verdict.stateless).length;
  const dom = rows.filter((r) => r.verdict.reachesDom).length;
  const snap = rows.filter((r) => r.verdict.snapshotted).length;
  const prose = rows.filter((r) => r.verdict.flags.includes("prose")).length;
  const proseLines = rows.reduce((n, r) => n + r.facts.comments.prose, 0);
  const verboseLines = rows.reduce((n, r) => n + r.facts.comments.verboseJsdoc, 0);
  lines.push("");
  lines.push(
    `  ${rows.length} components: ${pure} pure (no hooks), ${stateless} stateless, ${dom} reach the DOM, ${snap} snapshot-tested, ${prose} over ${PROSE_THRESHOLD * 100}% prose (${proseLines} prose lines, ${verboseLines} verbose JSDoc lines).`,
  );
  return { ok: true, text: lines.join("\n") };
}

// ── Impure shell ────────────────────────────────────────────────────────

function readIf(path) {
  return existsSync(path) ? readFileSync(path, "utf-8") : null;
}

export function auditDirectory(componentsDir) {
  const rows = [];
  for (const name of readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()) {
    const dir = join(componentsDir, name);
    const source = readIf(join(dir, `${name}.tsx`));
    if (source == null) continue;
    const test = readIf(join(dir, `${name}.test.tsx`)) ?? readIf(join(dir, `${name}.test.ts`));
    const facts = analyzeSource(source);
    const testFacts = analyzeTest(test);
    rows.push({ name, facts, test: testFacts, verdict: classify(facts, testFacts) });
  }
  return rows;
}

function main() {
  const args = process.argv.slice(2);
  const jsonAt = args.indexOf("--json");
  const jsonPath = jsonAt === -1 ? null : args[jsonAt + 1];
  const dirAt = args.indexOf("--dir");
  const dir = dirAt === -1 ? COMPONENTS : resolve(args[dirAt + 1]);

  console.log("\n── Component audit ──\n");
  const rows = auditDirectory(dir);
  const { ok, text } = summarize(rows);
  console.log(text);
  if (jsonPath) {
    writeFileSync(jsonPath, `${JSON.stringify(rows, null, 2)}\n`);
    console.log(`\n  wrote ${jsonPath}`);
  }
  process.exit(ok ? 0 : 1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

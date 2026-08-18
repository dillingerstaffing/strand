#!/usr/bin/env node
// CSS home audit: which file defines each block, and whether that is where
// it belongs. A component's rules live in its own directory; a global file
// holds only rules that are global.
//
//   pnpm audit-css-home            report on stdout
//   pnpm audit-css-home --json f   also write the rows as JSON

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { splitComments } from "./component-audit.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const UI = join(ROOT, "packages/strand-ui/src");
const COMPONENTS = join(UI, "components");
const MANIFEST = join(ROOT, "parity-manifest.json");
// The sheets outside components/, and what each may define. `open` means the
// sheet is the home for standalone classes no component owns (typography and
// utilities are exactly that); a listed block is the sheet's own.
const GLOBAL_FILES = [
  { name: "strand-ui/src/typography.css", path: join(UI, "typography.css"), open: true },
  { name: "strand-ui/src/utilities.css", path: join(UI, "utilities.css"), open: true },
  { name: "strand-ui/src/static.css", path: join(UI, "static.css"), owns: ["strand-static"] },
  { name: "tokens/css/base.css", path: join(ROOT, "packages/tokens/css/base.css"), owns: ["strand-prose"] },
];

// ── Pure decision layer ─────────────────────────────────────────────────

/** Comment-free CSS, structure preserved. */
export function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/**
 * Every style rule in a stylesheet, in order, with the at-rule prelude it
 * sits under (media, supports, container) or null.
 * @param {string} css
 * @returns {{selector: string, declarations: string, atRule: string|null}[]}
 */
export function parseRules(css) {
  const src = stripCssComments(css);
  const rules = [];
  const stack = [];
  let i = 0;
  let buf = "";
  while (i < src.length) {
    const ch = src[i];
    if (ch === "{") {
      const prelude = buf.trim();
      buf = "";
      if (prelude.startsWith("@")) {
        // Nested at-rule: @media/@supports/@container/@layer/@keyframes.
        stack.push({ kind: "at", prelude });
        i++;
        continue;
      }
      // A style rule: read its declaration block to the matching brace.
      let depth = 1;
      let j = i + 1;
      while (j < src.length && depth > 0) {
        if (src[j] === "{") depth++;
        else if (src[j] === "}") depth--;
        j++;
      }
      const body = src.slice(i + 1, j - 1);
      const at = stack.filter((s) => s.kind === "at").map((s) => s.prelude);
      const inKeyframes = at.some((p) => p.startsWith("@keyframes"));
      if (!inKeyframes) {
        rules.push({
          selector: prelude.replace(/\s+/g, " "),
          declarations: body.replace(/\s+/g, " ").trim(),
          atRule: at.length ? at.join(" / ") : null,
        });
      }
      i = j;
      continue;
    }
    if (ch === "}") {
      stack.pop();
      buf = "";
      i++;
      continue;
    }
    if (ch === ";" && !buf.includes("{")) {
      // A top-level at-statement such as @import; discard.
      buf = "";
      i++;
      continue;
    }
    buf += ch;
    i++;
  }
  return rules;
}

/**
 * The block a selector DEFINES: the strand class of its first compound,
 * with element and modifier stripped. Null when the first compound has no
 * strand class (element, attribute, or pseudo selectors) or when the rule
 * is context (a combinator follows the first compound), in which case the
 * context block is returned under `context` instead.
 * @param {string} selector
 * @returns {{defines: string|null, context: string|null, targets: string[]}}
 */
export function classifySelector(selector) {
  const first = selector.split(",")[0].trim();
  const compoundEnd = first.search(/[\s>+~]/);
  const compound = compoundEnd === -1 ? first : first.slice(0, compoundEnd);
  const isContext = compoundEnd !== -1;
  const blockOf = (m) => m.split("__")[0].split("--")[0];
  // A class inside :has()/:not()/:is()/:where() is a condition, not the
  // element being defined: `body:has(.strand-nav--glass)` styles body.
  const defining = compound.replace(/:(?:has|not|is|where)\([^)]*\)/g, "");
  // A class on html or body is a document mode, not a block: `body.strand-grain-wood::after`.
  const firstClass = /^(?:html|body)[.:\[]/.test(defining) ? null : defining.match(/\.(strand-[A-Za-z0-9_-]+)/);
  const targets = [];
  for (const m of first.matchAll(/\.(strand-[A-Za-z0-9_-]+)/g)) {
    const b = blockOf(m[1]);
    if (!targets.includes(b)) targets.push(b);
  }
  if (!firstClass) return { defines: null, context: null, targets };
  const block = blockOf(firstClass[1]);
  return isContext ? { defines: null, context: block, targets } : { defines: block, context: null, targets };
}

/**
 * The blocks a directory owns: its own name in both spellings, plus every
 * block the component in that directory renders (so `Button` owns
 * `strand-btn` because `Button.tsx` emits it, and `Card` does NOT own
 * `strand-channel-grid` because nothing in `Card.tsx` does).
 */
export function ownedBlocks(dirName, componentSource = "") {
  const kebab = dirName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  const owned = new Set([`strand-${kebab}`, `strand-${dirName.toLowerCase()}`]);
  // Code only: a class named in a comment or a doc example is not rendered.
  const { code } = splitComments(componentSource);
  for (const m of code.matchAll(/strand-[a-z0-9]+(?:-[a-z0-9]+)*/g)) {
    owned.add(m[0].split("__")[0].split("--")[0]);
  }
  return owned;
}

/**
 * block -> owning directory. Ownership by name, by declaration (a css-only
 * primitive's `blocks`, a recorded `foreignBlocks` entry), or by rendering a
 * block the directory's own sheet defines is strong. Ownership by rendering
 * alone is weak: a component that renders `strand-sr-only` is using the
 * utility, not defining it. `strong(block)` tells the two apart.
 */
export function ownerIndex(dirs, sourcesByDir = {}, declaredByDir = {}, cssByDir = {}) {
  const dirByBlock = new Map();
  const strongBlocks = new Set();
  const claim = (b, d, strong) => {
    if (dirByBlock.has(b)) return;
    dirByBlock.set(b, d);
    if (strong) strongBlocks.add(b);
  };
  for (const d of dirs) for (const b of ownedBlocks(d)) claim(b, d, true);
  for (const d of dirs) for (const b of declaredByDir[d] || []) claim(b, d, true);
  for (const d of dirs) {
    // Rendered and defined in the directory's own sheet: the component's block
    // under another name (Button renders and styles `strand-btn`). Rendered
    // only: the component uses a class someone else defines.
    const defined = new Set(parseRules(cssByDir[d] || "").map((r) => classifySelector(r.selector).defines).filter(Boolean));
    for (const b of ownedBlocks(d, sourcesByDir[d] || "")) claim(b, d, defined.has(b));
  }
  dirByBlock.strong = (b) => strongBlocks.has(b);
  return dirByBlock;
}

/**
 * Per file: every block it defines with a rule count, split into own,
 * foreign-with-a-home (a component directory owns that block), and
 * homeless (no directory owns it). Context rules are counted separately.
 * A global sheet marked `open` is the home for standalone blocks, so it
 * has no homeless rules; one with `owns` owns exactly those blocks.
 *
 * @param {{name: string, dir: string|null, css: string, open?: boolean, owns?: string[]}[]} files
 * @param {string[]} dirs component directory names
 */
export function auditFiles(files, dirs, sourcesByDir = {}, declaredByDir = {}) {
  const cssByDir = Object.fromEntries(files.filter((f) => f.dir).map((f) => [f.dir, f.css]));
  const dirByBlock = ownerIndex(dirs, sourcesByDir, declaredByDir, cssByDir);

  const rows = [];
  const definers = new Map(); // block -> Set(file)
  for (const f of files) {
    const rules = parseRules(f.css);
    const own = new Map();
    const foreignHomed = new Map();
    const homeless = new Map();
    let context = 0;
    let global = 0;
    for (const r of rules) {
      const c = classifySelector(r.selector);
      if (c.defines == null) {
        if (c.context) context++;
        else global++;
        continue;
      }
      if (!definers.has(c.defines)) definers.set(c.defines, new Set());
      definers.get(c.defines).add(f.name);
      const owner = dirByBlock.get(c.defines) ?? null;
      const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
      if (f.dir && owner === f.dir) bump(own, c.defines);
      else if (f.open && !(owner && dirByBlock.strong(c.defines))) bump(own, c.defines);
      else if (owner) bump(foreignHomed, `${c.defines} -> ${owner}`);
      else if ((f.owns || []).includes(c.defines)) bump(own, c.defines);
      else bump(homeless, c.defines);
    }
    rows.push({
      file: f.name,
      rules: rules.length,
      own: Object.fromEntries(own),
      foreignHomed: Object.fromEntries(foreignHomed),
      homeless: Object.fromEntries(homeless),
      context,
      global,
    });
  }
  const split = [...definers.entries()]
    .filter(([, set]) => set.size > 1)
    .map(([block, set]) => ({ block, files: [...set] }));
  return { rows, split };
}

const pad = (s, w) => String(s).padEnd(w);
const fmt = (o) =>
  Object.entries(o)
    .map(([k, v]) => `${k}(${v})`)
    .join(" ");

/** Human-readable report. An empty audit fails. */
export function summarize({ rows, split }) {
  if (rows.length === 0) return { ok: false, text: "  FAIL  audited zero stylesheets." };
  const lines = [];
  let misplacedRules = 0;
  let homelessRules = 0;
  for (const r of rows) {
    const fh = Object.values(r.foreignHomed).reduce((a, b) => a + b, 0);
    const hl = Object.values(r.homeless).reduce((a, b) => a + b, 0);
    misplacedRules += fh;
    homelessRules += hl;
    if (fh === 0 && hl === 0) continue;
    lines.push(`  ${pad(r.file, 44)} ${r.rules} rules`);
    if (fh) lines.push(`      belongs to another component: ${fmt(r.foreignHomed)}`);
    if (hl) lines.push(`      no component owns it:         ${fmt(r.homeless)}`);
  }
  if (split.length) {
    lines.push("");
    lines.push("  blocks defined in more than one file:");
    for (const s of split) lines.push(`      ${pad(s.block, 32)} ${s.files.join(", ")}`);
  }
  lines.push("");
  lines.push(
    `  ${rows.length} stylesheets: ${misplacedRules} rules define a block another component owns, ${homelessRules} rules define blocks no component owns, ${split.length} blocks are split across files.`,
  );
  return { ok: misplacedRules === 0 && homelessRules === 0 && split.length === 0, text: lines.join("\n") };
}

// ── Impure shell ────────────────────────────────────────────────────────

function collect() {
  const dirs = readdirSync(COMPONENTS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  const files = [];
  const sourcesByDir = {};
  for (const d of dirs) {
    const p = join(COMPONENTS, d, `${d}.css`);
    if (existsSync(p)) files.push({ name: `components/${d}/${d}.css`, dir: d, css: readFileSync(p, "utf-8") });
    const t = join(COMPONENTS, d, `${d}.tsx`);
    if (existsSync(t)) sourcesByDir[d] = readFileSync(t, "utf-8");
  }
  for (const g of GLOBAL_FILES) {
    if (existsSync(g.path)) files.push({ ...g, dir: null, css: readFileSync(g.path, "utf-8") });
  }
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf-8"));
  const declaredByDir = {};
  for (const e of manifest.cssOnlyComponents || []) if (typeof e !== "string") declaredByDir[e.name] = e.blocks || [];
  for (const [d, blocks] of Object.entries(manifest.foreignBlocks || {})) declaredByDir[d] = [...(declaredByDir[d] || []), ...blocks];
  return { dirs, files, sourcesByDir, declaredByDir };
}

function main() {
  const args = process.argv.slice(2);
  const jsonAt = args.indexOf("--json");
  const { dirs, files, sourcesByDir, declaredByDir } = collect();
  console.log("\n── CSS home audit ──\n");
  const result = auditFiles(files, dirs, sourcesByDir, declaredByDir);
  const { ok, text } = summarize(result);
  console.log(text);
  if (jsonAt !== -1) {
    writeFileSync(args[jsonAt + 1], `${JSON.stringify(result, null, 2)}\n`);
    console.log(`\n  wrote ${args[jsonAt + 1]}`);
  }
  process.exit(ok ? 0 : 1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

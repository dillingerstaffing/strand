#!/usr/bin/env node
// Prop parity: every component offers the same props in Preact, Vue and
// Svelte, under each framework's own idiom.
//
// Preact declares `interface XProps`; Vue declares the same interface for
// `defineProps` and its events with `defineEmits`; Svelte declares
// `export let x` and lower-case `onx` callback props. A data prop must exist
// under the same name in all three. A Preact callback `onFoo` must be a Vue
// emit `foo` (or `update:foo`) and a Svelte `onfoo` prop or dispatched event.
// `className`, `children` and slot-typed props (ComponentChildren, VNode) are
// framework surface, not API, and are not compared. Known, reasoned
// divergences are recorded in parity-manifest.json#/propDrift.
//
//   pnpm test:prop-parity

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = join(ROOT, "parity-manifest.json");

// ── Pure decision layer ─────────────────────────────────────────────────

const SLOT_TYPE = /ComponentChildren|VNode|JSX\.Element|preact\.ComponentChild/;

/** Members of `interface <Name>Props` (following one level of extends within the file). */
export function propsFromInterface(source, interfaceName, fileName = "x.tsx") {
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, fileName.endsWith(".ts") ? ts.ScriptKind.TS : ts.ScriptKind.TSX);
  const interfaces = new Map();
  ts.forEachChild(sf, (n) => {
    if (ts.isInterfaceDeclaration(n)) interfaces.set(n.name.text, n);
  });
  const out = { data: [], callbacks: [], slots: [] };
  const visit = (name, depth = 0) => {
    const decl = interfaces.get(name);
    if (!decl || depth > 2) return;
    for (const m of decl.members) {
      if (!ts.isPropertySignature(m) || !m.name) continue;
      const key = m.name.getText(sf).replace(/["']/g, "");
      const type = m.type ? m.type.getText(sf) : "";
      if (key === "className" || key === "children" || key === "class" || key === "style") continue;
      if (SLOT_TYPE.test(type)) out.slots.push(key);
      else if (/^on[A-Z]/.test(key)) out.callbacks.push(key.slice(2, 3).toLowerCase() + key.slice(3));
      else out.data.push(key);
    }
    for (const h of decl.heritageClauses || []) for (const t of h.types) visit(t.expression.getText(sf), depth + 1);
  };
  visit(interfaceName);
  return out;
}

/** The <script> content of an SFC (Vue: setup script; Svelte: script). */
export function scriptOf(sfc) {
  // The doc comment at the top of an SFC carries an example with its own
  // <script>, so comments go first; a module script and an instance script
  // are read together.
  return [...sfc.replace(/<!--[\s\S]*?-->/g, "").matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("\n");
}

/** Vue: props from the interface passed to defineProps, or the object literal; emits from defineEmits. */
export function vueApi(sfc) {
  const script = scriptOf(sfc);
  let data = [];
  let callbacks = [];
  const generic = script.match(/defineProps<\s*([A-Za-z0-9_]+)\s*>/);
  if (generic) {
    const p = propsFromInterface(script, generic[1], "x.ts");
    data = p.data;
    callbacks = p.callbacks;
  } else {
    const obj = script.match(/defineProps\(\s*\{([\s\S]*?)\}\s*\)/);
    if (obj) data = [...obj[1].matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:/gm)].map((m) => m[1]);
    const arr = script.match(/defineProps\(\s*\[([\s\S]*?)\]\s*\)/);
    if (arr) data = [...arr[1].matchAll(/["']([A-Za-z_][A-Za-z0-9_:-]*)["']/g)].map((m) => m[1]);
  }
  const emits = [];
  const em = script.match(/defineEmits<\s*\{([\s\S]*?)\}\s*>\s*\(\)/);
  if (em) {
    // call-signature style `(e: 'change', ...): void` and property style `change: [ ... ]`
    for (const m of em[1].matchAll(/\(\s*e:\s*["']([A-Za-z0-9_:-]+)["']/g)) emits.push(m[1]);
    for (const m of em[1].matchAll(/(?:^|[;{\n])\s*["']?([A-Za-z0-9_:-]+)["']?\s*:\s*\[/g)) emits.push(m[1]);
  }
  const emArr = script.match(/defineEmits\(\s*\[([\s\S]*?)\]\s*\)/);
  if (emArr) for (const m of emArr[1].matchAll(/["']([A-Za-z0-9_:-]+)["']/g)) emits.push(m[1]);
  return { data, callbacks, emits };
}

/** Svelte: `export let x`, lower-case `onx` callback props, dispatched events. */
export function svelteApi(sfc) {
  const script = scriptOf(sfc);
  const data = [];
  const callbacks = [];
  for (const m of script.matchAll(/^\s*export let ([A-Za-z_][A-Za-z0-9_]*)([^\n]*)/gm)) {
    const name = m[1];
    // `once` is data; `onclick: ((e) => void) | undefined` is a callback.
    if (/^on[a-z]/.test(name) && /=>/.test(m[2])) callbacks.push(name.slice(2));
    else data.push(name);
  }
  const events = [...script.matchAll(/dispatch\(\s*["']([A-Za-z0-9_:-]+)["']/g)].map((m) => m[1]);
  return { data, callbacks, events };
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// Each framework's spelling of the same thing. Vue models a value as
// `modelValue` + `update:modelValue`; the change callbacks that drive it are
// satisfied by that emit.
const VUE_DATA_ALIASES = { value: ["modelValue"], checked: ["modelValue"] };
const VUE_MODEL_EVENTS = new Set(["change", "input", "valuechange", "checkedchange"]);

/**
 * Compare one component. Returns the props each port lacks.
 * @param {{data:string[], callbacks:string[]}} preact
 * @param {{data:string[], callbacks:string[], emits:string[]}} vue
 * @param {{data:string[], callbacks:string[], events:string[]}} svelte
 */
export function compare(preact, vue, svelte) {
  const vueHas = new Set([...vue.data, ...vue.callbacks].map(norm));
  const vueEmits = new Set([...vue.emits.map((e) => norm(e.replace(/^update:/, ""))), ...vue.callbacks.map(norm)]);
  const svelteHas = new Set(svelte.data.map(norm));
  const svelteEvents = new Set([...svelte.callbacks, ...svelte.events].map(norm));
  const missing = { vue: [], svelte: [] };
  const vueModel = vue.data.map(norm).includes("modelvalue");
  for (const p of preact.data) {
    const aliases = [p, ...(VUE_DATA_ALIASES[p] || [])].map(norm);
    if (!aliases.some((a) => vueHas.has(a))) missing.vue.push(p);
    if (!svelteHas.has(norm(p))) missing.svelte.push(p);
  }
  for (const c of preact.callbacks) {
    const n = norm(c);
    const asProp = `on${c[0].toUpperCase()}${c.slice(1)}`;
    const vueOk = vueEmits.has(n) || vueHas.has(`on${n}`) || (VUE_MODEL_EVENTS.has(n) && (vueModel || vueEmits.has("modelvalue")));
    if (!vueOk) missing.vue.push(asProp);
    if (!svelteEvents.has(n) && !svelteHas.has(`on${n}`)) missing.svelte.push(asProp);
  }
  return missing;
}

/** Apply the recorded drift: a missing prop that is recorded is accepted; a recorded prop that is present is stale. */
export function classify(missingByComponent, drift) {
  const undeclared = [];
  const stale = [];
  for (const [name, missing] of Object.entries(missingByComponent)) {
    for (const port of ["vue", "svelte"]) {
      const recorded = new Set(((drift[name] || {})[port] || []).map((x) => (typeof x === "string" ? x : x.prop)));
      for (const p of missing[port]) if (!recorded.has(p)) undeclared.push({ name, port, prop: p });
      for (const r of recorded) if (!missing[port].includes(r)) stale.push({ name, port, prop: r });
    }
  }
  return { undeclared, stale };
}

export function summarize({ undeclared, stale }, compared) {
  const lines = [`  ${compared} components compared across Preact, Vue and Svelte.`];
  for (const u of undeclared) lines.push(`  MISSING  ${u.name}: ${u.port} lacks \`${u.prop}\`. Add it, or record it in parity-manifest.json#/propDrift with a reason.`);
  for (const s of stale) lines.push(`  STALE    ${s.name}: propDrift records \`${s.prop}\` for ${s.port}, which now has it. Remove the entry.`);
  const ok = undeclared.length === 0 && stale.length === 0 && compared > 0;
  lines.push(ok ? "  PASS  every port offers every prop, under its own idiom." : "  FAIL  a port is missing a prop.");
  return { ok, text: lines.join("\n") };
}

// ── Impure shell ────────────────────────────────────────────────────────

function main() {
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf-8"));
  const drift = manifest.propDrift || {};
  const missingByComponent = {};
  let compared = 0;
  for (const name of manifest.components) {
    const tsx = join(ROOT, "packages/strand-ui/src/components", name, `${name}.tsx`);
    const vue = join(ROOT, "packages/strand-vue/src/components", name, `${name}.vue`);
    const svelte = join(ROOT, "packages/strand-svelte/src/components", name, `${name}.svelte`);
    if (!existsSync(tsx) || !existsSync(vue) || !existsSync(svelte)) continue;
    const preact = propsFromInterface(readFileSync(tsx, "utf-8"), `${name}Props`);
    if (preact.data.length + preact.callbacks.length === 0) continue; // styled families and prop-less components
    missingByComponent[name] = compare(preact, vueApi(readFileSync(vue, "utf-8")), svelteApi(readFileSync(svelte, "utf-8")));
    compared++;
  }
  const { ok, text } = summarize(classify(missingByComponent, drift), compared);
  console.log("\n── Prop parity ──\n");
  console.log(text);
  process.exit(ok ? 0 : 1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

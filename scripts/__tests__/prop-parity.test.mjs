import { describe, expect, it } from "vitest";
import { classify, compare, propsFromInterface, scriptOf, summarize, svelteApi, vueApi } from "../prop-parity.mjs";

describe("propsFromInterface", () => {
  it("splits data props, callbacks and slot-typed props, and skips className and children", () => {
    const src = `import type { ComponentChildren } from "preact";
export interface XProps extends BaseProps { variant?: "a" | "b"; onChange?: (v: number) => void; logo?: ComponentChildren; className?: string; children?: ComponentChildren; }
export interface BaseProps { size?: "sm"; }`;
    expect(propsFromInterface(src, "XProps")).toEqual({ data: ["variant", "size"], callbacks: ["change"], slots: ["logo"] });
  });
});

describe("scriptOf", () => {
  it("ignores the example inside the doc comment and joins module and instance scripts", () => {
    const sfc = `<!-- @example <script>ignored</script> --><script context="module">export const A = 1</script><script lang="ts">export let b = 2</script>`;
    expect(scriptOf(sfc)).toContain("A = 1");
    expect(scriptOf(sfc)).toContain("b = 2");
    expect(scriptOf(sfc)).not.toContain("ignored");
  });
});

describe("vueApi", () => {
  it("reads props from the defineProps interface and emits in both styles", () => {
    const sfc = `<script setup lang="ts">
interface Props { modelValue?: string; clearable?: boolean }
const props = withDefaults(defineProps<Props>(), { clearable: false })
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void; clear: [] }>()
</script>`;
    expect(vueApi(sfc)).toEqual({ data: ["modelValue", "clearable"], callbacks: [], emits: ["update:modelValue", "clear"] });
  });
});

describe("svelteApi", () => {
  it("reads export let props, telling a callback from a data prop that merely starts with on", () => {
    const sfc = `<script lang="ts">
  export let once: boolean = true
  export let onclick: ((e: MouseEvent) => void) | undefined = undefined
  const dispatch = createEventDispatcher(); dispatch('select')
</script>`;
    expect(svelteApi(sfc)).toEqual({ data: ["once"], callbacks: ["click"], events: ["select"] });
  });
});

describe("compare", () => {
  const preact = { data: ["value", "size"], callbacks: ["change", "clear"] };
  it("accepts each framework's idiom for a value and its change", () => {
    const vue = { data: ["modelValue", "size"], callbacks: [], emits: ["update:modelValue", "clear"] };
    const svelte = { data: ["value", "size"], callbacks: ["change"], events: ["clear"] };
    expect(compare(preact, vue, svelte)).toEqual({ vue: [], svelte: [] });
  });
  it("accepts a bindable Svelte prop for a Preact default value", () => {
    const vue = { data: ["checked", "defaultChecked"], callbacks: [], emits: ["change"] };
    const svelte = { data: ["checked"], callbacks: ["change"], events: [] };
    expect(compare({ data: ["checked", "defaultChecked"], callbacks: ["change"] }, vue, svelte)).toEqual({ vue: [], svelte: [] });
  });
  it("names what a port lacks", () => {
    const vue = { data: ["modelValue"], callbacks: [], emits: [] };
    const svelte = { data: ["value"], callbacks: [], events: [] };
    expect(compare(preact, vue, svelte)).toEqual({ vue: ["size", "onClear"], svelte: ["size", "onChange", "onClear"] });
  });
});

describe("classify and summarize", () => {
  it("accepts recorded drift, flags undeclared and stale entries, and fails an empty run", () => {
    const missing = { Nav: { vue: ["menuOpen"], svelte: [] } };
    const r = classify(missing, { Nav: { vue: ["menuOpen", "gone"] } });
    expect(r.undeclared).toEqual([]);
    expect(r.stale).toEqual([{ name: "Nav", port: "vue", prop: "gone" }]);
    expect(summarize(r, 1).ok).toBe(false);
    expect(summarize(classify({}, {}), 0).ok).toBe(false);
    expect(summarize(classify({ Nav: { vue: [], svelte: [] } }, {}), 1).ok).toBe(true);
  });
});

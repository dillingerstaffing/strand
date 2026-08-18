/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import * as Svelte from "./index";
import { svelteApi } from "../../../scripts/prop-parity.mjs";
import { componentsWithFixtures, judge } from "../../strand-ui/src/test/markup-parity";
import { normalizeMarkup, serialize } from "../../strand-ui/src/test/serialize";

// The platform pieces the ports subscribe to and jsdom lacks.
vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });

const WRAPPERS = resolve(__dirname, "__parity__");

/**
 * A Preact fixture translated to the Svelte idiom: children and slot-typed
 * props become slots, which legacy Svelte can only receive from markup, so a
 * wrapper component is written per fixture that needs one; everything else is
 * a prop.
 */
function toSvelte(name: string, index: number, sfc: string, slotsOf: string[], props: Record<string, unknown>, children?: string) {
  const declared = new Set(svelteApi(sfc).data);
  const svelteProps: Record<string, unknown> = {};
  const slots: Record<string, string> = {};
  if (children !== undefined) slots.default = children;
  for (const [key, value] of Object.entries(props)) {
    if (slotsOf.includes(key) && !declared.has(key) && sfc.includes(`name="${key}"`)) slots[key] = String(value);
    else svelteProps[key] = value;
  }
  if (Object.keys(slots).length === 0) return { props: svelteProps, wrapper: null };
  const text = (s: string) => `{${JSON.stringify(s)}}`;
  const named = Object.entries(slots)
    .filter(([k]) => k !== "default")
    .map(([k, v]) => `<svelte:fragment slot="${k}">${text(v)}</svelte:fragment>`)
    .join("");
  const source = `<script lang="ts">
  import C from '../components/${name}/${name}.svelte'
  export let props: Record<string, unknown> = {}
</script>

<C {...props}>${slots.default !== undefined ? text(slots.default) : ""}${named}</C>
`;
  const file = resolve(WRAPPERS, `${name}__${index}.svelte`);
  writeFileSync(file, source);
  return { props: svelteProps, wrapper: file };
}

rmSync(WRAPPERS, { recursive: true, force: true });
mkdirSync(WRAPPERS, { recursive: true });

describe("markup parity with the Preact fixtures", () => {
  for (const { name, fixturesPath, slots } of componentsWithFixtures()) {
    const Component = (Svelte as Record<string, unknown>)[name] as never;
    if (!Component) continue;
    it(`${name} renders every fixture as the Preact snapshot does, or the divergence is recorded in parity-manifest.json#/markupDrift/svelte`, async () => {
      const sfc = readFileSync(resolve(__dirname, "components", name, `${name}.svelte`), "utf8");
      const { fixtures } = await import(fixturesPath);
      const actual: Record<string, string> = {};
      let index = 0;
      for (const f of fixtures) {
        const key = `${name} > ${f.name}`;
        try {
          const { props, wrapper } = toSvelte(name, index++, sfc, slots, f.props ?? {}, f.children);
          const target = wrapper ? (await import(/* @vite-ignore */ wrapper)).default : Component;
          const { container } = render(target, { props: wrapper ? { props } : props });
          actual[key] = normalizeMarkup([...container.childNodes].map(serialize).join(""));
        } catch (e) {
          actual[key] = `THROWS: ${(e as Error).message.split("\n")[0]}`;
        }
      }
      const { undeclared, stale } = judge("svelte", actual);
      const report = [
        ...undeclared.map((u) => `  DRIFT   ${u}`),
        ...stale.map((s) => `  STALE   ${s} is recorded in markupDrift.svelte but now matches. Remove the entry.`),
      ].join("\n");
      expect(undeclared.concat(stale), report).toEqual([]);
    });
  }
});

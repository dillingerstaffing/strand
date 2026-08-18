/*! Strand Vue | MIT License | dillingerstaffing.com */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";
import * as Vue from "./index";
import { vueApi } from "../../../scripts/prop-parity.mjs";
import { componentsWithFixtures, judge } from "../../strand-ui/src/test/markup-parity";
import { normalizeMarkup, serialize } from "../../strand-ui/src/test/serialize";

// The platform pieces the ports subscribe to and jsdom lacks.
vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });

/**
 * A Preact fixture translated to the Vue idiom: children and slot-typed props
 * become slots, `value`/`checked` become `modelValue` where the port declares
 * it, everything else is a prop.
 */
function toVue(sfc: string, slotsOf: string[], props: Record<string, unknown>, children?: string) {
  const api = vueApi(sfc);
  const declared = new Set(api.data);
  const vueProps: Record<string, unknown> = {};
  const slots: Record<string, string> = {};
  if (children !== undefined) slots.default = children;
  for (const [key, value] of Object.entries(props)) {
    if (slotsOf.includes(key) && !declared.has(key) && (sfc.includes(`name="${key}"`) || sfc.includes(`$slots.${key}`))) slots[key] = String(value);
    else if ((key === "value" || key === "checked") && !declared.has(key) && declared.has("modelValue")) vueProps.modelValue = value;
    else vueProps[key] = value;
  }
  return { props: vueProps, slots };
}

describe("markup parity with the Preact fixtures", () => {
  for (const { name, fixturesPath, slots } of componentsWithFixtures()) {
    const Component = (Vue as Record<string, unknown>)[name] as never;
    if (!Component) continue;
    it(`${name} renders every fixture as the Preact snapshot does, or the divergence is recorded in parity-manifest.json#/markupDrift/vue`, async () => {
      const sfc = readFileSync(resolve(__dirname, "components", name, `${name}.vue`), "utf8");
      const { fixtures } = await import(fixturesPath);
      const actual: Record<string, string> = {};
      for (const f of fixtures) {
        const key = `${name} > ${f.name}`;
        try {
          const { container } = render(Component, toVue(sfc, slots, f.props ?? {}, f.children));
          actual[key] = normalizeMarkup([...container.childNodes].map(serialize).join(""));
        } catch (e) {
          actual[key] = `THROWS: ${(e as Error).message.split("\n")[0]}`;
        }
      }
      const { undeclared, stale } = judge("vue", actual);
      const report = [
        ...undeclared.map((u) => `  DRIFT   ${u}`),
        ...stale.map((s) => `  STALE   ${s} is recorded in markupDrift.vue but now matches. Remove the entry.`),
      ].join("\n");
      expect(undeclared.concat(stale), report).toEqual([]);
    });
  }
});

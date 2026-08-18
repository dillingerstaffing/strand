import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { normalizeMarkup } from "./serialize.js";
import { propsFromInterface } from "../../../../scripts/prop-parity.mjs";

export const COMPONENTS_DIR = resolve(__dirname, "../components");
export const MANIFEST_PATH = resolve(__dirname, "../../../../parity-manifest.json");

export interface FixtureCase {
  name: string;
  props: Record<string, unknown>;
  children?: string;
}

/** Every component directory that carries fixtures, with the Preact prop shape. */
export function componentsWithFixtures(): { name: string; fixturesPath: string; slots: string[]; data: string[] }[] {
  return readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => existsSync(resolve(COMPONENTS_DIR, name, `${name}.fixtures.ts`)))
    .map((name) => {
      const src = readFileSync(resolve(COMPONENTS_DIR, name, `${name}.tsx`), "utf8");
      const api = propsFromInterface(src, `${name}Props`, `${name}.tsx`);
      return { name, fixturesPath: resolve(COMPONENTS_DIR, name, `${name}.fixtures.ts`), slots: api.slots, data: api.data };
    });
}

/** The Preact snapshots of a component's fixtures, name -> normalized markup. */
export function preactSnapshots(name: string): Record<string, string> {
  const p = resolve(COMPONENTS_DIR, name, "__snapshots__", `${name}.test.tsx.snap`);
  if (!existsSync(p)) return {};
  const bag: Record<string, string> = {};
  new Function("exports", readFileSync(p, "utf8"))(bag);
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(bag)) {
    const m = /^renders > (.+) 1$/.exec(key);
    if (!m) continue;
    const s = String(raw);
    out[m[1]] = normalizeMarkup(s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
  }
  return out;
}

/** The recorded drift for a port: "Component > fixture" -> reason. */
export function recordedDrift(port: "vue" | "svelte"): Record<string, string> {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  return (manifest.markupDrift ?? {})[port] ?? {};
}

/** Where two markups first differ, with a little context either side. */
export function firstDifference(a: string, b: string): string {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const from = Math.max(0, i - 40);
  return `...${a.slice(from, i + 60)}\n    vs ...${b.slice(from, i + 60)}`;
}

/** Judge one port's renders against the Preact snapshots and the recorded drift. */
export function judge(port: "vue" | "svelte", actual: Record<string, string>): { undeclared: string[]; stale: string[]; identical: number } {
  const recorded = recordedDrift(port);
  const undeclared: string[] = [];
  const stale: string[] = [];
  let identical = 0;
  for (const [key, value] of Object.entries(actual)) {
    const [name, fixture] = key.split(" > ");
    const want = preactSnapshots(name)[fixture];
    if (want === value) {
      identical++;
      if (recorded[key]) stale.push(key);
    } else if (!recorded[key]) {
      undeclared.push(`${key}\n    ${firstDifference(want ?? "(no preact snapshot)", value)}`);
    }
  }
  return { undeclared, stale, identical };
}

import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "default", props: {  }, children: "Readouts" },
  { name: "grid", props: { grid: true }, children: "Readouts" },
  { name: "full bleed", props: { fullBleed: true }, children: "Readouts" },
];

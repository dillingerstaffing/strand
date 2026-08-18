import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "tip", props: {  }, children: "trigger" },
  { name: "pinned", props: { pinned: true }, children: "trigger" },
];

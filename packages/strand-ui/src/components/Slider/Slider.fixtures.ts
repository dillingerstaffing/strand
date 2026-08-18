import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "default", props: {  } },
  { name: "bounded value", props: { min: 10, max: 50, step: 5, value: 25 } },
  { name: "disabled", props: { disabled: true } },
];

import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "default", props: {  }, children: "Fades" },
  { name: "threshold not once", props: { threshold: 0.5, once: false }, children: "Fades" },
];

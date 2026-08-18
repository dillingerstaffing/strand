import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "hidden by default", props: {  }, children: "Action" },
  { name: "visible", props: { visible: true }, children: "Action" },
];

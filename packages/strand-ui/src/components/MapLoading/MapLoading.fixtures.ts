import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "visible", props: {  } },
  { name: "hidden custom text", props: { visible: false, text: "Scanning" } },
];

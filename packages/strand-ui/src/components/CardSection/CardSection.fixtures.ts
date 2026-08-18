import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "body", props: {  }, children: "Body" },
  { name: "header", props: { header: true }, children: "Title" },
];

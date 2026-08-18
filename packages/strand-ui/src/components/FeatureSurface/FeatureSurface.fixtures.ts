import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "default", props: {  }, children: "Body" },
  { name: "article none", props: { as: "article", padding: "none" }, children: "Body" },
  { name: "section xl", props: { as: "section", padding: "xl" }, children: "Body" },
];

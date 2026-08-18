import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "div", props: {  }, children: "6 people" },
  { name: "span keyed", props: { as: "span", on: 7 }, children: "7 people" },
];

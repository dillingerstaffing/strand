import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "solid default", props: {  }, children: "Tag" },
  { name: "outlined teal", props: { variant: "outlined", status: "teal" }, children: "Tag" },
  { name: "removable red", props: { status: "red", removable: true }, children: "Tag" },
  { name: "blue", props: { status: "blue" }, children: "T" },
  { name: "amber", props: { status: "amber" }, children: "T" },
];

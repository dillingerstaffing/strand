import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "bar determinate", props: { value: 65 } },
  { name: "bar indeterminate sm", props: { size: "sm" } },
  { name: "ring determinate lg", props: { variant: "ring", value: 62, size: "lg" } },
  { name: "ring indeterminate", props: { variant: "ring" } },
  { name: "ring sm", props: { variant: "ring", value: 10, size: "sm" } },
  { name: "named with value text", props: { value: 30, label: "Upload", valueText: "3 of 10 files" } },
];

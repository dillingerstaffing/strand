import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "bar determinate", props: { value: 65 } },
  { name: "bar indeterminate sm", props: { size: "sm" } },
  { name: "ring determinate lg", props: { variant: "ring", value: 62, size: "lg" } },
  { name: "ring indeterminate", props: { variant: "ring" } },
  { name: "ring sm", props: { variant: "ring", value: 10, size: "sm" } },
];

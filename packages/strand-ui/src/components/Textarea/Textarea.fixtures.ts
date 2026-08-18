import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "plain", props: { placeholder: "Notes" } },
  { name: "count and resize", props: { value: "hello", maxLength: 100, showCount: true, autoResize: true } },
  { name: "error disabled", props: { error: true, disabled: true } },
];

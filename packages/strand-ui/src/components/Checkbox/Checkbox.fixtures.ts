import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "unchecked", props: { label: "Accept" } },
  { name: "checked", props: { checked: true, label: "Accept" } },
  { name: "indeterminate", props: { indeterminate: true, label: "Some" } },
  { name: "disabled checked", props: { checked: true, disabled: true, label: "Locked" } },
  { name: "compact no label", props: { density: "compact" } },
];

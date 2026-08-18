import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "unchecked", props: { name: "plan", value: "free", label: "Free" } },
  { name: "checked", props: { name: "plan", value: "pro", label: "Pro", checked: true } },
  { name: "disabled compact", props: { name: "plan", value: "x", disabled: true, density: "compact" } },
];

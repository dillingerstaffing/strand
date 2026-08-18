import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "off", props: { label: "Dark mode" } },
  { name: "on", props: { checked: true, label: "Dark mode" } },
  { name: "disabled compact", props: { disabled: true, density: "compact" } },
];

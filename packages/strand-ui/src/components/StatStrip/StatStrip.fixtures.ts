import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "plain", props: { items: [{ label: "Group", value: "East Bay" }, { label: "Meet at", value: "Skyline Gate" }] } },
  { name: "bordered", props: { variant: "bordered", items: [{ label: "A", value: "1" }] } },
];

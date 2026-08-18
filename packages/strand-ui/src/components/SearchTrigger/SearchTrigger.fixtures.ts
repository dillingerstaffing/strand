import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "field", props: { label: "Search events" } },
  { name: "full expanded", props: { variant: "full", expanded: true, controls: "palette" } },
  { name: "icon", props: { variant: "icon" } },
];

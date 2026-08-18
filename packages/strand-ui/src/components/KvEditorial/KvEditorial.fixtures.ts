import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "plain", props: { label: "Owner", value: "Ada" } },
  { name: "status", props: { label: "Status", value: "Live", status: true } },
];

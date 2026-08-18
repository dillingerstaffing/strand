import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "md", props: { label: "Uptime", value: "99.9%" } },
  { name: "sm", props: { label: "Uptime", value: 42, size: "sm" } },
  { name: "lg", props: { label: "Uptime", value: "1", size: "lg" } },
  { name: "xl", props: { label: "Uptime", value: "1", size: "xl" } },
];

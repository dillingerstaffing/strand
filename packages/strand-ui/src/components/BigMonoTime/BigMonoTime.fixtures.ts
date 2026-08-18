import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "single", props: { value: "06:45" } },
  { name: "range lg", props: { value: "06:45", until: "08:30", size: "lg" } },
  { name: "sm with datetime", props: { value: "06:45", size: "sm", dateTime: "2026-08-13T06:45" } },
  { name: "custom separator", props: { value: "1", until: "2", separator: "to" } },
];

import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "count", props: { count: 5 } },
  { name: "count over max", props: { count: 120, maxCount: 99 } },
  { name: "dot", props: { variant: "dot" } },
  { name: "dot live teal", props: { variant: "dot", status: "teal", live: true } },
  { name: "count red wrapping content", props: { count: 3, status: "red" }, children: "Inbox" },
  { name: "blue", props: { count: 1, status: "blue" } },
  { name: "amber", props: { count: 1, status: "amber" } },
];

import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "top", props: { content: "Save" }, children: "Trigger" },
  { name: "bottom", props: { content: "Save", position: "bottom", delay: 0 }, children: "Trigger" },
  { name: "left", props: { content: "L", position: "left" }, children: "T" },
  { name: "right", props: { content: "R", position: "right" }, children: "T" },
];

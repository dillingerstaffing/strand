import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "closed", props: { open: false }, children: "Body" },
  { name: "open with title", props: { open: true, title: "Confirm" }, children: "Are you sure?" },
  { name: "start aligned no padding not dismissible", props: { open: true, align: "start", padding: "none", dismissible: false, "aria-label": "Palette" }, children: "Body" },
  { name: "end aligned sm", props: { open: true, align: "end", padding: "sm", "aria-label": "Sheet" }, children: "Body" },
];

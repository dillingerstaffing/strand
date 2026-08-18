import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "closed", props: { open: false, label: "Filters" }, children: "Body" },
  { name: "open with head and action", props: { open: true, label: "Filters", head: "Head", action: "Show 6" }, children: "Body" },
  { name: "open not draggable", props: { open: true, label: "Filters", draggable: false }, children: "Body" },
];

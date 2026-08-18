import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "closed", props: { open: false, items: [], query: "", label: "Search" } },
  { name: "open with items", props: { open: true, items: [{ id: "a", label: "Alpha", sublabel: "first", badge: "A" }, { id: "b", label: "Beta" }], query: "a", placeholder: "Jump to", label: "Search" } },
  { name: "open empty", props: { open: true, items: [], query: "zzz", emptyLabel: "Nothing", label: "Search" } },
];

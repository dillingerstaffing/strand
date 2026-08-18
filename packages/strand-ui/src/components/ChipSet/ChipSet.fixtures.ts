import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "multi wrap", props: { label: "Interests", items: [{ id: "a", label: "Trails" }, { id: "b", label: "Chess" }], selected: ["a"] } },
  { name: "single scroll sm", props: { label: "Filter", mode: "single", overflow: "scroll", size: "sm", items: [{ id: "all", label: "All" }, { id: "mine", label: "Mine" }], selected: ["all"] } },
  { name: "empty", props: { label: "None", items: [] } },
];

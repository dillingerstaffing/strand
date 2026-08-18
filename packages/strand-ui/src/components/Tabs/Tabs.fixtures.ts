import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "two tabs", props: { tabs: [{ id: "one", label: "One", content: "First" }, { id: "two", label: "Two", content: "Second" }], activeTab: "two" } },
];

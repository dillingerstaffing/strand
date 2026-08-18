import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "two tabs", props: { tabs: [{ id: "one", label: "One", content: "First" }, { id: "two", label: "Two", content: "Second" }], activeTab: "two" } },
  { name: "instrument uncontrolled", props: { variant: "instrument", tabs: [{ id: "live", label: "Live", content: "Now" }, { id: "queue", label: "Queue", content: "Later" }] } },
];

import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "results", props: { count: "12 matches detected" }, children: "items" },
  { name: "empty state", props: { state: "empty", stateTitle: "0 matches detected", stateHint: "Widen the search" } },
  { name: "error state hidden", props: { state: "error", stateTitle: "Process interrupted", visible: false, label: "Jobs" } },
];

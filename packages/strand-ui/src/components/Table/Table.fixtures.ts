import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "sortable", props: { columns: [{ key: "name", header: "Name", sortable: true }, { key: "role", header: "Role", width: "120px" }], data: [{ name: "Jane", role: "Engineer" }, { name: "Alex", role: "Designer" }] } },
  { name: "empty", props: { columns: [{ key: "a", header: "A" }], data: [] } },
];

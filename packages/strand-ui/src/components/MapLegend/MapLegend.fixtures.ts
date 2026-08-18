import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "plain items", props: { items: [{ category: "tech", label: "Technology" }, { category: "health", label: "Health" }] } },
  { name: "custom title", props: { title: "Sectors", items: [{ category: "trades", label: "Trades" }, { category: "finance", label: "Finance" }] } },
];

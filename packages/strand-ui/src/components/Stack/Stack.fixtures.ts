import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "vertical", props: {  }, children: "items" },
  { name: "horizontal center between wrap", props: { direction: "horizontal", gap: 2, align: "center", justify: "between", wrap: true }, children: "items" },
  { name: "as ul gap 0", props: { as: "ul", gap: 0 }, children: "items" },
  { name: "off ladder gap", props: { gap: 7 }, children: "items" },
  { name: "end around", props: { align: "end", justify: "around" }, children: "items" },
];

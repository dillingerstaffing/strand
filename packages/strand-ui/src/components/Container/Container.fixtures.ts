import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "default", props: {  }, children: "Content" },
  { name: "narrow", props: { size: "narrow" }, children: "Content" },
  { name: "wide as main", props: { size: "wide", as: "main" }, children: "Content" },
  { name: "full", props: { size: "full" }, children: "Content" },
];

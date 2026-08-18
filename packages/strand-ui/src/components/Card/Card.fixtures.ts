import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "elevated md", props: {  }, children: "Body" },
  { name: "outlined sm", props: { variant: "outlined", padding: "sm" }, children: "Body" },
  { name: "flat none", props: { variant: "flat", padding: "none" }, children: "Body" },
  { name: "warm xl", props: { variant: "warm", padding: "xl" }, children: "Body" },
  { name: "interactive active", props: { interactive: true, active: true }, children: "Body" },
  { name: "legacy interactive variant", props: { variant: "interactive" }, children: "Body" },
  { name: "as article lg", props: { as: "article", padding: "lg" }, children: "Body" },
];

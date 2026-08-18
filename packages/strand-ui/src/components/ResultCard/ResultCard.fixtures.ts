import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "full", props: { title: "Systems Engineer", company: "Acme", location: "Oakland", salary: "$100k", badges: [{ label: "Remote", variant: "remote" }, { label: "Board", variant: "source" }, { label: "Plain" }] } },
  { name: "title only active", props: { title: "Only", active: true } },
];

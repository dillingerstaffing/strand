import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "links with current", props: { current: "b", items: [{ id: "a", label: "Discover", href: "/" }, { id: "b", label: "Calendar", href: "/calendar" }] } },
  { name: "buttons", props: { label: "Sections", items: [{ id: "a", label: "One" }, { id: "b", label: "Two" }] } },
];

import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "three items", props: { items: [{ label: "Home", href: "/" }, { label: "Settings", href: "/settings" }, { label: "Profile" }] } },
  { name: "instrument with separator", props: { variant: "instrument", separator: ">", items: [{ label: "A", href: "/a" }, { label: "B" }] } },
  { name: "one item", props: { items: [{ label: "Only" }] } },
  { name: "button item and named landmark", props: { label: "You are here", items: [{ label: "Back", onClick: () => {} }, { label: "Here" }] } },
];

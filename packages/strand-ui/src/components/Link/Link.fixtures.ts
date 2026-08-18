import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "default", props: { href: "/docs" }, children: "Docs" },
  { name: "cta", props: { href: "/docs", variant: "cta" }, children: "Docs" },
  { name: "mono external", props: { href: "https://example.com", variant: "mono", external: true }, children: "Site" },
  { name: "inherit", props: { href: "/x", variant: "inherit" }, children: "Title" },
];

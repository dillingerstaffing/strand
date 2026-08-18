import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "items and slots", props: { logo: "Brand", items: [{ label: "Home", href: "/", active: true }, { label: "About", href: "/about" }], actions: "Sign in" } },
  { name: "glass", props: { items: [{ label: "Home", href: "/" }], glass: true } },
  { name: "no mobile menu", props: { items: [{ label: "Home", href: "/" }], mobileMenu: false } },
  { name: "empty", props: {  } },
];

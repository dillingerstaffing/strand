import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "text", props: { placeholder: "Name" } },
  { name: "email error", props: { type: "email", error: true } },
  { name: "addons", props: { leadingAddon: "$", trailingAddon: ".00" } },
  { name: "disabled", props: { disabled: true } },
  { name: "search", props: { type: "search" } },
];

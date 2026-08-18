import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "primary md", props: {  }, children: "Save" },
  { name: "secondary", props: { variant: "secondary" }, children: "Cancel" },
  { name: "ghost sm", props: { variant: "ghost", size: "sm" }, children: "More" },
  { name: "danger lg", props: { variant: "danger", size: "lg" }, children: "Delete" },
  { name: "loading", props: { loading: true }, children: "Saving" },
  { name: "disabled", props: { disabled: true }, children: "Save" },
  { name: "icon only", props: { iconOnly: true, "aria-label": "Close" }, children: "x" },
  { name: "full width submit", props: { fullWidth: true, type: "submit" }, children: "Send" },
  { name: "anchor", props: { href: "/docs" }, children: "Docs" },
  { name: "disabled anchor", props: { as: "a", href: "/docs", disabled: true }, children: "Docs" },
];

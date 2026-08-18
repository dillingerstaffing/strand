import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "label only", props: { label: "Email", htmlFor: "email" }, children: "control" },
  { name: "hint required", props: { label: "Email", htmlFor: "email", hint: "Work email", required: true }, children: "control" },
  { name: "error", props: { label: "Email", htmlFor: "email", hint: "x", error: "Required" }, children: "control" },
  { name: "success", props: { label: "Name", htmlFor: "name", success: "Available" }, children: "control" },
];

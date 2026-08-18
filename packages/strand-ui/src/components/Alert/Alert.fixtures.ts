import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "info", props: {  }, children: "Message" },
  { name: "success dismissible", props: { status: "success", dismissible: true }, children: "Saved" },
  { name: "warning", props: { status: "warning" }, children: "Careful" },
  { name: "error", props: { status: "error" }, children: "Failed" },
  { name: "titled with action", props: { title: "Draft saved", action: "Undo" }, children: "Your changes are safe." },
];

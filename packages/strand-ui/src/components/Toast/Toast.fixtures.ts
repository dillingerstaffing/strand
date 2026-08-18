import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "info", props: { message: "Saved" } },
  { name: "error", props: { status: "error", message: "Failed" } },
  { name: "success", props: { status: "success", message: "Done" } },
  { name: "warning", props: { status: "warning", message: "Careful" } },
];

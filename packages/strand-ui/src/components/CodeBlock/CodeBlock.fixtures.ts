import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "copyable with language", props: { code: "const x = 1;", language: "js" } },
  { name: "not copyable", props: { code: "plain", copyable: false } },
];

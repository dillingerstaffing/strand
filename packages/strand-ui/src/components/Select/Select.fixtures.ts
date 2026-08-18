import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "options", props: { options: [{ value: "eng", label: "Engineer" }, { value: "design", label: "Designer" }], value: "eng" } },
  { name: "placeholder error disabled", props: { options: [{ value: "a", label: "A" }], placeholder: "Choose", error: true, disabled: true } },
];

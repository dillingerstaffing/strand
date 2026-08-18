import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "unset", props: { value: 0, ariaLabel: "Rate" } },
  { name: "three lg", props: { value: 3, size: "lg", ariaLabel: "Rate" } },
  { name: "read only sm", props: { value: 4, readOnly: true, size: "sm", ariaLabel: "Rated" } },
];

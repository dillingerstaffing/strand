import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "standard", props: {  }, children: "Body" },
  { name: "hero recessed", props: { variant: "hero", background: "recessed" }, children: "Body" },
  { name: "compact elevated border as footer", props: { variant: "compact", background: "elevated", borderTop: true, as: "footer" }, children: "Body" },
];

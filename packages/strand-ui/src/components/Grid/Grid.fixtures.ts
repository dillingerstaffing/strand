import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "default", props: {  }, children: "cells" },
  { name: "three columns gap 6", props: { columns: 3, gap: 6 }, children: "cells" },
  { name: "auto fit", props: { minColWidth: 220, gap: 3 }, children: "cells" },
  { name: "sidebar", props: { sidebar: true }, children: "cells" },
  { name: "split", props: { split: true }, children: "cells" },
  { name: "off ladder gap", props: { gap: 7 }, children: "cells" },
];

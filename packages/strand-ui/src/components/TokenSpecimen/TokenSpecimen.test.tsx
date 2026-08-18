import { describe, expect, it } from "vitest";
import { html } from "../../test/render.js";
import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./TokenSpecimen.fixtures.js";
import * as family from "./TokenSpecimen.js";

snapshotFixtures(family.TokenSpecimen, fixtures);

describe("every export renders its element and class", () => {
  for (const [exportName, Component] of Object.entries(family)) {
    it(exportName, () => {
      expect(html(<Component className="custom">x</Component>)).toMatchSnapshot();
    });
  }
  it("spacer width and box radius and shadow", () => {
    expect(html(<family.TokenSpecimenSpacer width={16} />)).toMatchSnapshot();
    expect(html(<family.TokenSpecimenSpacer width="2rem" />)).toMatchSnapshot();
    expect(html(<family.TokenSpecimenBox radius="8px" shadow="0 1px 2px black" />)).toMatchSnapshot();
  });
});

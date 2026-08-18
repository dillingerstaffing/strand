import { describe, expect, it } from "vitest";
import { html } from "../../test/render.js";
import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./ContainerScale.fixtures.js";
import * as family from "./ContainerScale.js";

snapshotFixtures(family.ContainerScale, fixtures);

describe("every export renders its element and class", () => {
  for (const [exportName, Component] of Object.entries(family)) {
    it(exportName, () => {
      expect(html(<Component className="custom">x</Component>)).toMatchSnapshot();
    });
  }
  it("bar width", () => {
    expect(html(<family.ContainerScaleBar width="60%">640</family.ContainerScaleBar>)).toMatchSnapshot();
  });
});

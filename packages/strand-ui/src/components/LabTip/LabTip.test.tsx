import { describe, expect, it } from "vitest";
import { html } from "../../test/render.js";
import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./LabTip.fixtures.js";
import * as family from "./LabTip.js";

snapshotFixtures(family.LabTip, fixtures);

describe("every export renders its element and class", () => {
  for (const [exportName, Component] of Object.entries(family)) {
    it(exportName, () => {
      expect(html(<Component className="custom">x</Component>)).toMatchSnapshot();
    });
  }
  it("bubble placements", () => {
    for (const placement of ["top", "bottom", "left", "right"] as const) {
      expect(html(<family.LabTipBubble placement={placement}>tip</family.LabTipBubble>)).toMatchSnapshot();
    }
  });
});

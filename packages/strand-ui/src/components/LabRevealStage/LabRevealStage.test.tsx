import { describe, expect, it } from "vitest";
import { html } from "../../test/render.js";
import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./LabRevealStage.fixtures.js";
import * as family from "./LabRevealStage.js";

snapshotFixtures(family.LabRevealStage, fixtures);

describe("every export renders its element and class", () => {
  for (const [exportName, Component] of Object.entries(family)) {
    it(exportName, () => {
      expect(html(<Component className="custom">x</Component>)).toMatchSnapshot();
    });
  }
});

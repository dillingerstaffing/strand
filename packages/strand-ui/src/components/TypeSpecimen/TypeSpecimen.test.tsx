import { describe, expect, it } from "vitest";
import { html } from "../../test/render.js";
import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./TypeSpecimen.fixtures.js";
import * as family from "./TypeSpecimen.js";

snapshotFixtures(family.TypeSpecimen, fixtures);

describe("every export renders its element and class", () => {
  for (const [exportName, Component] of Object.entries(family)) {
    it(exportName, () => {
      expect(html(<Component className="custom">x</Component>)).toMatchSnapshot();
    });
  }
  it("meta keeps nested markup", () => {
    expect(html(<family.TypeSpecimenMeta>Inter <b>48px</b></family.TypeSpecimenMeta>)).toMatchSnapshot();
  });
});

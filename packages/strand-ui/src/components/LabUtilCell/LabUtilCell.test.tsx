import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { html } from "../../test/render.js";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./LabUtilCell.fixtures.js";
import * as family from "./LabUtilCell.js";

snapshotFixtures(family.LabUtilCell, fixtures);

describe("every export renders its element and class", () => {
  for (const [exportName, Component] of Object.entries(family)) {
    it(exportName, () => {
      expect(html(<Component className="custom">x</Component>)).toMatchSnapshot();
    });
  }
});

snapshotStylesheet(resolve(__dirname, "./LabUtilCell.css"));

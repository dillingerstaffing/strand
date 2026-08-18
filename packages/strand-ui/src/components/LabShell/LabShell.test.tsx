import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { html } from "../../test/render.js";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./LabShell.fixtures.js";
import * as family from "./LabShell.js";

snapshotFixtures(family.LabShell, fixtures);

describe("every export renders its element and class", () => {
  for (const [name, Component] of Object.entries(family)) {
    it(name, () => {
      expect(html(<Component className="custom">x</Component>)).toMatchSnapshot();
    });
  }
  it("LabExampleDemo modifiers", () => {
    expect(html(<family.LabExampleDemo padNone recessed>x</family.LabExampleDemo>)).toMatchSnapshot();
  });
  it("LabShell takes the sticky-top override as a custom property", () => {
    const { container } = render(
      <family.LabShell style={{ "--strand-ref-sticky-top": "72px" } as Record<string, string>}>x</family.LabShell>,
    );
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue("--strand-ref-sticky-top")).toBe("72px");
  });
});

snapshotStylesheet(resolve(__dirname, "./LabShell.css"));

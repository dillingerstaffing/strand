import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { html } from "../../test/render.js";
import { snapshotFixtures } from "../../test/snapshot.js";
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

// jsdom has no layout, so the shrinkable-track rule is guarded at the source.
describe("boundary integrity", () => {
  const css = readFileSync(resolve(__dirname, "./LabShell.css"), "utf8").replace(/\s+/g, " ");
  it("main and demo tracks are minmax(0, 1fr) and their columns release min-width", () => {
    expect(css).toContain("grid-template-columns: 256px minmax(0, 1fr)");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr)");
    expect(css).not.toContain("grid-template-columns: 256px 1fr");
    expect(css).toMatch(/\.strand-ref-shell__main\s*\{[^}]*min-width:\s*0/);
    expect(css).toContain("grid-template-columns: 200px minmax(0, 1fr)");
    expect(css).not.toContain("grid-template-columns: 200px 1fr");
    expect(css).toMatch(/\.strand-ref-example\s*>\s*\*\s*\{[^}]*min-width:\s*0/);
  });
});

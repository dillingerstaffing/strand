import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Section } from "./Section.js";

describe("Section", () => {
  // ── Rendering ──

  it("renders a section element", () => {
    const { container } = render(<Section>content</Section>);
    expect(container.firstElementChild?.tagName).toBe("SECTION");
  });

  it("renders the semantic element given by the as prop", () => {
    const { container } = render(<Section as="header">content</Section>);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("HEADER");
    expect(el?.className).toContain("strand-section");
  });

  it("renders children", () => {
    const { getByText } = render(
      <Section>
        <h2>Title</h2>
        <p>Body text</p>
      </Section>,
    );
    expect(getByText("Title")).toBeTruthy();
    expect(getByText("Body text")).toBeTruthy();
  });

  // ── Variant ──

  // ── Background ──

  // ── Custom className ──

  // ── Props forwarding ──

  it("forwards additional props", () => {
    const { container } = render(
      <Section data-testid="my-section" id="s1">
        content
      </Section>,
    );
    expect(container.firstElementChild).toHaveAttribute("id", "s1");
  });

  // ── Aria ──

  it("supports aria-labelledby", () => {
    const { container } = render(
      <Section aria-labelledby="heading-1">content</Section>,
    );
    expect(container.firstElementChild).toHaveAttribute(
      "aria-labelledby",
      "heading-1",
    );
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./Section.fixtures.js";

snapshotFixtures(Section, fixtures);

snapshotStylesheet(resolve(__dirname, "./Section.css"));

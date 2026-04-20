import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import {
  LabShell,
  LabSidebar,
  LabSidebarHead,
  LabSidebarScroll,
  LabBrand,
  LabBrandMark,
  LabBrandTitle,
  LabBrandSub,
  LabSidebarGroup,
  LabSidebarGroupLabel,
  LabSidebarGroupList,
  LabSidebarGroupLink,
  LabSidebarGroupDot,
  LabMain,
  LabHeader,
  LabHeaderTitle,
  LabHeaderLead,
  LabHeaderMeta,
  LabHeaderMetaItem,
  LabHeaderMetaLabel,
  LabHeaderMetaValue,
  LabTaxonomy,
  LabTaxonomyTitle,
  LabTaxonomyList,
  LabSection,
  LabSectionHead,
  LabSectionHeadNote,
  LabSectionBody,
  LabExample,
  LabExampleMeta,
  LabExampleLabel,
  LabExampleCode,
  LabExampleDemo,
  LabExampleCaption,
} from "./LabShell.js";

describe("LabShell family", () => {
  it("LabShell renders with strand-ref-shell class", () => {
    const { container } = render(<LabShell>x</LabShell>);
    expect(container.firstElementChild?.className).toContain("strand-ref-shell");
  });

  it("LabSidebar renders as aside with sidebar class", () => {
    const { container } = render(<LabSidebar>x</LabSidebar>);
    expect(container.firstElementChild?.tagName).toBe("ASIDE");
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-shell__sidebar",
    );
  });

  it("LabSidebarHead applies sidebar-head class", () => {
    const { container } = render(<LabSidebarHead>x</LabSidebarHead>);
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-shell__sidebar-head",
    );
  });

  it("LabSidebarScroll applies sidebar-scroll class", () => {
    const { container } = render(<LabSidebarScroll>x</LabSidebarScroll>);
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-shell__sidebar-scroll",
    );
  });

  it("LabBrand + LabBrandMark + LabBrandTitle + LabBrandSub compose", () => {
    const { container } = render(
      <LabBrand>
        <LabBrandMark>ST</LabBrandMark>
        <div>
          <LabBrandTitle>Strand</LabBrandTitle>
          <LabBrandSub>Reference</LabBrandSub>
        </div>
      </LabBrand>,
    );
    expect(container.querySelector(".strand-ref-shell__brand")).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-shell__brand-mark"),
    ).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-shell__brand-title"),
    ).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-shell__brand-sub"),
    ).toBeTruthy();
  });

  it("LabSidebarGroup + label + list compose", () => {
    const { container } = render(
      <LabSidebarGroup>
        <LabSidebarGroupLabel>Overview</LabSidebarGroupLabel>
        <LabSidebarGroupList>
          <LabSidebarGroupLink href="#typography">Typography</LabSidebarGroupLink>
        </LabSidebarGroupList>
      </LabSidebarGroup>,
    );
    expect(container.querySelector(".strand-ref-shell__group")).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-shell__group-label"),
    ).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-shell__group-list"),
    ).toBeTruthy();
    const link = container.querySelector(
      "a.strand-ref-shell__group-link",
    ) as HTMLAnchorElement | null;
    expect(link).toBeTruthy();
    expect(link?.getAttribute("href")).toBe("#typography");
    // Link includes the dot indicator as a nested span
    expect(link?.querySelector(".strand-ref-shell__group-dot")).toBeTruthy();
  });

  it("LabSidebarGroupDot renders as span with dot class", () => {
    const { container } = render(<LabSidebarGroupDot />);
    expect(container.firstElementChild?.tagName).toBe("SPAN");
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-shell__group-dot",
    );
  });

  it("LabMain renders as main with main class", () => {
    const { container } = render(<LabMain>x</LabMain>);
    expect(container.firstElementChild?.tagName).toBe("MAIN");
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-shell__main",
    );
  });

  it("LabHeader renders as header element", () => {
    const { container } = render(<LabHeader>x</LabHeader>);
    expect(container.firstElementChild?.tagName).toBe("HEADER");
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-header",
    );
  });

  it("LabHeaderTitle renders as h1", () => {
    const { container } = render(<LabHeaderTitle>Title</LabHeaderTitle>);
    expect(container.firstElementChild?.tagName).toBe("H1");
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-header__title",
    );
  });

  it("LabHeaderLead renders as p", () => {
    const { container } = render(<LabHeaderLead>Lead copy</LabHeaderLead>);
    expect(container.firstElementChild?.tagName).toBe("P");
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-header__lead",
    );
  });

  it("LabHeaderMeta + item + label + value compose", () => {
    const { container } = render(
      <LabHeaderMeta>
        <LabHeaderMetaItem>
          <LabHeaderMetaLabel>Components</LabHeaderMetaLabel>
          <LabHeaderMetaValue>34</LabHeaderMetaValue>
        </LabHeaderMetaItem>
      </LabHeaderMeta>,
    );
    expect(container.querySelector(".strand-ref-header__meta")).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-header__meta-item"),
    ).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-header__meta-label"),
    ).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-header__meta-value"),
    ).toBeTruthy();
  });

  it("LabTaxonomy + title + list compose", () => {
    const { container } = render(
      <LabTaxonomy>
        <LabTaxonomyTitle>Taxonomy</LabTaxonomyTitle>
        <LabTaxonomyList>
          <div>
            <dt>Atom</dt>
            <dd>Primitive element</dd>
          </div>
        </LabTaxonomyList>
      </LabTaxonomy>,
    );
    expect(container.querySelector(".strand-ref-taxonomy")).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-taxonomy__title"),
    ).toBeTruthy();
    const list = container.querySelector(".strand-ref-taxonomy__list");
    expect(list?.tagName).toBe("DL");
  });

  it("LabSection + head + head-note + body compose", () => {
    const { container } = render(
      <LabSection id="typography">
        <LabSectionHead>
          <h2>Typography</h2>
          <LabSectionHeadNote>Section</LabSectionHeadNote>
        </LabSectionHead>
        <LabSectionBody>Body</LabSectionBody>
      </LabSection>,
    );
    const sec = container.firstElementChild as HTMLElement;
    expect(sec.tagName).toBe("SECTION");
    expect(sec.className).toContain("strand-ref-section");
    expect(sec.id).toBe("typography");
    expect(container.querySelector(".strand-ref-section__head")).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-section__head-note"),
    ).toBeTruthy();
    expect(container.querySelector(".strand-ref-section__body")).toBeTruthy();
  });

  it("LabExample + meta + label + code + demo + caption compose", () => {
    const { container } = render(
      <LabExample>
        <LabExampleMeta>
          <LabExampleLabel>Label</LabExampleLabel>
          <LabExampleCode>{"<div class=\"x\"/>"}</LabExampleCode>
        </LabExampleMeta>
        <LabExampleDemo>Demo</LabExampleDemo>
        <LabExampleCaption>Caption</LabExampleCaption>
      </LabExample>,
    );
    expect(container.querySelector(".strand-ref-example")).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-example__meta"),
    ).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-example__label"),
    ).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-example__code"),
    ).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-example__demo"),
    ).toBeTruthy();
    expect(
      container.querySelector(".strand-ref-example__caption"),
    ).toBeTruthy();
  });

  it("LabExampleDemo padNone adds --pad-none modifier", () => {
    const { container } = render(<LabExampleDemo padNone>x</LabExampleDemo>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-ref-example__demo--pad-none");
  });

  it("LabExampleDemo recessed adds --recessed modifier", () => {
    const { container } = render(<LabExampleDemo recessed>x</LabExampleDemo>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-ref-example__demo--recessed");
  });

  it("LabExampleDemo base (no modifiers) still renders with demo class", () => {
    const { container } = render(<LabExampleDemo>x</LabExampleDemo>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-ref-example__demo");
    expect(el?.className).not.toContain("--pad-none");
    expect(el?.className).not.toContain("--recessed");
  });

  it("LabShell supports --strand-ref-sticky-top inline override", () => {
    const { container } = render(
      <LabShell
        style={{ "--strand-ref-sticky-top": "72px" } as Record<string, string>}
      >
        x
      </LabShell>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue("--strand-ref-sticky-top")).toBe("72px");
  });

  it("accepts custom className merged with base class", () => {
    const { container } = render(
      <LabSection className="custom-section">x</LabSection>,
    );
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-ref-section");
    expect(el?.className).toContain("custom-section");
  });
});

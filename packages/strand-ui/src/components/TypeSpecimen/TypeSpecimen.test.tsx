import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { TypeSpecimen, TypeSpecimenMeta } from "./TypeSpecimen.js";

describe("TypeSpecimen", () => {
  it("renders with base class", () => {
    const { container } = render(<TypeSpecimen>x</TypeSpecimen>);
    expect(container.firstElementChild?.className).toContain(
      "strand-type-specimen",
    );
  });

  it("renders children", () => {
    const { getByText } = render(<TypeSpecimen>Hello</TypeSpecimen>);
    expect(getByText("Hello")).toBeTruthy();
  });

  it("Meta renders with scoped class", () => {
    const { container } = render(<TypeSpecimenMeta>x</TypeSpecimenMeta>);
    expect(container.firstElementChild?.className).toContain(
      "strand-type-specimen__meta",
    );
  });

  it("Meta is a span element", () => {
    const { container } = render(<TypeSpecimenMeta>x</TypeSpecimenMeta>);
    expect(container.firstElementChild?.tagName).toBe("SPAN");
  });

  it("Meta preserves nested <b> children", () => {
    const { container } = render(
      <TypeSpecimenMeta>
        Inter <b>48px</b>
      </TypeSpecimenMeta>,
    );
    expect(container.querySelector("b")).toBeTruthy();
    expect(container.querySelector("b")?.textContent).toBe("48px");
  });
});

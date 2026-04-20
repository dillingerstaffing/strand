import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import {
  TokenSpecimen,
  TokenSpecimenGrid,
  TokenSpecimenSpacer,
  TokenSpecimenBox,
} from "./TokenSpecimen.js";

describe("TokenSpecimen", () => {
  it("Grid base class", () => {
    const { container } = render(<TokenSpecimenGrid>x</TokenSpecimenGrid>);
    expect(container.firstElementChild?.className).toContain(
      "strand-token-specimen-grid",
    );
  });

  it("Specimen base class", () => {
    const { container } = render(<TokenSpecimen>x</TokenSpecimen>);
    expect(container.firstElementChild?.className).toContain(
      "strand-token-specimen",
    );
  });

  it("Spacer base class + inline width", () => {
    const { container } = render(<TokenSpecimenSpacer width="48px" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("strand-token-specimen__spacer");
    expect(el.style.width).toBe("48px");
  });

  it("Spacer accepts numeric width (converted to px)", () => {
    const { container } = render(<TokenSpecimenSpacer width={48} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe("48px");
  });

  it("Box base class + inline radius + shadow", () => {
    const { container } = render(
      <TokenSpecimenBox
        radius="8px"
        shadow="0 4px 12px rgba(0,0,0,0.1)"
      />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("strand-token-specimen__box");
    expect(el.style.borderRadius).toBe("8px");
    // JSDOM preserves the raw value without canonicalization
    expect(el.style.boxShadow).toContain("rgba(0,0,0,0.1)");
  });
});

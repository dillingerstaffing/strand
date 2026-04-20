import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Swatch, SwatchGrid } from "./Swatch.js";

describe("Swatch", () => {
  it("SwatchGrid applies base class", () => {
    const { container } = render(<SwatchGrid>x</SwatchGrid>);
    expect(container.firstElementChild?.className).toContain(
      "strand-swatch-grid",
    );
  });

  it("renders with base class", () => {
    const { container } = render(
      <Swatch
        name="blue-primary"
        hex="#3B8EF6"
        background="#3B8EF6"
        color="#fff"
      />,
    );
    expect(container.firstElementChild?.className).toContain("strand-swatch");
  });

  it("renders name and hex children", () => {
    const { getByText } = render(
      <Swatch
        name="blue-primary"
        hex="#3B8EF6"
        background="#3B8EF6"
        color="#fff"
      />,
    );
    expect(getByText("blue-primary")).toBeTruthy();
    expect(getByText("#3B8EF6")).toBeTruthy();
  });

  it("applies inline background and color", () => {
    const { container } = render(
      <Swatch
        name="blue-primary"
        hex="#3B8EF6"
        background="rgb(59, 142, 246)"
        color="rgb(255, 255, 255)"
      />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.background).toBe("rgb(59, 142, 246)");
    expect(el.style.color).toBe("rgb(255, 255, 255)");
  });

  it("merges custom className", () => {
    const { container } = render(
      <Swatch
        name="a"
        hex="#fff"
        background="#fff"
        color="#000"
        className="custom"
      />,
    );
    expect(container.firstElementChild?.className).toContain("custom");
  });
});

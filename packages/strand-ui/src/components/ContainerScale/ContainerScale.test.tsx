import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import {
  ContainerScale,
  ContainerScaleRow,
  ContainerScaleLabel,
  ContainerScaleCaption,
  ContainerScaleTrack,
  ContainerScaleBar,
  ContainerScalePx,
  ContainerScaleAxis,
} from "./ContainerScale.js";

describe("ContainerScale", () => {
  it("root base class", () => {
    const { container } = render(<ContainerScale>x</ContainerScale>);
    expect(container.firstElementChild?.className).toContain(
      "strand-container-scale",
    );
  });

  it("parts expose BEM children", () => {
    expect(
      render(<ContainerScaleRow>x</ContainerScaleRow>).container
        .firstElementChild?.className,
    ).toContain("strand-container-scale__row");
    expect(
      render(<ContainerScaleLabel>x</ContainerScaleLabel>).container
        .firstElementChild?.className,
    ).toContain("strand-container-scale__label");
    expect(
      render(<ContainerScaleCaption>x</ContainerScaleCaption>).container
        .firstElementChild?.className,
    ).toContain("strand-container-scale__caption");
    expect(
      render(<ContainerScaleTrack>x</ContainerScaleTrack>).container
        .firstElementChild?.className,
    ).toContain("strand-container-scale__track");
    expect(
      render(<ContainerScalePx>x</ContainerScalePx>).container
        .firstElementChild?.className,
    ).toContain("strand-container-scale__px");
    expect(
      render(<ContainerScaleAxis>x</ContainerScaleAxis>).container
        .firstElementChild?.className,
    ).toContain("strand-container-scale__axis");
  });

  it("Bar applies inline width", () => {
    const { container } = render(
      <ContainerScaleBar width="60%">x</ContainerScaleBar>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("strand-container-scale__bar");
    expect(el.style.width).toBe("60%");
  });
});

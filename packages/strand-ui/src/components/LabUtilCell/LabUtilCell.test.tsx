import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import {
  LabUtilRow,
  LabUtilCell,
  LabUtilCellCode,
  LabUtilCellCaption,
  LabUtilCellDemo,
  LabUtilCellBlock,
} from "./LabUtilCell.js";

describe("LabUtilCell family", () => {
  it("Row base class", () => {
    const { container } = render(<LabUtilRow>x</LabUtilRow>);
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-util-row",
    );
  });

  it("Cell base class", () => {
    const { container } = render(<LabUtilCell>x</LabUtilCell>);
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-util-cell",
    );
  });

  it("Cell parts render with scoped classes", () => {
    expect(
      render(<LabUtilCellCode>x</LabUtilCellCode>).container.firstElementChild
        ?.className,
    ).toContain("strand-ref-util-cell__code");
    expect(
      render(<LabUtilCellCaption>x</LabUtilCellCaption>).container
        .firstElementChild?.className,
    ).toContain("strand-ref-util-cell__caption");
    expect(
      render(<LabUtilCellDemo>x</LabUtilCellDemo>).container.firstElementChild
        ?.className,
    ).toContain("strand-ref-util-cell__demo");
    expect(
      render(<LabUtilCellBlock>x</LabUtilCellBlock>).container.firstElementChild
        ?.className,
    ).toContain("strand-ref-util-cell__block");
  });
});

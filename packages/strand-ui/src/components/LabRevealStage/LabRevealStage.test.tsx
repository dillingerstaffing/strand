import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { LabRevealStage, LabRevealLine } from "./LabRevealStage.js";

describe("LabRevealStage", () => {
  it("Stage base class", () => {
    const { container } = render(<LabRevealStage>x</LabRevealStage>);
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-reveal-stage",
    );
  });

  it("Line base class", () => {
    const { container } = render(<LabRevealLine>x</LabRevealLine>);
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-reveal-line",
    );
  });

  it("composes stage with lines", () => {
    const { container } = render(
      <LabRevealStage>
        <LabRevealLine>1</LabRevealLine>
        <LabRevealLine>2</LabRevealLine>
        <LabRevealLine>3</LabRevealLine>
        <LabRevealLine>4</LabRevealLine>
      </LabRevealStage>,
    );
    const stage = container.firstElementChild;
    expect(stage?.children.length).toBe(4);
    for (const line of Array.from(stage?.children ?? [])) {
      expect(line.className).toContain("strand-ref-reveal-line");
    }
  });
});

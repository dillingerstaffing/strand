import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { LabTip, LabTipBubble } from "./LabTip.js";

describe("LabTip", () => {
  it("Tip base class", () => {
    const { container } = render(<LabTip>x</LabTip>);
    expect(container.firstElementChild?.className).toContain("strand-ref-tip");
  });

  it("Tip pinned adds --pinned modifier", () => {
    const { container } = render(<LabTip pinned>x</LabTip>);
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-tip--pinned",
    );
  });

  it("Tip default has no --pinned modifier", () => {
    const { container } = render(<LabTip>x</LabTip>);
    expect(container.firstElementChild?.className).not.toContain(
      "strand-ref-tip--pinned",
    );
  });

  it("Bubble defaults to --top placement", () => {
    const { container } = render(<LabTipBubble>x</LabTipBubble>);
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-tip__bubble",
    );
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-tip__bubble--top",
    );
  });

  it("Bubble accepts top/bottom/left/right placements", () => {
    for (const p of ["top", "bottom", "left", "right"] as const) {
      const { container } = render(<LabTipBubble placement={p}>x</LabTipBubble>);
      expect(container.firstElementChild?.className).toContain(
        `strand-ref-tip__bubble--${p}`,
      );
    }
  });

  it("Bubble has role=tooltip for accessibility", () => {
    const { container } = render(<LabTipBubble>x</LabTipBubble>);
    expect(container.firstElementChild?.getAttribute("role")).toBe("tooltip");
  });
});

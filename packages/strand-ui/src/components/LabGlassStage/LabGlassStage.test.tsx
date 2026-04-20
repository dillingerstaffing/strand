import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { LabGlassStage, LabGlassPanel } from "./LabGlassStage.js";

describe("LabGlassStage", () => {
  it("Stage base class", () => {
    const { container } = render(<LabGlassStage>x</LabGlassStage>);
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-glass-stage",
    );
  });

  it("Panel base class", () => {
    const { container } = render(<LabGlassPanel>x</LabGlassPanel>);
    expect(container.firstElementChild?.className).toContain(
      "strand-ref-glass-panel",
    );
  });

  it("composes Stage with Panel child", () => {
    const { container } = render(
      <LabGlassStage>
        <LabGlassPanel>Content</LabGlassPanel>
      </LabGlassStage>,
    );
    const stage = container.firstElementChild;
    const panel = stage?.firstElementChild;
    expect(stage?.className).toContain("strand-ref-glass-stage");
    expect(panel?.className).toContain("strand-ref-glass-panel");
  });
});

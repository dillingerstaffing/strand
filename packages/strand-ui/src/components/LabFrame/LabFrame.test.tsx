import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/preact";
import { vi } from "vitest";
import { html } from "../../test/render.js";
import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./LabFrame.fixtures.js";
import * as family from "./LabFrame.js";

snapshotFixtures(family.LabFrame, fixtures);

describe("every export renders its element and class", () => {
  for (const [exportName, Component] of Object.entries(family)) {
    it(exportName, () => {
      expect(html(<Component className="custom">x</Component>)).toMatchSnapshot();
    });
  }
  it("Dot colour, hidden content, and the close control", () => {
    expect(html(<family.LabFrameDot color="#ff5f57" />)).toMatchSnapshot();
    expect(html(<family.LabFrameContent hidden>x</family.LabFrameContent>)).toMatchSnapshot();
    expect(html(<family.LabFramePanelClose />)).toMatchSnapshot();
    expect(html(<family.LabFramePanelClose aria-label="Close dialog">Done</family.LabFramePanelClose>)).toMatchSnapshot();
  });
  it("the close control fires onClick", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<family.LabFramePanelClose onClick={onClick} />);
    fireEvent.click(getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

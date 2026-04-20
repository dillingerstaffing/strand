import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/preact";
import {
  LabFrame,
  LabFrameChrome,
  LabFrameDot,
  LabFrameTitle,
  LabFrameBody,
  LabFrameContent,
  LabFrameContentHead,
  LabFrameActions,
  LabFrameOverlay,
  LabFramePanel,
  LabFramePanelHeader,
  LabFramePanelTitle,
  LabFramePanelClose,
  LabFramePanelBody,
  LabFramePanelFooter,
} from "./LabFrame.js";

describe("LabFrame family", () => {
  it("LabFrame base class", () => {
    const { container } = render(<LabFrame>x</LabFrame>);
    expect(container.firstElementChild?.className).toContain("strand-ref-frame");
  });

  it("Chrome + Title + Body compose", () => {
    expect(
      render(<LabFrameChrome>x</LabFrameChrome>).container.firstElementChild
        ?.className,
    ).toContain("strand-ref-frame__chrome");
    expect(
      render(<LabFrameTitle>x</LabFrameTitle>).container.firstElementChild
        ?.className,
    ).toContain("strand-ref-frame__title");
    expect(
      render(<LabFrameBody>x</LabFrameBody>).container.firstElementChild
        ?.className,
    ).toContain("strand-ref-frame__body");
  });

  it("Dot applies inline background color", () => {
    const { container } = render(<LabFrameDot color="#ff5f57" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("strand-ref-frame__dot");
    expect(el.style.background).toBe("rgb(255, 95, 87)");
  });

  it("Content adds aria-hidden when hidden prop is true", () => {
    const { container } = render(<LabFrameContent hidden>x</LabFrameContent>);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("Content has no aria-hidden by default", () => {
    const { container } = render(<LabFrameContent>x</LabFrameContent>);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBeNull();
  });

  it("ContentHead + Actions render", () => {
    expect(
      render(<LabFrameContentHead>x</LabFrameContentHead>).container
        .firstElementChild?.className,
    ).toContain("strand-ref-frame__content-head");
    expect(
      render(<LabFrameActions>x</LabFrameActions>).container.firstElementChild
        ?.className,
    ).toContain("strand-ref-frame__actions");
  });

  it("Overlay + Panel render with dialog role", () => {
    expect(
      render(<LabFrameOverlay>x</LabFrameOverlay>).container.firstElementChild
        ?.className,
    ).toContain("strand-ref-frame__overlay");
    const { container } = render(<LabFramePanel>x</LabFramePanel>);
    const panel = container.firstElementChild as HTMLElement;
    expect(panel.className).toContain("strand-ref-frame__panel");
    expect(panel.getAttribute("role")).toBe("dialog");
    expect(panel.getAttribute("aria-modal")).toBe("true");
  });

  it("Panel header + title + close + body + footer compose", () => {
    expect(
      render(<LabFramePanelHeader>x</LabFramePanelHeader>).container
        .firstElementChild?.className,
    ).toContain("strand-ref-frame__panel-header");
    const { container: tContainer } = render(
      <LabFramePanelTitle>Title</LabFramePanelTitle>,
    );
    expect(tContainer.firstElementChild?.tagName).toBe("H2");
    expect(tContainer.firstElementChild?.className).toContain(
      "strand-ref-frame__panel-title",
    );
    expect(
      render(<LabFramePanelBody>x</LabFramePanelBody>).container
        .firstElementChild?.className,
    ).toContain("strand-ref-frame__panel-body");
    expect(
      render(<LabFramePanelFooter>x</LabFramePanelFooter>).container
        .firstElementChild?.className,
    ).toContain("strand-ref-frame__panel-footer");
  });

  it("Panel close renders a button with accessible label and default content", () => {
    const { container } = render(<LabFramePanelClose />);
    const btn = container.firstElementChild as HTMLButtonElement;
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.type).toBe("button");
    expect(btn.className).toContain("strand-ref-frame__panel-close");
    expect(btn.getAttribute("aria-label")).toBe("Close");
    expect(btn.textContent?.trim()).toBe("×");
  });

  it("Panel close accepts custom aria-label and children", () => {
    const { container } = render(
      <LabFramePanelClose aria-label="Close dialog">x</LabFramePanelClose>,
    );
    const btn = container.firstElementChild as HTMLButtonElement;
    expect(btn.getAttribute("aria-label")).toBe("Close dialog");
    expect(btn.textContent).toBe("x");
  });

  it("Panel close fires onClick", () => {
    const onClick = vi.fn();
    const { container } = render(
      <LabFramePanelClose onClick={onClick}>x</LabFramePanelClose>,
    );
    fireEvent.click(container.firstElementChild as HTMLButtonElement);
    expect(onClick).toHaveBeenCalledOnce();
  });
});

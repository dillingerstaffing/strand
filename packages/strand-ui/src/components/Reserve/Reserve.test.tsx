import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { Reserve } from "./Reserve.js";

describe("Reserve", () => {
  // ── The space contract (design-language.md 6.6.1) ──

  it("renders both layers at once, so the region is never empty while waiting", () => {
    const { container } = render(
      <Reserve placeholder={<span>ph</span>}>
        <span>real</span>
      </Reserve>,
    );
    expect(container.querySelector(".strand-reserve__placeholder")).not.toBeNull();
    expect(container.querySelector(".strand-reserve__content")).not.toBeNull();
  });

  it("keeps the content mounted while pending, so the swap cannot reflow", () => {
    // The whole point of the primitive: content is present and sized from
    // the first paint, hidden by opacity rather than absent from the DOM.
    // If a future edit switches to conditional rendering, this fails.
    const { container } = render(
      <Reserve ready={false} placeholder={<span>ph</span>}>
        <span>real</span>
      </Reserve>,
    );
    expect(container.textContent).toContain("real");
  });

  it("sets the reserved height for the base breakpoint", () => {
    const { container } = render(<Reserve height="42px" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue("--strand-reserve-h")).toBe("42px");
  });

  it("sets independent reserved heights per breakpoint", () => {
    const { container } = render(
      <Reserve height="180px" heightMd="120px" heightLg="96px" />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue("--strand-reserve-h")).toBe("180px");
    expect(el.style.getPropertyValue("--strand-reserve-h-md")).toBe("120px");
    expect(el.style.getPropertyValue("--strand-reserve-h-lg")).toBe("96px");
  });

  it("emits no height variables when none are given, so it invents no reservation", () => {
    const { container } = render(<Reserve />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue("--strand-reserve-h")).toBe("");
    expect(el.style.getPropertyValue("--strand-reserve-h-md")).toBe("");
    expect(el.style.getPropertyValue("--strand-reserve-h-lg")).toBe("");
  });

  // ── State (drives the cross-fade in CSS) ──

  it("is pending by default", () => {
    const { container } = render(<Reserve />);
    expect(
      container.firstElementChild?.getAttribute("data-strand-reserve"),
    ).toBe("pending");
  });

  it("flips to ready when the data arrives", () => {
    const { container } = render(<Reserve ready />);
    expect(
      container.firstElementChild?.getAttribute("data-strand-reserve"),
    ).toBe("ready");
  });

  it("flips back on rerender, so a refetch can return to the placeholder", () => {
    const { container, rerender } = render(<Reserve ready />);
    rerender(<Reserve ready={false} />);
    expect(
      container.firstElementChild?.getAttribute("data-strand-reserve"),
    ).toBe("pending");
  });

  it("collapses when the answer arrived and there is nothing to show", () => {
    const { container } = render(<Reserve ready empty />);
    expect(
      container.firstElementChild?.getAttribute("data-strand-reserve"),
    ).toBe("empty");
  });

  it("empty wins over ready, since 'nothing arrived' is the more specific fact", () => {
    const { container } = render(<Reserve ready={false} empty />);
    expect(
      container.firstElementChild?.getAttribute("data-strand-reserve"),
    ).toBe("empty");
  });

  // ── Accessibility ──

  it("hides the placeholder from assistive tech, which would otherwise read filler", () => {
    const { container } = render(<Reserve placeholder={<span>ph</span>} />);
    expect(
      container
        .querySelector(".strand-reserve__placeholder")
        ?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("never marks the content aria-hidden", () => {
    const { container } = render(
      <Reserve ready>
        <span>real</span>
      </Reserve>,
    );
    expect(
      container
        .querySelector(".strand-reserve__content")
        ?.getAttribute("aria-hidden"),
    ).toBeNull();
  });

  // ── Composition ──

  it("merges a custom className without dropping the primitive class", () => {
    const { container } = render(<Reserve className="custom" />);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-reserve");
    expect(el?.className).toContain("custom");
  });

  it("merges caller style without dropping the height variables", () => {
    const { container } = render(
      <Reserve height="42px" style={{ marginTop: "8px" }} />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.getPropertyValue("--strand-reserve-h")).toBe("42px");
    expect(el.style.marginTop).toBe("8px");
  });

  it("passes through arbitrary attributes so it can carry a test id or aria-live", () => {
    const { container } = render(
      <Reserve data-testid="slot" aria-live="polite" />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute("data-testid")).toBe("slot");
    expect(el.getAttribute("aria-live")).toBe("polite");
  });
});

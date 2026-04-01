import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Skeleton } from "./Skeleton.js";

describe("Skeleton", () => {
  // ── Rendering ──

  it("renders a div element", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("is aria-hidden", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  // ── Variants ──

  it("applies text variant class by default", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild?.className).toContain(
      "strand-skeleton--text",
    );
  });

  it("applies rectangle variant class", () => {
    const { container } = render(
      <Skeleton variant="rectangle" width="200px" height="100px" />,
    );
    expect(container.firstElementChild?.className).toContain(
      "strand-skeleton--rectangle",
    );
  });

  it("applies circle variant class", () => {
    const { container } = render(
      <Skeleton variant="circle" width="48px" />,
    );
    expect(container.firstElementChild?.className).toContain(
      "strand-skeleton--circle",
    );
  });

  // ── Dimensions ──

  it("applies width style", () => {
    const { container } = render(<Skeleton width="200px" />);
    expect((container.firstElementChild as HTMLElement)?.style.width).toBe(
      "200px",
    );
  });

  it("applies height style", () => {
    const { container } = render(<Skeleton height="40px" />);
    expect((container.firstElementChild as HTMLElement)?.style.height).toBe(
      "40px",
    );
  });

  it("circle has equal width and height", () => {
    const { container } = render(
      <Skeleton variant="circle" width="48px" />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe("48px");
    expect(el.style.height).toBe("48px");
  });

  it("text variant defaults width to 100%", () => {
    const { container } = render(<Skeleton />);
    expect((container.firstElementChild as HTMLElement)?.style.width).toBe(
      "100%",
    );
  });

  // ── Shimmer ──

  it("has shimmer animation class", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild?.className).toContain(
      "strand-skeleton--shimmer",
    );
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { container } = render(<Skeleton className="custom" />);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-skeleton");
    expect(el?.className).toContain("custom");
  });
});

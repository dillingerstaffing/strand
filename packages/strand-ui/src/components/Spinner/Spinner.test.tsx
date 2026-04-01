import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Spinner } from "./Spinner.js";

describe("Spinner", () => {
  // ── ARIA ──

  it("renders with status role", () => {
    const { getByRole } = render(<Spinner />);
    expect(getByRole("status")).toBeTruthy();
  });

  it("has loading text for screen readers", () => {
    const { getByRole } = render(<Spinner />);
    expect(getByRole("status")).toHaveTextContent("Loading");
  });

  // ── Sizes ──

  it("applies md size class by default", () => {
    const { getByRole } = render(<Spinner />);
    expect(getByRole("status").className).toContain("strand-spinner--md");
  });

  it("applies sm size class", () => {
    const { getByRole } = render(<Spinner size="sm" />);
    expect(getByRole("status").className).toContain("strand-spinner--sm");
  });

  it("applies lg size class", () => {
    const { getByRole } = render(<Spinner size="lg" />);
    expect(getByRole("status").className).toContain("strand-spinner--lg");
  });

  // ── Animation ──

  it("has spinning ring element", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector(".strand-spinner__ring")).toBeTruthy();
  });

  it("ring element is aria-hidden", () => {
    const { container } = render(<Spinner />);
    const ring = container.querySelector(".strand-spinner__ring");
    expect(ring?.getAttribute("aria-hidden")).toBe("true");
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { getByRole } = render(<Spinner className="custom" />);
    const el = getByRole("status");
    expect(el.className).toContain("strand-spinner");
    expect(el.className).toContain("custom");
  });
});

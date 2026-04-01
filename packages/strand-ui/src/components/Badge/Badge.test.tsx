import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Badge } from "./Badge.js";

describe("Badge", () => {
  // ── Rendering ──

  it("renders a span element", () => {
    const { container } = render(<Badge count={5} />);
    expect(container.firstElementChild?.tagName).toBe("SPAN");
  });

  // ── Count variant ──

  it("displays count number", () => {
    const { getByRole } = render(<Badge count={7} />);
    expect(getByRole("status")).toHaveTextContent("7");
  });

  it("truncates count at maxCount", () => {
    const { getByRole } = render(<Badge count={150} maxCount={99} />);
    expect(getByRole("status")).toHaveTextContent("99+");
  });

  it("does not truncate count at maxCount boundary", () => {
    const { getByRole } = render(<Badge count={99} maxCount={99} />);
    expect(getByRole("status")).toHaveTextContent("99");
  });

  it("supports custom maxCount", () => {
    const { getByRole } = render(<Badge count={15} maxCount={9} />);
    expect(getByRole("status")).toHaveTextContent("9+");
  });

  // ── Dot variant ──

  it("renders dot variant as small circle", () => {
    const { container } = render(<Badge variant="dot" />);
    const indicator = container.querySelector(".strand-badge__indicator");
    expect(indicator?.className).toContain("strand-badge--dot");
  });

  // ── Status colors ──

  it("applies default status class by default", () => {
    const { container } = render(<Badge count={1} />);
    const indicator = container.querySelector(".strand-badge__indicator");
    expect(indicator?.className).toContain("strand-badge--default");
  });

  it("applies teal status class", () => {
    const { container } = render(<Badge count={1} status="teal" />);
    const indicator = container.querySelector(".strand-badge__indicator");
    expect(indicator?.className).toContain("strand-badge--teal");
  });

  it("applies red status class", () => {
    const { container } = render(<Badge count={1} status="red" />);
    const indicator = container.querySelector(".strand-badge__indicator");
    expect(indicator?.className).toContain("strand-badge--red");
  });

  it("applies amber status class", () => {
    const { container } = render(<Badge count={1} status="amber" />);
    const indicator = container.querySelector(".strand-badge__indicator");
    expect(indicator?.className).toContain("strand-badge--amber");
  });

  it("applies blue status class", () => {
    const { container } = render(<Badge count={1} status="blue" />);
    const indicator = container.querySelector(".strand-badge__indicator");
    expect(indicator?.className).toContain("strand-badge--blue");
  });

  // ── Children wrapping ──

  it("wraps children and positions badge", () => {
    const { getByText, container } = render(
      <Badge count={3}>
        <span>Inbox</span>
      </Badge>,
    );
    expect(getByText("Inbox")).toBeTruthy();
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("strand-badge");
    expect(wrapper?.className).not.toContain("strand-badge--inline");
  });

  it("renders inline without children", () => {
    const { container } = render(<Badge count={5} />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("strand-badge--inline");
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { container } = render(<Badge count={1} className="custom" />);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-badge");
    expect(el?.className).toContain("custom");
  });

  // ── Accessibility ──

  it("has aria-label for count variant", () => {
    const { getByRole } = render(<Badge count={5} />);
    expect(getByRole("status")).toHaveAttribute(
      "aria-label",
      "5 notifications",
    );
  });

  it("has aria-label for dot variant", () => {
    const { getByRole } = render(<Badge variant="dot" />);
    expect(getByRole("status")).toHaveAttribute(
      "aria-label",
      "Status indicator",
    );
  });
});

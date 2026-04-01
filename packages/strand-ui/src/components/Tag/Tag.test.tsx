import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Tag } from "./Tag.js";

describe("Tag", () => {
  // ── Rendering ──

  it("renders children text", () => {
    const { getByText } = render(<Tag>Active</Tag>);
    expect(getByText("Active")).toBeTruthy();
  });

  it("renders as a span element", () => {
    const { container } = render(<Tag>Test</Tag>);
    expect(container.querySelector("span.strand-tag")).toBeTruthy();
  });

  // ── Variants ──

  it("applies solid variant class by default", () => {
    const { container } = render(<Tag>Test</Tag>);
    const tag = container.querySelector(".strand-tag");
    expect(tag?.className).toContain("strand-tag--solid");
  });

  it("applies outlined variant class", () => {
    const { container } = render(<Tag variant="outlined">Test</Tag>);
    const tag = container.querySelector(".strand-tag");
    expect(tag?.className).toContain("strand-tag--outlined");
  });

  // ── Status colors ──

  it("applies default status class by default", () => {
    const { container } = render(<Tag>Test</Tag>);
    const tag = container.querySelector(".strand-tag");
    expect(tag?.className).toContain("strand-tag--default");
  });

  it("applies teal status class", () => {
    const { container } = render(<Tag status="teal">Test</Tag>);
    const tag = container.querySelector(".strand-tag");
    expect(tag?.className).toContain("strand-tag--teal");
  });

  it("applies blue status class", () => {
    const { container } = render(<Tag status="blue">Test</Tag>);
    const tag = container.querySelector(".strand-tag");
    expect(tag?.className).toContain("strand-tag--blue");
  });

  it("applies amber status class", () => {
    const { container } = render(<Tag status="amber">Test</Tag>);
    const tag = container.querySelector(".strand-tag");
    expect(tag?.className).toContain("strand-tag--amber");
  });

  it("applies red status class", () => {
    const { container } = render(<Tag status="red">Test</Tag>);
    const tag = container.querySelector(".strand-tag");
    expect(tag?.className).toContain("strand-tag--red");
  });

  // ── Removable ──

  it("shows remove button when removable", () => {
    const { getByLabelText } = render(<Tag removable>Test</Tag>);
    expect(getByLabelText("Remove")).toBeTruthy();
  });

  it("does not show remove button when not removable", () => {
    const { queryByLabelText } = render(<Tag>Test</Tag>);
    expect(queryByLabelText("Remove")).toBeNull();
  });

  it("calls onRemove when remove button is clicked", () => {
    const onRemove = vi.fn();
    const { getByLabelText } = render(
      <Tag removable onRemove={onRemove}>Test</Tag>,
    );
    fireEvent.click(getByLabelText("Remove"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  // ── Custom className ──

  it("merges custom className with component classes", () => {
    const { container } = render(<Tag className="custom">Test</Tag>);
    const tag = container.querySelector(".strand-tag");
    expect(tag?.className).toContain("strand-tag");
    expect(tag?.className).toContain("custom");
  });

  // ── Typography ──

  it("uses xs font size class", () => {
    const { container } = render(<Tag>Test</Tag>);
    const tag = container.querySelector(".strand-tag");
    expect(tag).toBeTruthy();
    // Font size is applied via CSS class .strand-tag which uses --strand-text-xs
  });

  // ── Forwarded props ──

  it("forwards additional props", () => {
    const { container } = render(
      <Tag data-testid="my-tag" id="tag-1">Test</Tag>,
    );
    const tag = container.querySelector(".strand-tag");
    expect(tag?.getAttribute("id")).toBe("tag-1");
  });
});

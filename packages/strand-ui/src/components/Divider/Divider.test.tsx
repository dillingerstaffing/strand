import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Divider } from "./Divider.js";

describe("Divider", () => {
  // ── Rendering ──

  it("renders with separator role", () => {
    const { getByRole } = render(<Divider />);
    expect(getByRole("separator")).toBeTruthy();
  });

  // ── Direction ──

  it("renders horizontal direction by default", () => {
    const { getByRole } = render(<Divider />);
    expect(getByRole("separator").className).toContain(
      "strand-divider--horizontal",
    );
  });

  it("renders vertical direction", () => {
    const { getByRole } = render(<Divider direction="vertical" />);
    expect(getByRole("separator").className).toContain(
      "strand-divider--vertical",
    );
  });

  // ── Aria orientation ──

  it("sets aria-orientation to horizontal by default", () => {
    const { getByRole } = render(<Divider />);
    expect(getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });

  it("sets aria-orientation to vertical", () => {
    const { getByRole } = render(<Divider direction="vertical" />);
    expect(getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });

  // ── Label ──

  it("renders label text", () => {
    const { getByText } = render(<Divider label="OR" />);
    expect(getByText("OR")).toBeTruthy();
  });

  it("label has monospace styling class", () => {
    const { getByText } = render(<Divider label="SECTION" />);
    expect(getByText("SECTION").className).toContain(
      "strand-divider__label",
    );
  });

  it("labeled divider still has separator role", () => {
    const { getByRole } = render(<Divider label="OR" />);
    expect(getByRole("separator")).toBeTruthy();
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { getByRole } = render(<Divider className="custom" />);
    const el = getByRole("separator");
    expect(el.className).toContain("strand-divider");
    expect(el.className).toContain("custom");
  });

  // ── Element types ──

  it("renders hr element for horizontal without label", () => {
    const { getByRole } = render(<Divider />);
    expect(getByRole("separator").tagName).toBe("HR");
  });

  it("renders div element for vertical", () => {
    const { getByRole } = render(<Divider direction="vertical" />);
    expect(getByRole("separator").tagName).toBe("DIV");
  });
});

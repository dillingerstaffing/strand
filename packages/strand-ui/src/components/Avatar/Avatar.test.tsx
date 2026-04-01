import { describe, expect, it } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Avatar } from "./Avatar.js";

describe("Avatar", () => {
  // ── Image mode ──

  it("renders image when src is provided", () => {
    const { container } = render(
      <Avatar src="https://example.com/photo.jpg" alt="Jane Doe" />,
    );
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.getAttribute("src")).toBe("https://example.com/photo.jpg");
  });

  it("sets alt text on image", () => {
    const { container } = render(
      <Avatar src="https://example.com/photo.jpg" alt="Jane Doe" />,
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("alt")).toBe("Jane Doe");
  });

  // ── Initials mode ──

  it("shows initials when no src is provided", () => {
    const { container } = render(<Avatar initials="jd" />);
    const initialsEl = container.querySelector(".strand-avatar__initials");
    expect(initialsEl).toBeTruthy();
    expect(initialsEl?.textContent).toBe("JD");
  });

  it("initials are uppercase", () => {
    const { container } = render(<Avatar initials="ab" />);
    const initialsEl = container.querySelector(".strand-avatar__initials");
    expect(initialsEl?.textContent).toBe("AB");
  });

  it("truncates initials to 2 characters", () => {
    const { container } = render(<Avatar initials="abc" />);
    const initialsEl = container.querySelector(".strand-avatar__initials");
    expect(initialsEl?.textContent).toBe("AB");
  });

  // ── Fallback ──

  it("falls back to initials on image error", () => {
    const { container } = render(
      <Avatar src="https://example.com/broken.jpg" initials="jd" alt="Jane" />,
    );
    const img = container.querySelector("img");
    expect(img).toBeTruthy();

    fireEvent.error(img!);

    const initialsEl = container.querySelector(".strand-avatar__initials");
    expect(initialsEl).toBeTruthy();
    expect(initialsEl?.textContent).toBe("JD");
    expect(container.querySelector("img")).toBeNull();
  });

  // ── Sizes ──

  it("applies md size class by default", () => {
    const { container } = render(<Avatar initials="A" />);
    expect(container.firstElementChild?.className).toContain(
      "strand-avatar--md",
    );
  });

  it("applies sm size class", () => {
    const { container } = render(<Avatar initials="A" size="sm" />);
    expect(container.firstElementChild?.className).toContain(
      "strand-avatar--sm",
    );
  });

  it("applies lg size class", () => {
    const { container } = render(<Avatar initials="A" size="lg" />);
    expect(container.firstElementChild?.className).toContain(
      "strand-avatar--lg",
    );
  });

  it("applies xl size class", () => {
    const { container } = render(<Avatar initials="A" size="xl" />);
    expect(container.firstElementChild?.className).toContain(
      "strand-avatar--xl",
    );
  });

  // ── Shape ──

  it("has circular shape class", () => {
    const { container } = render(<Avatar initials="A" />);
    expect(container.firstElementChild?.className).toContain("strand-avatar");
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { container } = render(<Avatar initials="A" className="custom" />);
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-avatar");
    expect(el?.className).toContain("custom");
  });

  // ── Accessibility ──

  it("has role img and aria-label", () => {
    const { container } = render(<Avatar initials="JD" alt="Jane Doe" />);
    const el = container.firstElementChild;
    expect(el?.getAttribute("role")).toBe("img");
    expect(el?.getAttribute("aria-label")).toBe("Jane Doe");
  });

  it("uses initials for aria-label when no alt", () => {
    const { container } = render(<Avatar initials="jd" />);
    const el = container.firstElementChild;
    expect(el?.getAttribute("aria-label")).toBe("JD");
  });
});

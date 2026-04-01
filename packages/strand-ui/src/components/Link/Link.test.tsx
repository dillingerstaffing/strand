import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Link } from "./Link.js";

describe("Link", () => {
  // ── Rendering ──

  it("renders an anchor element", () => {
    const { getByRole } = render(<Link href="/about">About</Link>);
    expect(getByRole("link").tagName).toBe("A");
  });

  it("has the correct href attribute", () => {
    const { getByRole } = render(<Link href="/about">About</Link>);
    expect(getByRole("link")).toHaveAttribute("href", "/about");
  });

  it("applies blue color class", () => {
    const { getByRole } = render(<Link href="/about">About</Link>);
    expect(getByRole("link").className).toContain("strand-link");
  });

  it("renders children text", () => {
    const { getByRole } = render(<Link href="/about">About Us</Link>);
    expect(getByRole("link")).toHaveTextContent("About Us");
  });

  // ── External ──

  it("adds target _blank when external", () => {
    const { getByRole } = render(
      <Link href="https://example.com" external>
        External
      </Link>,
    );
    expect(getByRole("link")).toHaveAttribute("target", "_blank");
  });

  it("adds rel noopener noreferrer when external", () => {
    const { getByRole } = render(
      <Link href="https://example.com" external>
        External
      </Link>,
    );
    expect(getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not add target or rel when not external", () => {
    const { getByRole } = render(<Link href="/about">About</Link>);
    const link = getByRole("link");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  // ── Custom className ──

  it("merges custom className with component class", () => {
    const { getByRole } = render(
      <Link href="/about" className="custom">
        About
      </Link>,
    );
    const link = getByRole("link");
    expect(link.className).toContain("strand-link");
    expect(link.className).toContain("custom");
  });

  // ── No text-decoration ──

  it("does not have text-decoration class (relies on CSS reset)", () => {
    const { getByRole } = render(<Link href="/about">About</Link>);
    expect(getByRole("link").className).not.toContain("text-decoration");
  });

  // ── Accessibility ──

  it("forwards additional props", () => {
    const { getByRole } = render(
      <Link href="/about" aria-label="Go to about page">
        About
      </Link>,
    );
    expect(getByRole("link")).toHaveAttribute(
      "aria-label",
      "Go to about page",
    );
  });
});

import { resolve } from "node:path";
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

  // ── Shape ──

  // ── Custom className ──

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

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./Avatar.fixtures.js";

snapshotFixtures(Avatar, fixtures);

snapshotStylesheet(resolve(__dirname, "./Avatar.css"));

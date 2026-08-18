import { readFileSync } from "node:fs";
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

// A per-member tint is PAINT. It changes no box, so jsdom and a real-Chromium
// layout tier are both blind to it, which is why this is a source guard rather
// than a render assertion. Same reasoning Grid.css records for its no-clip rule.
describe("Avatar CSS source", () => {
  const css = readFileSync(resolve(__dirname, "Avatar.css"), "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  const ruleFor = (sel: string) =>
    css.match(new RegExp(`\\${sel}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

  it("reads declarations rather than commentary", () => {
    // The guard on the guard: the knobs below are described in a comment that
    // names both custom properties, so a stripper that stops working would let
    // every assertion here pass against prose.
    expect(css).not.toContain("/*");
    expect(ruleFor(".strand-avatar")).toContain("display: inline-flex");
  });

  it("lets a consumer tint an avatar without overriding the class", () => {
    // The capability: a product deriving a colour per member sets these two
    // and inherits the rest of the primitive.
    expect(ruleFor(".strand-avatar")).toContain("--strand-avatar-bg");
    expect(ruleFor(".strand-avatar")).toContain("--strand-avatar-fg");
  });

  it("renders exactly as before when the consumer sets nothing", () => {
    // The fallbacks are the previous flat values, so this is a pure addition.
    // Without them the whole declaration would resolve to nothing for every
    // existing caller, which is the failure an undefined token causes.
    expect(ruleFor(".strand-avatar")).toContain(
      "var(--strand-avatar-bg, var(--strand-surface-recessed))",
    );
    expect(ruleFor(".strand-avatar")).toContain(
      "var(--strand-avatar-fg, var(--strand-gray-600))",
    );
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./Avatar.fixtures.js";

snapshotFixtures(Avatar, fixtures);

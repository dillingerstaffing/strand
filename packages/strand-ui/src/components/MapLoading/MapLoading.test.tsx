import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { MapLoading } from "./MapLoading.js";

describe("MapLoading", () => {
  // It covers a booting instrument, so present is the safe state: a
  // consumer that forgets to drive it shows a loading screen rather than
  // revealing a half-painted map.
  it("shows by default", () => {
    const { container } = render(<MapLoading />);
    const el = container.querySelector(".strand-map-loading");
    expect(el?.classList.contains("strand-map-loading--hidden")).toBe(false);
    expect(el?.getAttribute("aria-busy")).toBe("true");
  });

  it("hides by class rather than by unmounting", () => {
    // Unmounting would cut the opacity transition and reveal the map
    // mid-paint; the class is what lets it fade.
    const { container } = render(<MapLoading visible={false} />);
    const el = container.querySelector(".strand-map-loading");
    expect(el).not.toBeNull();
    expect(el?.classList.contains("strand-map-loading--hidden")).toBe(true);
    expect(el?.getAttribute("aria-busy")).toBe("false");
  });

  it("announces its caption politely rather than changing state silently", () => {
    const { container } = render(<MapLoading />);
    const el = container.querySelector(".strand-map-loading");
    expect(el?.getAttribute("role")).toBe("status");
    expect(el?.getAttribute("aria-live")).toBe("polite");
  });

  it("uses instrument voice by default", () => {
    // 11.7: "Processing", not "Loading...".
    const { container } = render(<MapLoading />);
    expect(container.querySelector(".strand-map-loading__text")?.textContent).toBe("Processing");
  });

  it("takes a caption", () => {
    const { container } = render(<MapLoading text="Scanning" />);
    expect(container.querySelector(".strand-map-loading__text")?.textContent).toBe("Scanning");
  });

  it("hides its decorative parts from the accessibility tree", () => {
    const { container } = render(<MapLoading />);
    expect(container.querySelector(".strand-map-loading__spinner")?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector(".strand-map-loading__bar")?.getAttribute("aria-hidden")).toBe("true");
  });
});

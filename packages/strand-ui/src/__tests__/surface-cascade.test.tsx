import { describe, expect, it } from "vitest";

describe("instrument dark-context text cascade (dogfood gap #46)", () => {
  async function bundle() {
    const fs = await import("node:fs");
    const path = await import("node:path");
    return fs.readFileSync(path.resolve(__dirname, "../../dist/css/strand-ui.css"), "utf-8");
  }

  // DL 9.3: the dark viewport is a self-contained dark island. Generic text
  // primitives placed on it switch to on-dark colors so a consumer never
  // hand-tints text inside a viewport. Each rule is dual-scoped to the
  // full-page body mode and the recessed panel.
  it("headline switches to the on-dark heading color inside the viewport", async () => {
    const content = await bundle();
    expect(content).toMatch(
      /\.strand-instrument-viewport \.strand-headline\s*{\s*color:\s*var\(--strand-on-blue-primary\)/,
    );
  });

  it("secondary text drops to gray-200, and the --xs caption tier to gray-300", async () => {
    const content = await bundle();
    expect(content).toMatch(
      /\.strand-instrument-viewport \.strand-text-secondary\s*{\s*color:\s*var\(--strand-gray-200\)/,
    );
    expect(content).toMatch(
      /\.strand-instrument-viewport \.strand-text-secondary--xs\s*{\s*color:\s*var\(--strand-gray-300\)/,
    );
  });

  it("overline base drops to gray-400 and the accent variant to blue-indicator on dark", async () => {
    const content = await bundle();
    expect(content).toMatch(
      /\.strand-instrument-viewport \.strand-overline\s*{\s*color:\s*var\(--strand-gray-400\)/,
    );
    expect(content).toMatch(
      /\.strand-instrument-viewport \.strand-overline--accent\s*{\s*color:\s*var\(--strand-blue-indicator\)/,
    );
  });

  it("data-readout label drops to gray-400 and its value goes on-blue-primary on dark", async () => {
    const content = await bundle();
    expect(content).toMatch(
      /\.strand-instrument-viewport \.strand-data-readout__label\s*{\s*color:\s*var\(--strand-gray-400\)/,
    );
    expect(content).toMatch(
      /\.strand-instrument-viewport \.strand-data-readout__value\s*{\s*color:\s*var\(--strand-on-blue-primary\)/,
    );
  });

  it("a link inside the viewport inherits color and drops the gradient underline", async () => {
    const content = await bundle();
    expect(content).toMatch(
      /\.strand-instrument-viewport \.strand-link\s*{\s*color:\s*inherit;\s*background-image:\s*none/,
    );
  });

  // DL 9.6: the detail panel is a LIGHT island inside the dark cabinet, so
  // the cascade must not tint its text. The restore re-asserts the
  // light-surface base color for a text primitive composed inside it.
  it("the light detail panel restores light-surface text colors (no cascade leak)", async () => {
    const content = await bundle();
    expect(content).toMatch(
      /\.strand-detail-panel \.strand-overline,[\s\S]{0,80}?{\s*color:\s*var\(--strand-gray-500\)/,
    );
    expect(content).toMatch(
      /\.strand-detail-panel \.strand-overline--accent,[\s\S]{0,80}?{\s*color:\s*var\(--strand-blue-deep\)/,
    );
  });

  // The same restore is available as a positioning-free UTILITY, because
  // consumers nesting a plain light panel (a white card, an alert) inside a
  // viewport were reaching for .strand-detail-panel to get these colors and
  // inheriting a positioned slide-in drawer with them, which pulls the panel
  // out of flow and off-screen.
  it("exposes the light island as a colors-only utility, not just the drawer", async () => {
    const content = await bundle();
    for (const primitive of [
      "strand-headline",
      "strand-text-secondary",
      "strand-overline",
      "strand-data-readout__value",
      "strand-kv__value",
      "strand-btn--ghost",
    ]) {
      expect(content).toContain(`.strand-surface-light .${primitive}`);
    }
  });

  it("the utility sets no geometry, so it composes onto a surface that has its own", async () => {
    const content = await bundle();
    // A bare `.strand-surface-light { ... }` rule would mean the utility
    // carries its own box; it must only ever appear as an ancestor selector.
    expect(content).not.toMatch(/(^|[^-\w])\.strand-surface-light\s*{/m);
  });

  it("restores the ghost button, which the cascade renders near-white", async () => {
    const content = await bundle();
    // The worst instance of the leak: a ghost-weight action on a light panel
    // inside a viewport rendered white-on-light and was invisible.
    expect(content).toMatch(
      /\.strand-surface-light \.strand-btn--ghost\s*{\s*color:\s*var\(--strand-blue-midnight\)/,
    );
  });
});

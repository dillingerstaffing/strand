import { describe, it, expect } from "vitest";
import { render } from "@testing-library/preact";
import { Button } from "../components/Button/index.js";

describe("strand-static presentation mode", () => {
  it("CSS file exists and is included in build output", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const staticPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(staticPath, "utf-8");
    expect(content).toContain(".strand-static");
    expect(content).toContain("pointer-events: none");
  });

  it("disabled button inside .strand-static has opacity override class", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const staticPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(staticPath, "utf-8");
    expect(content).toContain(".strand-static [disabled]");
    expect(content).toContain("opacity: 1");
  });

  it("strand-static overrides toast position", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const staticPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(staticPath, "utf-8");
    expect(content).toContain(".strand-static .strand-toast");
    expect(content).toContain("position: static");
  });
});

describe("layout utility classes", () => {
  it("Stack gap utilities exist in build output", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cssPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain(".strand-stack--gap-4");
    expect(content).toContain("var(--strand-space-4)");
  });

  it("Grid column utilities exist in build output", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cssPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain(".strand-grid--cols-3");
    expect(content).toContain("repeat(3, 1fr)");
  });

  it("Grid gap utilities exist in build output", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cssPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain(".strand-grid--gap-4");
  });
});

describe("typography size utilities", () => {
  // Pure, color-agnostic size levers that map 1:1 onto the type scale
  // tokens. Unlike .strand-text-secondary (which also recolors to gray-500),
  // these shrink a value in place without changing its color, so a long URL,
  // code, or id fits inside a component while staying primary-colored.
  it("strand-text-sm sets font-size to the sm scale token", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cssPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain(".strand-text-sm");
    expect(content).toMatch(/\.strand-text-sm\s*{\s*font-size:\s*var\(--strand-text-sm\)/);
  });

  it("strand-text-xs sets font-size to the xs scale token", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cssPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain(".strand-text-xs");
    expect(content).toMatch(/\.strand-text-xs\s*{\s*font-size:\s*var\(--strand-text-xs\)/);
  });

  it("size utilities carry no color so they do not recolor the host element", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cssPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    // Isolate each rule body and assert it sets only font-size (no color).
    const smRule = content.match(/\.strand-text-sm\s*{[^}]*}/)?.[0] ?? "";
    const xsRule = content.match(/\.strand-text-xs\s*{[^}]*}/)?.[0] ?? "";
    expect(smRule).not.toContain("color");
    expect(xsRule).not.toContain("color");
  });
});

describe("width utility", () => {
  // Exactly one width: 100% utility exists. A stack (or any flex container)
  // used as a flex or grid CHILD shrink-wraps to its content, so a header
  // row composed with strand-stack--justify-between needs strand-full-width
  // to give justify-between room to distribute.
  it("strand-full-width sets width to 100%", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cssPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toMatch(/\.strand-full-width\s*{\s*width:\s*100%/);
  });

  it("the removed strand-w-full duplicate stays out of the build output", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cssPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).not.toContain(".strand-w-full");
  });
});

describe("text-flow utilities", () => {
  // Wrap a long unbreakable string (a URL, hash, or token) so it breaks
  // inside a constrained box instead of overflowing.
  it("strand-break-anywhere sets overflow-wrap to anywhere", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cssPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain(".strand-break-anywhere");
    expect(content).toMatch(/\.strand-break-anywhere\s*{\s*overflow-wrap:\s*anywhere/);
  });

  // Pin a data atom (a date, an amount, an id) to one line so a squeezed
  // table column wraps its prose neighbors instead of breaking a figure.
  it("strand-nowrap keeps a data atom on one line", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cssPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain(".strand-nowrap");
    expect(content).toMatch(/\.strand-nowrap\s*{\s*white-space:\s*nowrap/);
  });
});

describe("value tone utilities", () => {
  // The utility's contract is "compose onto any text node and the tone
  // color wins". Component rules like .strand-kv--editorial .strand-kv__value
  // set color at higher specificity and later source order, so the tone
  // colors must carry !important or the composition silently loses the
  // cascade (Gap #44: MONEY plan rows rendered midnight blue, not red).
  it("strand-value--positive wins any component color rule", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cssPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toMatch(
      /\.strand-value--positive\s*{\s*color:\s*var\(--strand-green-positive-deep\)\s*!important/,
    );
  });

  it("strand-value--negative wins any component color rule", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cssPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toMatch(
      /\.strand-value--negative\s*{\s*color:\s*var\(--strand-red-alert-deep\)\s*!important/,
    );
  });

  it("strand-value aligns figures with tabular numerals", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cssPath = path.resolve(__dirname, "../../dist/css/strand-ui.css");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toMatch(/\.strand-value\s*{\s*font-variant-numeric:\s*tabular-nums/);
  });
});

describe("WS purity utility pack (dogfood gap #45)", () => {
  async function bundle() {
    const fs = await import("node:fs");
    const path = await import("node:path");
    return fs.readFileSync(path.resolve(__dirname, "../../dist/css/strand-ui.css"), "utf-8");
  }

  it("padding utilities mirror the margin scale", async () => {
    const content = await bundle();
    expect(content).toContain(".strand-pt-4");
    expect(content).toContain(".strand-pb-4");
    expect(content).toContain(".strand-py-4");
    expect(content).toContain("padding-block: var(--strand-space-4)");
  });

  it("inline-flex, italic, list-reset, disabled-state utilities exist", async () => {
    const content = await bundle();
    expect(content).toContain(".strand-inline-flex");
    expect(content).toContain(".strand-italic");
    expect(content).toContain(".strand-list-reset");
    expect(content).toContain(".strand-is-disabled");
    expect(content).toContain("pointer-events: none");
  });

  it("link--inherit modifier drops the accent color", async () => {
    const content = await bundle();
    expect(content).toContain(".strand-link--inherit");
    expect(content).toMatch(/\.strand-link--inherit\s*{[^}]*color:\s*inherit/);
  });

  it("responsive 16:9 embed box exists with aspect-ratio", async () => {
    const content = await bundle();
    expect(content).toContain(".strand-embed-16x9");
    expect(content).toContain("aspect-ratio: 16 / 9");
  });

  it("centered-page layout exists for token/confirmation pages", async () => {
    const content = await bundle();
    expect(content).toContain(".strand-page--centered");
  });
});

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
      /\.strand-detail-panel \.strand-overline\s*{\s*color:\s*var\(--strand-gray-500\)/,
    );
    expect(content).toMatch(
      /\.strand-detail-panel \.strand-overline--accent\s*{\s*color:\s*var\(--strand-blue-deep\)/,
    );
  });
});

describe("margin-zero + stacked-alert utilities (dogfood gap #46)", () => {
  async function bundle() {
    const fs = await import("node:fs");
    const path = await import("node:path");
    return fs.readFileSync(path.resolve(__dirname, "../../dist/css/strand-ui.css"), "utf-8");
  }

  it("strand-m-0 zeroes the margin", async () => {
    const content = await bundle();
    expect(content).toMatch(/\.strand-m-0\s*{\s*margin:\s*0/);
  });

  it("strand-alert--stack lays the alert out in a column", async () => {
    const content = await bundle();
    expect(content).toContain(".strand-alert--stack");
    expect(content).toMatch(/\.strand-alert--stack\s*{[^}]*flex-direction:\s*column/);
    expect(content).toMatch(/\.strand-alert--stack\s*{[^}]*align-items:\s*stretch/);
  });
});

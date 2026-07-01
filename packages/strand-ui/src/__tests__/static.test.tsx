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

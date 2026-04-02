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

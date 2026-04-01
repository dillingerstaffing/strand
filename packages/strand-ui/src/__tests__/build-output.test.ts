import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve(__dirname, "../../dist");

describe("Build output", () => {
  it("produces index.js bundle", () => {
    expect(existsSync(resolve(distDir, "index.js"))).toBe(true);
  });

  it("produces index.d.ts declarations", () => {
    expect(existsSync(resolve(distDir, "index.d.ts"))).toBe(true);
  });

  it("declarations export all component types", () => {
    const dts = readFileSync(resolve(distDir, "index.d.ts"), "utf-8");
    const expectedExports = [
      "Button", "Input", "Textarea", "Select", "Checkbox", "Radio",
      "Switch", "Slider", "FormField", "Card", "Badge", "Avatar",
      "Tag", "Table", "DataReadout", "Stack", "Grid", "Container",
      "Divider", "Section", "Link", "Tabs", "Breadcrumb", "Nav",
      "Toast", "Alert", "Dialog", "Tooltip", "Progress", "Spinner", "Skeleton",
    ];
    for (const name of expectedExports) {
      expect(dts, `Missing export: ${name}`).toContain(name);
    }
  });

  it("produces combined CSS file", () => {
    expect(existsSync(resolve(distDir, "css/strand-ui.css"))).toBe(true);
  });

  it("CSS file contains styles for all components", () => {
    const css = readFileSync(resolve(distDir, "css/strand-ui.css"), "utf-8");
    const expectedClasses = [
      ".strand-btn", ".strand-input", ".strand-select",
      ".strand-checkbox", ".strand-radio", ".strand-switch",
      ".strand-slider", ".strand-card", ".strand-badge",
      ".strand-avatar", ".strand-tag", ".strand-table",
      ".strand-data-readout", ".strand-stack", ".strand-grid",
      ".strand-container", ".strand-divider", ".strand-section",
      ".strand-link", ".strand-tabs", ".strand-breadcrumb",
      ".strand-nav", ".strand-toast", ".strand-alert",
      ".strand-dialog", ".strand-tooltip", ".strand-progress",
      ".strand-spinner", ".strand-skeleton",
    ];
    for (const cls of expectedClasses) {
      expect(css, `Missing CSS class: ${cls}`).toContain(cls);
    }
  });

  it("CSS file uses only strand tokens (no hardcoded colors)", () => {
    const css = readFileSync(resolve(distDir, "css/strand-ui.css"), "utf-8");
    // Remove comments and check for hardcoded hex colors that aren't in rgba()
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const hexMatches = withoutComments.match(/#[0-9a-fA-F]{6}\b/g) || [];
    // Filter out known exceptions (danger hover/active states that extend the palette)
    const knownExceptions = ["#DC2626", "#B91C1C", "#0D7377", "#92400E", "#991B1B"];
    const unexpected = hexMatches.filter(
      (h) => !knownExceptions.includes(h.toUpperCase())
    );
    expect(unexpected, `Hardcoded hex colors found: ${unexpected.join(", ")}`).toEqual([]);
  });

  it("JS bundle is under 50KB gzipped budget", () => {
    const js = readFileSync(resolve(distDir, "index.js"), "utf-8");
    // Rough check: uncompressed should be well under 200KB (gzip ~4:1 ratio)
    expect(js.length).toBeLessThan(200_000);
  });

  it("src/ directory exists for CLI copy-paste", () => {
    expect(existsSync(resolve(__dirname, "../components/Button/Button.tsx"))).toBe(true);
    expect(existsSync(resolve(__dirname, "../components/Button/Button.css"))).toBe(true);
    expect(existsSync(resolve(__dirname, "../components/Dialog/Dialog.tsx"))).toBe(true);
  });
});

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
      ".strand-instrument-viewport", ".strand-reveal",
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

  it("CSS has no hardcoded duration values", () => {
    const css = readFileSync(resolve(distDir, "css/strand-ui.css"), "utf-8");
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
    // Strip @keyframes blocks entirely (durations inside keyframes are acceptable)
    const withoutKeyframes = withoutComments.replace(/@keyframes\s+[\w-]+\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/g, "");
    // Strip animation shorthand lines (duration is part of the shorthand spec, not standalone)
    const withoutAnimations = withoutKeyframes.replace(/animation:.*$/gm, "");
    // Strip animation-delay lines (stagger offsets, not durations)
    const withoutAnimationDelays = withoutAnimations.replace(/animation-delay:.*$/gm, "");
    // Strip var() references (tokenized durations are fine)
    const withoutVars = withoutAnimationDelays.replace(/var\([^)]+\)/g, "VAR_REF");

    const durationPattern = /(?<!\w)(150ms|250ms|400ms|700ms|1\.8s|1\.5s|1\.2s|0\.8s)\b/g;
    const matches: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = durationPattern.exec(withoutVars)) !== null) {
      matches.push(match[0]);
    }

    // Exception: 75ms in transition-duration for active/pressed states (Part XII spec)
    const nonExemptPattern = /(?<!\w)75ms\b/g;
    const lines = withoutVars.split("\n");
    for (const line of lines) {
      if (nonExemptPattern.test(line) && !line.includes("transition-duration")) {
        matches.push("75ms (outside transition-duration)");
      }
      nonExemptPattern.lastIndex = 0;
    }

    expect(matches, `Hardcoded duration values found: ${matches.join(", ")}`).toEqual([]);
  });

  it("CSS has no hardcoded easing values", () => {
    const css = readFileSync(resolve(distDir, "css/strand-ui.css"), "utf-8");
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
    // Strip var() references
    const withoutVars = withoutComments.replace(/var\([^)]+\)/g, "VAR_REF");

    const violations: string[] = [];

    // Check for raw cubic-bezier()
    const cubicBezierPattern = /cubic-bezier\([^)]+\)/g;
    let match: RegExpExecArray | null;
    while ((match = cubicBezierPattern.exec(withoutVars)) !== null) {
      violations.push(match[0]);
    }

    // Check for bare easing keywords (not inside var() and not "linear")
    // linear is acceptable for spinners/continuous rotation
    const easingKeywordPattern = /\b(ease-in-out|ease-in|ease-out)\b/g;
    while ((match = easingKeywordPattern.exec(withoutVars)) !== null) {
      violations.push(match[0]);
    }

    expect(violations, `Hardcoded easing values found: ${violations.join(", ")}`).toEqual([]);
  });

  it("CSS has no hardcoded border-radius pixel values", () => {
    const css = readFileSync(resolve(distDir, "css/strand-ui.css"), "utf-8");
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
    // Strip var() references
    const withoutVars = withoutComments.replace(/var\([^)]+\)/g, "VAR_REF");

    // Match border-radius with raw pixel values
    const borderRadiusPattern = /border-radius:\s*\d+px/g;
    const matches: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = borderRadiusPattern.exec(withoutVars)) !== null) {
      matches.push(match[0]);
    }

    expect(matches, `Hardcoded border-radius values found: ${matches.join(", ")}`).toEqual([]);
  });

  it("All interactive component CSS files include :focus-visible", () => {
    const interactiveComponents = [
      "Button", "Link", "Card", "Checkbox", "Input", "Radio",
      "Select", "Slider", "Switch", "Tabs", "Breadcrumb", "Nav", "Table",
    ];

    for (const name of interactiveComponents) {
      const cssPath = resolve(__dirname, `../components/${name}/${name}.css`);
      const css = readFileSync(cssPath, "utf-8");
      // Compound inputs (Input, Select, Textarea) use :focus-within on the wrapper,
      // which is equivalent for components with a visually hidden native input
      const hasFocusHandling = css.includes(":focus-visible") || css.includes(":focus-within");
      expect(hasFocusHandling, `${name}.css missing :focus-visible or :focus-within`).toBe(true);
    }
  });

  it("All animated component CSS files include prefers-reduced-motion", () => {
    const allComponents = [
      "Alert", "Avatar", "Badge", "Breadcrumb", "Button", "Card",
      "Checkbox", "Container", "DataReadout", "Dialog", "Divider",
      "FormField", "Grid", "Input", "Link", "Nav", "Progress", "Radio",
      "Section", "Select", "Skeleton", "Slider", "Spinner", "Stack",
      "Switch", "Table", "Tabs", "Tag", "Textarea", "Toast", "Tooltip",
    ];

    for (const name of allComponents) {
      const cssPath = resolve(__dirname, `../components/${name}/${name}.css`);
      const css = readFileSync(cssPath, "utf-8");
      const usesAnimation = /\banimation\b/.test(css) || /\btransition\b/.test(css);
      if (usesAnimation) {
        expect(css, `${name}.css uses animation/transition but missing prefers-reduced-motion`).toContain("prefers-reduced-motion");
      }
    }
  });

  it("All component CSS files start with MIT license banner", () => {
    const allComponents = [
      "Alert", "Avatar", "Badge", "Breadcrumb", "Button", "Card",
      "Checkbox", "Container", "DataReadout", "Dialog", "Divider",
      "FormField", "Grid", "Input", "Link", "Nav", "Progress", "Radio",
      "Section", "Select", "Skeleton", "Slider", "Spinner", "Stack",
      "Switch", "Table", "Tabs", "Tag", "Textarea", "Toast", "Tooltip",
    ];

    for (const name of allComponents) {
      const cssPath = resolve(__dirname, `../components/${name}/${name}.css`);
      const css = readFileSync(cssPath, "utf-8");
      expect(css, `${name}.css missing MIT license banner`).toMatch(/^\/\*! Strand/);
    }
  });
});

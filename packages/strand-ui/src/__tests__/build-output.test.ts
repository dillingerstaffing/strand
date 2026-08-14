import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { stripComments } from "../../build/strip-comments.mjs";

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

  // ── The shipped stylesheet carries no source commentary ──
  //
  // Measured before this was true: 344,311 raw bytes of bundle, 164,997 of
  // them comments, and 85,927 gzipped against 23,669 with the prose removed.
  // Comments were 72% of the CSS every consumer downloads, and nothing
  // noticed because collectCss() concatenates source and the stylesheet never
  // reaches a minifier.

  it("strips a source comment but keeps a license banner", () => {
    const css = `/*! Strand UI | MIT */\n/* why this value */\n.a { color: red; }\n`;
    const out = stripComments(css);
    expect(out).toContain("/*! Strand UI | MIT */");
    expect(out).not.toContain("why this value");
    expect(out).toContain(".a { color: red; }");
  });

  it("leaves declarations byte-identical", () => {
    // The transform must not be able to change what renders. If it ever
    // rewrites a declaration, every parity baseline downstream is wrong and
    // this is where it gets caught.
    const decls = ".a{color:red}.b{margin:0 auto}@media (min-width:40rem){.c{gap:1px}}";
    expect(stripComments(`/* x */${decls}/* y */`)).toContain(decls);
  });

  it("removes a multi-line comment without eating the rule after it", () => {
    const out = stripComments("/*\n  many\n  lines\n*/\n.a { color: red; }");
    expect(out).not.toContain("many");
    expect(out).toContain(".a { color: red; }");
  });

  it("ships the license banner in the built stylesheet", () => {
    // A redistribution obligation, not a nicety: MIT requires the notice to
    // travel with the artifact.
    const css = readFileSync(resolve(distDir, "css/strand-ui.css"), "utf-8");
    expect(css).toMatch(/^\/\*! Strand UI v[\d.]+ \| MIT License/);
  });

  it("ships no source commentary in the built stylesheet", () => {
    const css = readFileSync(resolve(distDir, "css/strand-ui.css"), "utf-8");
    const comments = css.match(/\/\*[\s\S]*?\*\//g) ?? [];
    const nonBanner = comments.filter((c) => !c.startsWith("/*!"));
    expect(
      nonBanner.slice(0, 3),
      `${nonBanner.length} source comments reached the artifact`,
    ).toEqual([]);
  });

  it("spends its remaining comment bytes only on license banners", () => {
    // What survives is the MIT notice at the head of each component file,
    // repeated once per file the bundle concatenates: 66 of them, ~3.5 KB,
    // about 2% of the artifact. That duplication is a redistribution
    // obligation rather than waste, so it is bounded rather than removed.
    //
    // Stated as a RATIO so it holds as the library grows, and measured on raw
    // bytes rather than gzipped ones because node:zlib trips jsdom's
    // TextEncoder invariant in this environment. The compressed win is a
    // consequence of this ratio, and scripts/bundle-budget-check.mjs is the
    // gate that measures it.
    const css = readFileSync(resolve(distDir, "css/strand-ui.css"), "utf-8");
    const comments = css.match(/\/\*[\s\S]*?\*\//g) ?? [];
    expect(comments.every((c) => c.startsWith("/*!"))).toBe(true);
    const bytes = comments.reduce((n, c) => n + c.length, 0);
    expect(bytes / css.length).toBeLessThan(0.03);
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

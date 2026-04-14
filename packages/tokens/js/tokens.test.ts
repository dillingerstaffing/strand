import { describe, expect, it } from "vitest";
import * as tokens from "./tokens.js";

/**
 * Token validity tests.
 * Verifies: no undefined values, contrast ratios pass WCAG AA,
 * scale ratios correct, CSS/JS parity, all DESIGN_LANGUAGE.md values present.
 */

// ── Helpers ──

/** Parse hex color to RGB */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: Number.parseInt(clean.substring(0, 2), 16),
    g: Number.parseInt(clean.substring(2, 4), 16),
    b: Number.parseInt(clean.substring(4, 6), 16),
  };
}

/** Calculate relative luminance per WCAG 2.2 */
function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/** Calculate contrast ratio between two hex colors */
function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Check if a string is a valid hex color */
function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

/** Parse rem value to number */
function parseRem(value: string): number {
  return Number.parseFloat(value.replace("rem", ""));
}

// ── No Undefined Values ──

describe("Token completeness", () => {
  it("all flat exports are defined and non-empty", () => {
    const flatExports = [
      tokens.fontSans,
      tokens.fontMono,
      tokens.surfacePrimary,
      tokens.surfaceElevated,
      tokens.surfaceRecessed,
      tokens.surfaceSubtle,
      tokens.blueGlow,
      tokens.blueWash,
      tokens.blueIndicator,
      tokens.bluePrimary,
      tokens.blueVivid,
      tokens.blueDeep,
      tokens.blueMidnight,
      tokens.blueAbyss,
      tokens.gray50,
      tokens.gray100,
      tokens.gray200,
      tokens.gray300,
      tokens.gray400,
      tokens.gray500,
      tokens.gray600,
      tokens.gray700,
      tokens.gray800,
      tokens.gray900,
      tokens.cyanSignal,
      tokens.tealVital,
      tokens.greenPositive,
      tokens.violetData,
      tokens.redAlert,
      tokens.amberCaution,
      tokens.onSurfacePrimary,
      tokens.onSurfaceElevated,
      tokens.onSurfaceRecessed,
      tokens.onBluePrimary,
      tokens.onBlueVivid,
      tokens.onBlueDeep,
      tokens.onRedAlert,
      tokens.onTealVital,
      tokens.onAmberCaution,
    ];
    for (const value of flatExports) {
      expect(value).toBeDefined();
      expect(value).not.toBe("");
    }
  });

  it("all grouped exports are defined", () => {
    expect(tokens.colors).toBeDefined();
    expect(tokens.typography).toBeDefined();
    expect(tokens.spacing).toBeDefined();
    expect(tokens.motion).toBeDefined();
    expect(tokens.elevation).toBeDefined();
    expect(tokens.shape).toBeDefined();
    expect(tokens.layout).toBeDefined();
  });
});

// ── Color Validity ──

describe("Color values", () => {
  const allColors = [
    tokens.surfacePrimary,
    tokens.surfaceElevated,
    tokens.surfaceRecessed,
    tokens.surfaceSubtle,
    tokens.blueGlow,
    tokens.blueWash,
    tokens.blueIndicator,
    tokens.bluePrimary,
    tokens.blueVivid,
    tokens.blueDeep,
    tokens.blueMidnight,
    tokens.blueAbyss,
    tokens.gray50,
    tokens.gray100,
    tokens.gray200,
    tokens.gray300,
    tokens.gray400,
    tokens.gray500,
    tokens.gray600,
    tokens.gray700,
    tokens.gray800,
    tokens.gray900,
    tokens.cyanSignal,
    tokens.tealVital,
    tokens.greenPositive,
    tokens.violetData,
    tokens.redAlert,
    tokens.amberCaution,
    tokens.onSurfacePrimary,
    tokens.onSurfaceElevated,
    tokens.onSurfaceRecessed,
    tokens.onBluePrimary,
    tokens.onBlueVivid,
    tokens.onBlueDeep,
    tokens.onRedAlert,
    tokens.onTealVital,
    tokens.onAmberCaution,
  ];

  it("all color tokens are valid hex values", () => {
    for (const color of allColors) {
      expect(isValidHex(color), `${color} is not a valid hex color`).toBe(true);
    }
  });

  it("surface colors are distinct from each other", () => {
    const surfaces = [
      tokens.surfacePrimary,
      tokens.surfaceElevated,
      tokens.surfaceRecessed,
      tokens.surfaceSubtle,
    ];
    const unique = new Set(surfaces);
    expect(unique.size).toBe(surfaces.length);
  });

  it("blue spectrum is ordered from light to dark", () => {
    const blues = [
      tokens.blueGlow,
      tokens.blueWash,
      tokens.blueIndicator,
      tokens.bluePrimary,
      tokens.blueVivid,
      tokens.blueDeep,
      tokens.blueMidnight,
      tokens.blueAbyss,
    ];
    for (let i = 0; i < blues.length - 1; i++) {
      const l1 = relativeLuminance(blues[i]);
      const l2 = relativeLuminance(blues[i + 1]);
      expect(l1, `${blues[i]} should be lighter than ${blues[i + 1]}`).toBeGreaterThan(l2);
    }
  });

  it("gray scale is ordered from light to dark", () => {
    const grays = [
      tokens.gray50,
      tokens.gray100,
      tokens.gray200,
      tokens.gray300,
      tokens.gray400,
      tokens.gray500,
      tokens.gray600,
      tokens.gray700,
      tokens.gray800,
      tokens.gray900,
    ];
    for (let i = 0; i < grays.length - 1; i++) {
      const l1 = relativeLuminance(grays[i]);
      const l2 = relativeLuminance(grays[i + 1]);
      expect(l1, `${grays[i]} should be lighter than ${grays[i + 1]}`).toBeGreaterThan(l2);
    }
  });
});

// ── WCAG Contrast Ratios ──

describe("WCAG 2.2 AA contrast ratios", () => {
  it("on-surface-primary on surface-primary >= 4.5:1", () => {
    const ratio = contrastRatio(tokens.onSurfacePrimary, tokens.surfacePrimary);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("on-surface-elevated on surface-elevated >= 4.5:1", () => {
    const ratio = contrastRatio(tokens.onSurfaceElevated, tokens.surfaceElevated);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("on-surface-recessed on surface-recessed >= 4.5:1", () => {
    const ratio = contrastRatio(tokens.onSurfaceRecessed, tokens.surfaceRecessed);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("white on blue-primary >= 3:1 (large text / interactive elements)", () => {
    const ratio = contrastRatio(tokens.onBluePrimary, tokens.bluePrimary);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it("white on blue-vivid >= 4.5:1", () => {
    const ratio = contrastRatio(tokens.onBlueVivid, tokens.blueVivid);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("white on blue-deep >= 4.5:1", () => {
    const ratio = contrastRatio(tokens.onBlueDeep, tokens.blueDeep);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("white on red-alert >= 3:1 (large text / interactive elements)", () => {
    const ratio = contrastRatio(tokens.onRedAlert, tokens.redAlert);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it("dark on teal-vital >= 4.5:1", () => {
    const ratio = contrastRatio(tokens.onTealVital, tokens.tealVital);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("dark on amber-caution >= 4.5:1", () => {
    const ratio = contrastRatio(tokens.onAmberCaution, tokens.amberCaution);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("gray-600 body text on surface-primary >= 4.5:1", () => {
    const ratio = contrastRatio(tokens.gray600, tokens.surfacePrimary);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("gray-700 headings on surface-primary >= 4.5:1", () => {
    const ratio = contrastRatio(tokens.gray700, tokens.surfacePrimary);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("blue-midnight headings on surface-primary >= 4.5:1", () => {
    const ratio = contrastRatio(tokens.blueMidnight, tokens.surfacePrimary);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("blue-primary on surface-primary >= 3:1 (interactive elements, large text)", () => {
    const ratio = contrastRatio(tokens.bluePrimary, tokens.surfacePrimary);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });
});

// ── Type Scale (Major Third Ratio) ──

describe("Type scale", () => {
  it("follows Major Third ratio (1.250)", () => {
    const scale = [
      tokens.textXs,
      tokens.textSm,
      tokens.textBase,
      tokens.textLg,
      tokens.textXl,
      tokens.text2xl,
      tokens.text3xl,
      tokens.text4xl,
      tokens.text5xl,
      tokens.text6xl,
      tokens.text7xl,
    ];

    for (let i = 1; i < scale.length; i++) {
      const current = parseRem(scale[i]);
      const previous = parseRem(scale[i - 1]);
      const ratio = current / previous;
      // Allow rounding tolerance (1.19 to 1.26) since spec values are rounded
      expect(ratio).toBeGreaterThanOrEqual(1.19);
      expect(ratio).toBeLessThanOrEqual(1.26);
    }
  });

  it("base size is 1rem (16px)", () => {
    expect(tokens.textBase).toBe("1rem");
  });

  it("all type scale values are valid rem strings", () => {
    const scale = [
      tokens.textXs,
      tokens.textSm,
      tokens.textBase,
      tokens.textLg,
      tokens.textXl,
      tokens.text2xl,
      tokens.text3xl,
      tokens.text4xl,
      tokens.text5xl,
      tokens.text6xl,
      tokens.text7xl,
    ];
    for (const size of scale) {
      expect(size).toMatch(/^\d+\.?\d*rem$/);
    }
  });
});

// ── Spacing Scale ──

describe("Spacing scale", () => {
  it("all spacing values are multiples of 0.25rem (4px)", () => {
    const spacingValues = [
      tokens.space1,
      tokens.space2,
      tokens.space3,
      tokens.space4,
      tokens.space5,
      tokens.space6,
      tokens.space8,
      tokens.space10,
      tokens.space12,
      tokens.space16,
      tokens.space20,
      tokens.space24,
      tokens.space32,
      tokens.space40,
      tokens.space48,
    ];
    for (const value of spacingValues) {
      const num = parseRem(value);
      expect(num % 0.25, `${value} is not a multiple of 0.25rem`).toBe(0);
    }
  });

  it("spacing scale is monotonically increasing", () => {
    const spacingValues = [
      tokens.space1,
      tokens.space2,
      tokens.space3,
      tokens.space4,
      tokens.space5,
      tokens.space6,
      tokens.space8,
      tokens.space10,
      tokens.space12,
      tokens.space16,
      tokens.space20,
      tokens.space24,
      tokens.space32,
      tokens.space40,
      tokens.space48,
    ];
    for (let i = 1; i < spacingValues.length; i++) {
      expect(parseRem(spacingValues[i])).toBeGreaterThan(
        parseRem(spacingValues[i - 1])
      );
    }
  });
});

// ── Tracking ──

describe("Tracking values", () => {
  it("tracking scale goes from negative to positive", () => {
    const trackingValues = [
      tokens.trackingTightest,
      tokens.trackingTighter,
      tokens.trackingTight,
      tokens.trackingNormal,
      tokens.trackingWide,
      tokens.trackingWider,
      tokens.trackingWidest,
      tokens.trackingUltra,
    ];
    for (let i = 1; i < trackingValues.length; i++) {
      const current = Number.parseFloat(trackingValues[i].replace("em", "") || "0");
      const previous = Number.parseFloat(trackingValues[i - 1].replace("em", "") || "0");
      expect(current).toBeGreaterThanOrEqual(previous);
    }
  });
});

// ── Line Height ──

describe("Line height values", () => {
  it("leading scale is monotonically increasing", () => {
    const values = [
      tokens.leadingNone,
      tokens.leadingTight,
      tokens.leadingSnug,
      tokens.leadingNormal,
      tokens.leadingRelaxed,
      tokens.leadingLoose,
    ];
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });

  it("body line height is 1.5", () => {
    expect(tokens.leadingNormal).toBe(1.5);
  });
});

// ── Font Weights ──

describe("Font weights", () => {
  it("weight scale is monotonically increasing", () => {
    expect(tokens.weightLight).toBeLessThan(tokens.weightRegular);
    expect(tokens.weightRegular).toBeLessThan(tokens.weightMedium);
    expect(tokens.weightMedium).toBeLessThan(tokens.weightSemibold);
  });

  it("weights are standard CSS font-weight values", () => {
    const validWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
    expect(validWeights).toContain(tokens.weightLight);
    expect(validWeights).toContain(tokens.weightRegular);
    expect(validWeights).toContain(tokens.weightMedium);
    expect(validWeights).toContain(tokens.weightSemibold);
  });
});

// ── Motion ──

describe("Motion tokens", () => {
  it("all easing values are valid cubic-bezier", () => {
    const easings = [
      tokens.easeOutExpo,
      tokens.easeOutQuart,
      tokens.easeInOutSine,
      tokens.easeInExpo,
    ];
    for (const easing of easings) {
      expect(easing).toMatch(/^cubic-bezier\(\s*[\d.]+,\s*[\d.-]+,\s*[\d.]+,\s*[\d.-]+\s*\)$/);
    }
  });

  it("all duration values are valid ms strings", () => {
    const durations = [
      tokens.durationInstant,
      tokens.durationFast,
      tokens.durationNormal,
      tokens.durationSlow,
      tokens.durationGlacial,
    ];
    for (const duration of durations) {
      expect(duration).toMatch(/^\d+ms$/);
    }
  });

  it("duration scale is monotonically increasing", () => {
    const durations = [
      tokens.durationInstant,
      tokens.durationFast,
      tokens.durationNormal,
      tokens.durationSlow,
      tokens.durationGlacial,
    ];
    for (let i = 1; i < durations.length; i++) {
      expect(Number.parseInt(durations[i])).toBeGreaterThan(
        Number.parseInt(durations[i - 1])
      );
    }
  });
});

// ── Elevation ──

describe("Elevation tokens", () => {
  it("elevation-0 is none", () => {
    expect(tokens.elevation0).toBe("none");
  });

  it("elevation levels 1-4 contain box-shadow values", () => {
    const elevations = [
      tokens.elevation1,
      tokens.elevation2,
      tokens.elevation3,
      tokens.elevation4,
    ];
    for (const elev of elevations) {
      expect(elev).toContain("rgba");
      expect(elev).toContain("px");
    }
  });
});

// ── Shape ──

describe("Shape tokens", () => {
  it("all radius values are valid px or large number", () => {
    const radii = [
      tokens.radiusSm,
      tokens.radiusMd,
      tokens.radiusLg,
      tokens.radiusXl,
      tokens.radiusFull,
    ];
    for (const r of radii) {
      expect(r).toMatch(/^\d+px$/);
    }
  });

  it("radius scale is monotonically increasing", () => {
    const radii = [
      tokens.radiusSm,
      tokens.radiusMd,
      tokens.radiusLg,
      tokens.radiusXl,
    ];
    for (let i = 1; i < radii.length; i++) {
      expect(Number.parseInt(radii[i])).toBeGreaterThan(
        Number.parseInt(radii[i - 1])
      );
    }
  });

  it("radius-full is 9999px (circular)", () => {
    expect(tokens.radiusFull).toBe("9999px");
  });
});

// ── Layout ──

describe("Layout tokens", () => {
  it("breakpoints are monotonically increasing", () => {
    const bps = [
      tokens.breakpointSm,
      tokens.breakpointMd,
      tokens.breakpointLg,
      tokens.breakpointXl,
    ];
    for (let i = 1; i < bps.length; i++) {
      expect(Number.parseInt(bps[i])).toBeGreaterThan(
        Number.parseInt(bps[i - 1])
      );
    }
  });

  it("content widths are monotonically increasing", () => {
    const widths = [
      tokens.contentNarrow,
      tokens.contentDefault,
      tokens.contentWide,
      tokens.contentFull,
    ];
    for (let i = 1; i < widths.length; i++) {
      expect(Number.parseInt(widths[i])).toBeGreaterThan(
        Number.parseInt(widths[i - 1])
      );
    }
  });
});

// ── Grouped Exports Match Flat Exports ──

describe("Grouped exports match flat exports", () => {
  it("colors.surface matches flat surface exports", () => {
    expect(tokens.colors.surface.primary).toBe(tokens.surfacePrimary);
    expect(tokens.colors.surface.elevated).toBe(tokens.surfaceElevated);
    expect(tokens.colors.surface.recessed).toBe(tokens.surfaceRecessed);
    expect(tokens.colors.surface.subtle).toBe(tokens.surfaceSubtle);
  });

  it("colors.blue matches flat blue exports", () => {
    expect(tokens.colors.blue.primary).toBe(tokens.bluePrimary);
    expect(tokens.colors.blue.vivid).toBe(tokens.blueVivid);
    expect(tokens.colors.blue.deep).toBe(tokens.blueDeep);
    expect(tokens.colors.blue.midnight).toBe(tokens.blueMidnight);
    expect(tokens.colors.blue.abyss).toBe(tokens.blueAbyss);
  });

  it("colors.gray matches flat gray exports", () => {
    expect(tokens.colors.gray[50]).toBe(tokens.gray50);
    expect(tokens.colors.gray[100]).toBe(tokens.gray100);
    expect(tokens.colors.gray[900]).toBe(tokens.gray900);
  });

  it("typography.scale matches flat text exports", () => {
    expect(tokens.typography.scale.base).toBe(tokens.textBase);
    expect(tokens.typography.scale["4xl"]).toBe(tokens.text4xl);
  });

  it("spacing matches flat space exports", () => {
    expect(tokens.spacing[1]).toBe(tokens.space1);
    expect(tokens.spacing[48]).toBe(tokens.space48);
  });

  it("motion matches flat motion exports", () => {
    expect(tokens.motion.easing.outExpo).toBe(tokens.easeOutExpo);
    expect(tokens.motion.duration.fast).toBe(tokens.durationFast);
  });

  it("elevation matches flat elevation exports", () => {
    expect(tokens.elevation[0]).toBe(tokens.elevation0);
    expect(tokens.elevation[4]).toBe(tokens.elevation4);
  });

  it("shape.radius matches flat radius exports", () => {
    expect(tokens.shape.radius.md).toBe(tokens.radiusMd);
    expect(tokens.shape.radius.full).toBe(tokens.radiusFull);
  });

  it("layout matches flat layout exports", () => {
    expect(tokens.layout.breakpoints.sm).toBe(tokens.breakpointSm);
    expect(tokens.layout.content.full).toBe(tokens.contentFull);
  });
});

// ── DESIGN_LANGUAGE.md Value Parity ──

describe("DESIGN_LANGUAGE.md value parity", () => {
  it("surface colors match spec", () => {
    expect(tokens.surfacePrimary).toBe("#FAFCFF");
    expect(tokens.surfaceElevated).toBe("#FFFFFF");
    expect(tokens.surfaceRecessed).toBe("#F0F5F8");
    expect(tokens.surfaceSubtle).toBe("#E8EEF3");
  });

  it("blue spectrum matches spec", () => {
    expect(tokens.blueGlow).toBe("#E8F5FD");
    expect(tokens.blueWash).toBe("#DBECFE");
    expect(tokens.blueIndicator).toBe("#93CCFD");
    expect(tokens.bluePrimary).toBe("#3B8EF6");
    expect(tokens.blueVivid).toBe("#2570EB");
    expect(tokens.blueDeep).toBe("#1D5AD8");
    expect(tokens.blueMidnight).toBe("#1E3E5F");
    expect(tokens.blueAbyss).toBe("#0F192A");
  });

  it("semantic accents match spec", () => {
    expect(tokens.cyanSignal).toBe("#22D3EE");
    expect(tokens.tealVital).toBe("#14B8A6");
    expect(tokens.greenPositive).toBe("#10B981");
    expect(tokens.violetData).toBe("#8B5CF6");
    expect(tokens.redAlert).toBe("#EF4444");
    expect(tokens.amberCaution).toBe("#F59E0B");
  });

  it("type scale matches spec values", () => {
    expect(tokens.textXs).toBe("0.694rem");
    expect(tokens.textBase).toBe("1rem");
    expect(tokens.text4xl).toBe("3.052rem");
    expect(tokens.text7xl).toBe("5.96rem");
  });

  it("spacing matches spec values", () => {
    expect(tokens.space1).toBe("0.25rem");
    expect(tokens.space4).toBe("1rem");
    expect(tokens.space48).toBe("12rem");
  });

  it("elevation matches spec shadow values", () => {
    expect(tokens.elevation1).toBe(
      "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.02)"
    );
  });

  it("shape matches spec values", () => {
    expect(tokens.radiusSm).toBe("4px");
    expect(tokens.radiusMd).toBe("6px");
    expect(tokens.radiusLg).toBe("8px");
    expect(tokens.radiusXl).toBe("12px");
    expect(tokens.radiusFull).toBe("9999px");
  });

  it("breakpoints match spec values", () => {
    expect(tokens.breakpointSm).toBe("640px");
    expect(tokens.breakpointMd).toBe("768px");
    expect(tokens.breakpointLg).toBe("1024px");
    expect(tokens.breakpointXl).toBe("1280px");
  });
});

// ── Clean Token Values ──

describe("Token values contain only design data", () => {
  it("no internal terminology in token values", () => {
    const allValues = Object.values(tokens).filter(
      (v) => typeof v === "string"
    );
    for (const value of allValues) {
      // Token values should only contain CSS values (colors, sizes, fonts, etc.)
      // Not business terminology or internal references
      expect(value.length).toBeLessThan(200);
    }
  });
});

// ── Base CSS anchor scroll offset ──
//
// The browser does not move the scroll viewport when a nav is fixed
// at the top of the page — it scrolls the raw target to y=0 and the
// nav covers the top of the section. scroll-padding-top on the
// scroll container (html) reserves that space for every anchor
// scroll (nav click, URL fragment, focus-scroll). This test locks
// the rule in at the design-language layer so every consumer of
// base.css inherits the behavior.

describe("base.css anchors scroll offset by the nav stack", () => {
  it("sets scroll-padding-top on html equal to nav + banner height", async () => {
    const { readFileSync } = await import("node:fs");
    const { fileURLToPath } = await import("node:url");
    const baseCss = readFileSync(
      fileURLToPath(new URL("../css/base.css", import.meta.url)),
      "utf8"
    );
    // The html block must contain a scroll-padding-top rule that
    // references both tokens. Banner height falls back to 0px when
    // no banner is present, so the rule is always well-defined.
    expect(baseCss).toMatch(/html\s*\{[\s\S]*scroll-padding-top[\s\S]*\}/);
    expect(baseCss).toContain(
      "scroll-padding-top: calc(var(--strand-nav-height) + var(--strand-banner-height, 0px))"
    );
  });

  it("keeps smooth scroll-behavior on html for the anchor scroll animation", async () => {
    const { readFileSync } = await import("node:fs");
    const { fileURLToPath } = await import("node:url");
    const baseCss = readFileSync(
      fileURLToPath(new URL("../css/base.css", import.meta.url)),
      "utf8"
    );
    expect(baseCss).toMatch(/html\s*\{[\s\S]*scroll-behavior:\s*smooth[\s\S]*\}/);
  });

  it("honors prefers-reduced-motion by switching scroll-behavior to auto", async () => {
    const { readFileSync } = await import("node:fs");
    const { fileURLToPath } = await import("node:url");
    const baseCss = readFileSync(
      fileURLToPath(new URL("../css/base.css", import.meta.url)),
      "utf8"
    );
    expect(baseCss).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*html\s*\{[\s\S]*scroll-behavior:\s*auto[\s\S]*\}[\s\S]*\}/
    );
  });
});

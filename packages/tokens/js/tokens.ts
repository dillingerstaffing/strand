/*! Strand v0.1.0 | MIT License | dillingerstaffing.com */

/**
 * Strand Design Tokens
 * Typed JS constants mirroring tokens.css.
 * Every value here MUST match the corresponding CSS custom property.
 */

// ── Fonts ──

export const fontSans =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" as const;
export const fontMono =
  "'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace" as const;

// ── Surface Palette ──

export const surfacePrimary = "#FAFCFE" as const;
export const surfaceElevated = "#FFFFFF" as const;
export const surfaceRecessed = "#F0F4F8" as const;
export const surfaceSubtle = "#E8EDF3" as const;

// ── Blue: Biosynthetic Spectrum ──

export const blueGlow = "#E8F4FD" as const;
export const blueWash = "#DBEAFE" as const;
export const blueIndicator = "#93C5FD" as const;
export const bluePrimary = "#3B82F6" as const;
export const blueVivid = "#2563EB" as const;
export const blueDeep = "#1D4ED8" as const;
export const blueMidnight = "#1E3A5F" as const;
export const blueAbyss = "#0F172A" as const;

// ── Cool Grays (blue-shifted) ──

export const gray50 = "#F8FAFC" as const;
export const gray100 = "#F1F5F9" as const;
export const gray200 = "#E2E8F0" as const;
export const gray300 = "#CBD5E1" as const;
export const gray400 = "#94A3B8" as const;
export const gray500 = "#64748B" as const;
export const gray600 = "#475569" as const;
export const gray700 = "#334155" as const;
export const gray800 = "#1E293B" as const;
export const gray900 = "#0F172A" as const;

// ── Semantic Accents ──

export const cyanSignal = "#22D3EE" as const;
export const tealVital = "#14B8A6" as const;
export const greenPositive = "#10B981" as const;
export const violetData = "#8B5CF6" as const;
export const redAlert = "#EF4444" as const;
export const amberCaution = "#F59E0B" as const;

// ── On-Colors (contrast-safe text pairings) ──

export const onSurfacePrimary = "#475569" as const;
export const onSurfaceElevated = "#475569" as const;
export const onSurfaceRecessed = "#475569" as const;
export const onBluePrimary = "#FFFFFF" as const;
export const onBlueVivid = "#FFFFFF" as const;
export const onBlueDeep = "#FFFFFF" as const;
export const onRedAlert = "#FFFFFF" as const;
export const onTealVital = "#0F172A" as const;
export const onAmberCaution = "#0F172A" as const;

// ── Type Scale (Major Third, 1.250 ratio) ──

export const textXs = "0.694rem" as const;
export const textSm = "0.833rem" as const;
export const textBase = "1rem" as const;
export const textLg = "1.25rem" as const;
export const textXl = "1.563rem" as const;
export const text2xl = "1.953rem" as const;
export const text3xl = "2.441rem" as const;
export const text4xl = "3.052rem" as const;
export const text5xl = "3.815rem" as const;
export const text6xl = "4.768rem" as const;
export const text7xl = "5.96rem" as const;

// ── Tracking (letter-spacing) ──

export const trackingTightest = "-0.05em" as const;
export const trackingTighter = "-0.03em" as const;
export const trackingTight = "-0.02em" as const;
export const trackingNormal = "0" as const;
export const trackingWide = "0.02em" as const;
export const trackingWider = "0.05em" as const;
export const trackingWidest = "0.08em" as const;
export const trackingUltra = "0.12em" as const;

// ── Line Height ──

export const leadingNone = 1.0;
export const leadingTight = 1.15;
export const leadingSnug = 1.25;
export const leadingNormal = 1.5;
export const leadingRelaxed = 1.625;
export const leadingLoose = 1.75;

// ── Font Weight ──

export const weightLight = 300;
export const weightRegular = 400;
export const weightMedium = 500;
export const weightSemibold = 600;

// ── Spacing (4px base unit) ──

export const space1 = "0.25rem" as const;
export const space2 = "0.5rem" as const;
export const space3 = "0.75rem" as const;
export const space4 = "1rem" as const;
export const space5 = "1.25rem" as const;
export const space6 = "1.5rem" as const;
export const space8 = "2rem" as const;
export const space10 = "2.5rem" as const;
export const space12 = "3rem" as const;
export const space16 = "4rem" as const;
export const space20 = "5rem" as const;
export const space24 = "6rem" as const;
export const space32 = "8rem" as const;
export const space40 = "10rem" as const;
export const space48 = "12rem" as const;

// ── Motion: Easing ──

export const easeOutExpo = "cubic-bezier(0.16, 1, 0.3, 1)" as const;
export const easeOutQuart = "cubic-bezier(0.25, 1, 0.5, 1)" as const;
export const easeInOutSine = "cubic-bezier(0.37, 0, 0.63, 1)" as const;
export const easeInExpo = "cubic-bezier(0.7, 0, 0.84, 0)" as const;

// ── Motion: Duration ──

export const durationInstant = "75ms" as const;
export const durationFast = "150ms" as const;
export const durationNormal = "250ms" as const;
export const durationSlow = "400ms" as const;
export const durationGlacial = "700ms" as const;

// ── Elevation (box-shadow values) ──

export const elevation0 = "none" as const;
export const elevation1 =
  "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.02)" as const;
export const elevation2 =
  "0 4px 6px rgba(15, 23, 42, 0.04), 0 12px 24px rgba(15, 23, 42, 0.06)" as const;
export const elevation3 =
  "0 8px 16px rgba(15, 23, 42, 0.06), 0 24px 48px rgba(15, 23, 42, 0.08)" as const;
export const elevation4 =
  "0 16px 32px rgba(15, 23, 42, 0.08), 0 32px 64px rgba(15, 23, 42, 0.12)" as const;

// ── Shape (border-radius) ──

export const radiusSm = "4px" as const;
export const radiusMd = "6px" as const;
export const radiusLg = "8px" as const;
export const radiusXl = "12px" as const;
export const radiusFull = "9999px" as const;

// ── Layout: Breakpoints ──

export const breakpointSm = "640px" as const;
export const breakpointMd = "768px" as const;
export const breakpointLg = "1024px" as const;
export const breakpointXl = "1280px" as const;

// ── Layout: Content Widths ──

export const contentNarrow = "640px" as const;
export const contentDefault = "768px" as const;
export const contentWide = "1024px" as const;
export const contentFull = "1280px" as const;

// ── Grouped Exports ──

export const colors = {
  surface: { primary: surfacePrimary, elevated: surfaceElevated, recessed: surfaceRecessed, subtle: surfaceSubtle },
  blue: { glow: blueGlow, wash: blueWash, indicator: blueIndicator, primary: bluePrimary, vivid: blueVivid, deep: blueDeep, midnight: blueMidnight, abyss: blueAbyss },
  gray: { 50: gray50, 100: gray100, 200: gray200, 300: gray300, 400: gray400, 500: gray500, 600: gray600, 700: gray700, 800: gray800, 900: gray900 },
  semantic: { cyanSignal, tealVital, greenPositive, violetData, redAlert, amberCaution },
  on: { surfacePrimary: onSurfacePrimary, surfaceElevated: onSurfaceElevated, surfaceRecessed: onSurfaceRecessed, bluePrimary: onBluePrimary, blueVivid: onBlueVivid, blueDeep: onBlueDeep, redAlert: onRedAlert, tealVital: onTealVital, amberCaution: onAmberCaution },
} as const;

export const typography = {
  fonts: { sans: fontSans, mono: fontMono },
  scale: { xs: textXs, sm: textSm, base: textBase, lg: textLg, xl: textXl, "2xl": text2xl, "3xl": text3xl, "4xl": text4xl, "5xl": text5xl, "6xl": text6xl, "7xl": text7xl },
  tracking: { tightest: trackingTightest, tighter: trackingTighter, tight: trackingTight, normal: trackingNormal, wide: trackingWide, wider: trackingWider, widest: trackingWidest, ultra: trackingUltra },
  leading: { none: leadingNone, tight: leadingTight, snug: leadingSnug, normal: leadingNormal, relaxed: leadingRelaxed, loose: leadingLoose },
  weight: { light: weightLight, regular: weightRegular, medium: weightMedium, semibold: weightSemibold },
} as const;

export const spacing = {
  1: space1, 2: space2, 3: space3, 4: space4, 5: space5, 6: space6,
  8: space8, 10: space10, 12: space12, 16: space16, 20: space20,
  24: space24, 32: space32, 40: space40, 48: space48,
} as const;

export const motion = {
  easing: { outExpo: easeOutExpo, outQuart: easeOutQuart, inOutSine: easeInOutSine, inExpo: easeInExpo },
  duration: { instant: durationInstant, fast: durationFast, normal: durationNormal, slow: durationSlow, glacial: durationGlacial },
} as const;

export const elevation = {
  0: elevation0, 1: elevation1, 2: elevation2, 3: elevation3, 4: elevation4,
} as const;

export const shape = {
  radius: { sm: radiusSm, md: radiusMd, lg: radiusLg, xl: radiusXl, full: radiusFull },
} as const;

export const layout = {
  breakpoints: { sm: breakpointSm, md: breakpointMd, lg: breakpointLg, xl: breakpointXl },
  content: { narrow: contentNarrow, default: contentDefault, wide: contentWide, full: contentFull },
} as const;

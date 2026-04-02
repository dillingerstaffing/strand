# Strand Design Language

Version: 0.1.0

Strand is a design language for building interfaces that feel precise, restrained, and engineered. It occupies a specific aesthetic niche: the biosynthetic laboratory. Clean surfaces. Cool-shifted whites. A single blue accent used with discipline. Typography that carries 80% of the design weight. Performance as a first-class design property.

---

## 1. Philosophy

Strand is built on six principles. When making any design decision, apply these in order:

**1. Restraint is the signal of advancement.**
The most advanced interfaces in fiction and reality share one trait: extreme restraint. Clutter signals primitive. Space signals advanced. Delete before you add.

**2. Performance is design.**
A 60fps animation is premium. A 30fps animation is cheap. A 1-second page load is confidence. A 3-second page load is doubt. No visual treatment compensates for poor performance. Speed is the first and last design decision.

**3. Blue is the biosynthetic signal.**
One accent color. Used with discipline. It means: active, alive, processing, interactive, important. Everywhere else is white, gray, and negative space.

**4. Typography carries 80% of the design.**
Strand does not rely on imagery to feel designed. The type scale, tracking, weight hierarchy, and monospace labels create the aesthetic on their own. If the design works in grayscale with no images, it works.

**5. Every element earns its place.**
No decorative elements. No stock photos. No illustrations. No icons for decoration. If a visual element cannot state its purpose in one sentence, delete it.

**6. Accessibility is physics, not a feature.**
It is not negotiable, not optional, not aspirational. It is a constraint of the medium, like gravity is a constraint of architecture. Design within it.

Strand's defaults ARE the design philosophy. A consumer who uses every component at its default settings, without reading any documentation, should produce output that embodies the biosynthetic laboratory aesthetic. If the defaults produce cramped, generic, or visually flat output, the design language has failed, not the consumer. Every default value is a design decision.

---

## 2. Color

### 2.1 Philosophy

Strand uses cool-shifted whites as the dominant surface. Not pure white (#FFFFFF), which feels like a blank page. Not warm cream, which feels literary. Strand whites have a barely-perceptible blue tint that communicates "controlled environment" without feeling clinical.

The accent is a single, carefully calibrated blue. Not corporate blue (too dark, too safe). Not neon blue (too aggressive). The blue of precision instrumentation.

### 2.2 Surface Palette

| Token | Value | Purpose |
|---|---|---|
| `--strand-surface-primary` | `#FAFCFE` | Page background. Barely blue. |
| `--strand-surface-elevated` | `#FFFFFF` | Cards, modals. Pure white, lifted. |
| `--strand-surface-recessed` | `#F0F4F8` | Secondary sections, form fields. |
| `--strand-surface-subtle` | `#E8EDF3` | Borders, dividers, faint rules. |

### 2.3 Blue Biosynthetic Spectrum

| Token | Value | Purpose |
|---|---|---|
| `--strand-blue-glow` | `#E8F4FD` | Hover states, selected rows, active sections. |
| `--strand-blue-wash` | `#DBEAFE` | Light backgrounds for emphasis. |
| `--strand-blue-indicator` | `#93C5FD` | Progress bars, secondary interactive. |
| `--strand-blue-primary` | `#3B82F6` | Primary actions, links, key data. |
| `--strand-blue-vivid` | `#2563EB` | Hover on primary elements. |
| `--strand-blue-deep` | `#1D4ED8` | Active/pressed states, high-emphasis data. |
| `--strand-blue-midnight` | `#1E3A5F` | Headlines on light backgrounds. |
| `--strand-blue-abyss` | `#0F172A` | Maximum contrast text. |

### 2.4 Cool Grays (Blue-Shifted)

| Token | Value | Purpose |
|---|---|---|
| `--strand-gray-50` | `#F8FAFC` | Lightest gray. |
| `--strand-gray-100` | `#F1F5F9` | Subtle backgrounds. |
| `--strand-gray-200` | `#E2E8F0` | Borders, dividers. |
| `--strand-gray-300` | `#CBD5E1` | Disabled states. |
| `--strand-gray-400` | `#94A3B8` | Placeholder text. |
| `--strand-gray-500` | `#64748B` | Secondary text. |
| `--strand-gray-600` | `#475569` | Primary body text. |
| `--strand-gray-700` | `#334155` | Headings. |
| `--strand-gray-800` | `#1E293B` | Strong headings. |
| `--strand-gray-900` | `#0F172A` | Maximum contrast. |

### 2.5 Semantic Accents

| Token | Value | Purpose |
|---|---|---|
| `--strand-cyan-signal` | `#22D3EE` | Data visualization, energy. |
| `--strand-teal-vital` | `#14B8A6` | Success, confirmation. |
| `--strand-green-positive` | `#10B981` | Growth, positive delta. |
| `--strand-violet-data` | `#8B5CF6` | Secondary data category. |
| `--strand-red-alert` | `#EF4444` | Errors, critical. |
| `--strand-amber-caution` | `#F59E0B` | Warnings. |

### 2.6 On-Colors (Contrast-Safe Text Pairings)

Every background color has a designated text color that meets WCAG 2.2 AA contrast requirements.

| Background Token | On-Color Token | Value | Contrast Ratio |
|---|---|---|---|
| `--strand-surface-primary` | `--strand-on-surface-primary` | `#475569` (gray-600) | 5.74:1 |
| `--strand-surface-elevated` | `--strand-on-surface-elevated` | `#475569` (gray-600) | 5.91:1 |
| `--strand-surface-recessed` | `--strand-on-surface-recessed` | `#475569` (gray-600) | 5.20:1 |
| `--strand-blue-primary` | `--strand-on-blue-primary` | `#FFFFFF` | 3.68:1 (large text/interactive) |
| `--strand-blue-vivid` | `--strand-on-blue-vivid` | `#FFFFFF` | 5.45:1 |
| `--strand-blue-deep` | `--strand-on-blue-deep` | `#FFFFFF` | 6.74:1 |
| `--strand-red-alert` | `--strand-on-red-alert` | `#FFFFFF` | 3.76:1 (large text/interactive) |
| `--strand-teal-vital` | `--strand-on-teal-vital` | `#0F172A` (gray-900) | 7.46:1 |
| `--strand-amber-caution` | `--strand-on-amber-caution` | `#0F172A` (gray-900) | 8.29:1 |

### The Blue Discipline

Blue is the single accent color. It signals: interactive, alive, important. It does NOT signal "this text is special" or "this label should stand out." If an element is not clickable, not data, and not a status indicator, it does not get blue. Non-interactive annotation text uses `--strand-gray-500`. The difference between a precision instrument and a decorated page is that blue MEANS something on the instrument.

### 2.7 Usage Rules

1. **70% surface whites, 25% cool grays, 5% blue accent.** This ratio defines the aesthetic.
2. **Blue is earned.** It appears on interactive elements, key data, and status indicators. Not decoration.
3. **Never use warm colors in the base palette.** Warm colors imply organic, cozy, imprecise. Strand is cool, controlled, precise.
4. **Semantic colors appear only in data/status contexts.** Never as brand expression.
5. **Dark text is `--strand-gray-600` for body, `--strand-gray-700` or `--strand-blue-midnight` for headlines.** Never pure black (#000000). Blue-shifted dark gray is sophisticated and easier on eyes.

---

## 3. Typography

### 3.1 Font Stack

**Primary (UI / Headlines):** Inter
- Geometric, engineered for screens, open-source, variable-weight, optimized for every size.
- `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`

**Monospace (Data / Labels / Code):** JetBrains Mono
- Purpose-built for code and data display, excellent legibility at small sizes, ligatures.
- `'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace`

### 3.2 Type Scale (Major Third, 1.250 ratio)

| Token | Size | Pixel Equivalent | Use |
|---|---|---|---|
| `--strand-text-xs` | `0.694rem` | 11.1px | Monospace labels, fine metadata |
| `--strand-text-sm` | `0.833rem` | 13.3px | Captions, timestamps, field labels |
| `--strand-text-base` | `1rem` | 16px | Body text |
| `--strand-text-lg` | `1.25rem` | 20px | Lead paragraphs, card titles |
| `--strand-text-xl` | `1.563rem` | 25px | H4, subheadings |
| `--strand-text-2xl` | `1.953rem` | 31.3px | H3 |
| `--strand-text-3xl` | `2.441rem` | 39px | H2 |
| `--strand-text-4xl` | `3.052rem` | 48.8px | H1 |
| `--strand-text-5xl` | `3.815rem` | 61px | Hero headline |
| `--strand-text-6xl` | `4.768rem` | 76.3px | Display, single statement |
| `--strand-text-7xl` | `5.96rem` | 95.4px | Ultra-display, one word |

### 3.3 Letter-Spacing (Tracking)

Large text tighter, small text looser. Tight tracking on large text is the single most impactful "premium" adjustment.

| Token | Value | Use |
|---|---|---|
| `--strand-tracking-tightest` | `-0.05em` | Display 60px+ |
| `--strand-tracking-tighter` | `-0.03em` | Large headlines 40-60px |
| `--strand-tracking-tight` | `-0.02em` | H1-H2, 30-48px |
| `--strand-tracking-normal` | `0` | Body, 16-20px |
| `--strand-tracking-wide` | `0.02em` | Monospace data |
| `--strand-tracking-wider` | `0.05em` | Small labels |
| `--strand-tracking-widest` | `0.08em` | All-caps overlines |
| `--strand-tracking-ultra` | `0.12em` | Spaced-out micro-labels |

### 3.4 Line Height

As font size increases, line-height ratio decreases.

| Token | Value | Use |
|---|---|---|
| `--strand-leading-none` | `1.0` | Display text, single-line heroes |
| `--strand-leading-tight` | `1.15` | Large headlines 40px+ |
| `--strand-leading-snug` | `1.25` | Medium headlines 24-40px |
| `--strand-leading-normal` | `1.5` | Body text |
| `--strand-leading-relaxed` | `1.625` | Long-form, narrow columns |
| `--strand-leading-loose` | `1.75` | Very small text, captions |

### 3.5 Font Weight Hierarchy

| Role | Weight | Tracking | Line Height |
|---|---|---|---|
| Display headlines | 300 (Light) | tighter (-0.03em) | tight (1.15) |
| Subheadings | 500 (Medium) | tight (-0.02em) | snug (1.25) |
| Body text | 400 (Regular) | normal (0) | normal (1.5) |
| Overlines / Labels | 500 (Medium) + uppercase + monospace | widest (0.08em) | - |
| Data values | 600 (SemiBold) + monospace | wide (0.02em) | - |

Light-weight headlines at large sizes: thin strokes become visible and elegant. The contrast between 300-weight 72px heading and 400-weight 16px body creates hierarchy through weight differential.

### 3.6 Paragraph Width

60-75 characters per line. Non-negotiable: `max-width: 65ch`.

---

## 4. Spacing

### 4.1 Base Unit: 4px (0.25rem)

Every spacing value is a multiple of 4px. Mathematical rhythm the eye perceives as "designed."

| Token | Value | Pixels |
|---|---|---|
| `--strand-space-1` | `0.25rem` | 4px |
| `--strand-space-2` | `0.5rem` | 8px |
| `--strand-space-3` | `0.75rem` | 12px |
| `--strand-space-4` | `1rem` | 16px |
| `--strand-space-5` | `1.25rem` | 20px |
| `--strand-space-6` | `1.5rem` | 24px |
| `--strand-space-8` | `2rem` | 32px |
| `--strand-space-10` | `2.5rem` | 40px |
| `--strand-space-12` | `3rem` | 48px |
| `--strand-space-16` | `4rem` | 64px |
| `--strand-space-20` | `5rem` | 80px |
| `--strand-space-24` | `6rem` | 96px |
| `--strand-space-32` | `8rem` | 128px |
| `--strand-space-40` | `10rem` | 160px |
| `--strand-space-48` | `12rem` | 192px |

### 4.2 Section Rhythm

| Context | Value |
|---|---|
| Standard section padding | `clamp(4rem, 8vw, 8rem)` |
| Hero section padding | `clamp(6rem, 12vw, 12rem)` |
| Section header margin-bottom | `clamp(2rem, 4vw, 4rem)` |
| Overline to heading | `0.75rem` (space-3) |
| Heading to description | `1rem` (space-4) |

### 4.3 Premium Whitespace

Premium whitespace is consistent (4px system), proportional (larger elements get more), directional (more space above a heading than below), and purposeful (every gap groups or separates content).

Test: if you can remove 30% of the whitespace and nothing feels cramped, you had too much.

### Component Padding Tiers

Component containers (cards, alerts, dialogs, form groups) use named padding tiers that map to the spacing scale. The default tier (`md`) produces premium spacing without additional thought.

| Tier | Token | Value | Context |
|---|---|---|---|
| `sm` | `--strand-space-4` | 16px | Compact: dashboard widgets, dense data UIs, badge clusters |
| `md` | `--strand-space-6` | 24px | Standard: cards with text, form groups, alerts, toasts |
| `lg` | `--strand-space-10` | 40px | Generous: showcase previews, hero cards, documentation containers |

A consumer who uses `md` for everything should get output that feels generous, not cramped. Premium whitespace is the minimum amount that still feels generous.

**Validation test:** Remove 30% of the padding. If the result feels cramped, the original value is correct. If it still feels comfortable, the value was too generous.

### Spacing Hierarchy (Gestalt Proximity)

The gap between sibling elements must be greater than the padding within each element. Things closer together feel grouped; things further apart feel separate.

| Within-element padding | Minimum sibling gap |
|---|---|
| sm (16px) | space-6 (24px) |
| md (24px) | space-8 (32px) |
| lg (40px) | space-12 (48px) |

This prevents visual hierarchy from collapsing. The eye must perceive where one card ends and the next begins without relying solely on borders.

---

## 5. Motion

### 5.1 Easing Functions

| Token | Value | Use |
|---|---|---|
| `--strand-ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Enter/open: snappy |
| `--strand-ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | General smooth |
| `--strand-ease-in-out-sine` | `cubic-bezier(0.37, 0, 0.63, 1)` | Gentle, scientific |
| `--strand-ease-in-expo` | `cubic-bezier(0.7, 0, 0.84, 0)` | Exit/close |

### 5.2 Durations

| Token | Value | Use |
|---|---|---|
| `--strand-duration-instant` | `75ms` | Opacity, color changes |
| `--strand-duration-fast` | `150ms` | Button states, toggles |
| `--strand-duration-normal` | `250ms` | Cards, dropdowns |
| `--strand-duration-slow` | `400ms` | Page transitions, large reveals |
| `--strand-duration-glacial` | `700ms` | Hero animations, entrance |

### 5.3 Animation Principles

**What signals precision:**
- Small translate distances (16-32px)
- No bounce or elastic easing
- Short stagger intervals (60-100ms)
- Opacity always animates (things fade, never pop)
- Transform-only animations (GPU compositing, 60fps)

**Never:**
- Re-animate on every viewport entry/exit
- Horizontal scroll hijacking
- Override native scroll
- Animations > 0.6s that block content
- More than 3-4 elements animating simultaneously
- Parallax on text

### 5.4 Reduced Motion

All animations must respect `prefers-reduced-motion: reduce`. Animations disable gracefully: duration drops to near-zero, scroll behavior becomes `auto`. This is not optional.

---

## 6. Elevation

5-level shadow system creating z-axis depth. All shadows use blue-shifted rgba values for cohesion with the cool palette.

| Token | Box-Shadow | Use |
|---|---|---|
| `--strand-elevation-0` | `none` | Flat, no lift. |
| `--strand-elevation-1` | `0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.02)` | Cards at rest. |
| `--strand-elevation-2` | `0 4px 6px rgba(15, 23, 42, 0.04), 0 12px 24px rgba(15, 23, 42, 0.06)` | Cards on hover, dropdowns. |
| `--strand-elevation-3` | `0 8px 16px rgba(15, 23, 42, 0.06), 0 24px 48px rgba(15, 23, 42, 0.08)` | Modals, popovers. |
| `--strand-elevation-4` | `0 16px 32px rgba(15, 23, 42, 0.08), 0 32px 64px rgba(15, 23, 42, 0.12)` | Dialogs, toasts. |

### Container Elevation Contexts

| Context | Level | Treatment |
|---|---|---|
| Card at rest | 1 | Subtle lift off the page surface |
| Card on hover | 2 | Responds to attention, signals interactivity |
| Preview/showcase container | 0 (recessed) | Sits below the card surface. Uses `--strand-surface-recessed` + inset shadow: `box-shadow: inset 0 1px 3px rgba(15, 23, 42, 0.06)`. The instrument viewport is recessed into the panel, not floating above it. |
| Modal/dialog overlay | 3 | Floats above everything, demands focus |
| Toast notification | 2 | Floats at viewport edge, temporary |

Preview containers use the recessed treatment instead of flat borders. The `.strand-viewport` class provides this: recessed background, inner shadow, generous padding.

---

## 7. Shape

Border radius system. Corners communicate personality.

| Token | Value | Use |
|---|---|---|
| `--strand-radius-sm` | `4px` | Small elements, tags, badges. |
| `--strand-radius-md` | `6px` | Interactive elements: buttons, inputs. |
| `--strand-radius-lg` | `8px` | Containers: cards. |
| `--strand-radius-xl` | `12px` | Overlays: modals, dialogs. |
| `--strand-radius-full` | `9999px` | Circular: avatars, badges. |

**Rules:**
- Never `0px` (sharp corners are cold/corporate).
- Never `16px+` (too playful for Strand's precision aesthetic).

---

## 8. Layout

### 8.1 Breakpoints

| Token | Value | Label |
|---|---|---|
| `--strand-breakpoint-sm` | `640px` | Small (mobile landscape) |
| `--strand-breakpoint-md` | `768px` | Medium (tablet) |
| `--strand-breakpoint-lg` | `1024px` | Large (desktop) |
| `--strand-breakpoint-xl` | `1280px` | Extra-large (wide desktop) |

### 8.2 Container

Max-width: 1280px. Centered. Horizontal padding: `clamp(1.5rem, 5vw, 4rem)`.

### 8.3 Content Width Tiers

| Token | Value | Use |
|---|---|---|
| `--strand-content-narrow` | `640px` | Long text, forms |
| `--strand-content-default` | `768px` | General content |
| `--strand-content-wide` | `1024px` | Features, cards |
| `--strand-content-full` | `1280px` | Full layouts |

Text-heavy content never exceeds ~980px wide, even on wider canvases. The remaining space is breathing room.

---

## 9. Accessibility

WCAG 2.2 AA as a hard constraint. Every decision in this design language satisfies:

- **Color contrast:** 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold).
- **Focus indicators:** 2px solid blue outline with 2px offset on all interactive elements (`:focus-visible`).
- **Reduced motion:** Full `prefers-reduced-motion` support. All animations disable gracefully.
- **Keyboard navigation:** Every interactive element reachable and operable via keyboard.
- **Semantic HTML:** Correct heading hierarchy, ARIA labels where needed, form labels always visible.
- **Touch targets:** Minimum 44x44px on all interactive elements.
- **Screen readers:** All non-text content has text alternatives. ARIA live regions for dynamic content.

---

## 10. Component Interaction Patterns

### 10.1 State Layers

Every interactive element uses consistent state feedback:

| State | Treatment |
|---|---|
| Default | Base appearance. No overlay. |
| Hover | +4% opacity overlay (background lightens or darkens slightly). |
| Focus-visible | 2px blue ring, 2px offset. Background unchanged. |
| Active/Pressed | -1px translateY (subtle press). Faster transition (75ms). |
| Disabled | 40% opacity. Cursor: not-allowed. No hover/focus effects. |
| Loading | Content replaced with spinner or skeleton. Pointer-events disabled. |

### 10.2 Transitions

- Background, border, box-shadow: `150ms ease`
- Transform: `150ms cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)
- Opacity: `75ms ease`

### 10.3 Loading States

- **Skeleton shimmer:** Linear gradient animation, 1.8s ease-in-out infinite cycle. Static gray under reduced motion.
- **Thin-ring spinner:** 2px border, 20x20px, 0.8s linear rotation.
- **Progress bar:** Determinate with monospace percentage label. Indeterminate with shimmer.

### 10.4 Error States

Errors are diagnostic, not failures:
- Use `--strand-red-alert` for error indicators.
- Error messages are specific: "Email format unrecognized" not "Invalid input."
- Error messages are helpful: explain how to fix, not just what failed.
- Never blame the user.

### 10.5 The Lab Surface

The signature Strand background. Three layered CSS gradients that transform flat white into a textured, professional surface:

1. **Dot grid:** Faint radial gradient dots at 24px intervals. Graph paper / cleanroom floor.
2. **Overhead glow:** Subtle blue radial gradient from top center. LED panel lighting.
3. **Vertical gradient:** Gentle shift from surface-primary through white to surface-recessed.

Optional grain texture overlay at 1.2% opacity for additional surface depth.

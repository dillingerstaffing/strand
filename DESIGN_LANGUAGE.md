# Strand Design Language

**Version:** 0.5.0
**Status:** Production Specification

---

## Preamble

This is a design language specification. Not guidelines. Not suggestions. Every value is defined. Every decision has a rationale. Every principle has a test.

The language occupies a specific aesthetic niche: **the biosynthetic laboratory**. Not corporate. Not playful. Not dark-mode tech. A near-future research facility where precision instrumentation meets organic engineering. White polymer surfaces, blue biosynthetic indicators, monospace readouts, engineered grace. The instruments are synthetic and exact. The environment housing them is architect-designed: concrete, glass, warm wood, controlled natural light. The technology is precise; the space it inhabits is beautiful.

**This language is NOT:**
- A dark-mode interface (the environment is light, white-dominant, daylit)
- A clinical or hospital aesthetic (the environment is warm, architected, quietly stunning)
- A playful or consumer aesthetic (no bounce animations, no illustrations, no emojis, no bright saturated palettes)
- A corporate or enterprise aesthetic (no generic components, no admin-panel feel, no brand-as-template)
- An academic or research-paper aesthetic (applied, not theoretical; functional, not presentational)

**The test:** Show the interface to five people. If any describe it as dark, clinical, playful, corporate, or academic, the aesthetic has drifted. Target descriptors: precise, elegant, forward-looking, controlled, alive.

Two properties are optimized simultaneously: **aesthetic quality** (the design must be the best in its class) and **propagation fitness** (the design must spread through adoption, retention, and organic sharing). These properties are not in tension. The highest-quality design languages propagate fastest because quality is the propagation mechanism.

Institutional design systems tell you what to build. Enterprise component libraries give you pieces to assemble. This language tells you **why every decision exists** and engineers those decisions to be remembered, reused, and repeated.

---

## Part I: Thesis

### The Biosynthetic Laboratory

When a user interacts with an interface built on this language, the experience is identical in feeling to walking into a clean, white, advanced research facility. One that performs precise analytical work. The walls are white. The instruments are exact. The lighting is controlled. The outputs are scientific. You trust the results because the environment tells you: *serious systems do serious work here.*

But this is not a sterile, cold, joyless laboratory. This is the laboratory from the near future, where biosynthetic materials glow faintly blue, where the technology feels organic yet obviously engineered, where the precision is beautiful, not intimidating. The aesthetic has permission to be exciting. This is not somber technology requiring clinical trust -- it is optimistic technology suggesting a future people want to inhabit. Interfaces should feel forward-looking, not conservative.

**Two environments coexist.** The instruments are synthetic: polymer, brushed aluminum, frosted glass, precision-machined. The facility housing them is natural: concrete, warm wood grain, glass walls with controlled daylight, engineered negative space. The barely-blue-shifted white (#FAFCFF) is the color of controlled daylight on an engineered surface -- not the color of a plastic panel or a hospital wall. The dot-grid background is precision graph paper on an architect's desk, not a sterile cleanroom floor.

The natural materials are not metaphor. They are the spatial signature, encoded into the system through specific surface and elevation treatments (Part IX, Part VII.1b). Frosted glass is `.strand-glass-surface` (Part 9.5). Warm wood resonance is `--strand-elevation-1-warm` and `.strand-lab-surface--warm` (Part 7.1b, 9.1). Concrete and brushed-metal grain are `.strand-grain-concrete` (Part 9.2). The base palette stays cool and blue-shifted (Part 3.7.3); the natural-material cues come through as additive layers that are felt, not seen. A surface that uses none of them feels cool-clinical. A surface that uses all of them feels like the spatial signature: warm wood under controlled daylight, glass walls, frosted instrument panels embedded in lab benches.

The interface should feel as though it was designed by an intelligence that values beauty intrinsically -- not as decoration, but as a property of well-engineered systems. The precision IS the beauty. The spacing IS the elegance. The restraint IS the luxury. Nothing is added to make it look better. Everything that remains is already beautiful because it is exactly right.

**The environment test:** Describe the interface's materials. If the answer includes only synthetic materials (plastic, steel, LED), the aesthetic is too cold. If it includes natural materials alongside synthetic ones (glass, wood, concrete, controlled light, polymer, frosted surfaces), the environment is correct.

**The energy test:** Does the interface make the user want to explore further, or does it make them feel they should be careful? If careful: too clinical. If drawn forward: correct.

**The design space position:**

```
COLD/CLINICAL ─────────────────────── WARM/HUMAN
                  ● HERE
                      │
CORPORATE ────────────┼──────────────── SCI-FI
                      │
```

Cleaner than neural-interface aesthetics (which are constrained to black/void). Warmer than a hospital. Cooler than literary-humanist branding (which leans literary). More scientifically grounded than any game-studio aesthetic. This language takes consumer-tech restraint, neural-interface seriousness, humanoid-robotics reverence, and the biosynthetic palette of near-future cinema, then raises the bar.

**The unified experience principle:** Whether the user is submitting a form, reviewing a dashboard, browsing analytics, or reading documentation. The experience is the same laboratory. The instruments change. The environment does not. Every future feature inherits this language automatically. A new dashboard is the same lab. An API portal is the same lab. A mobile app is the same lab, smaller room.

### Why a Niche Beats Universality

Institutional design systems aim for universality. Universality produces genericity. Every app built with them looks like the parent corporation. Every app built with enterprise component libraries looks like an admin panel.

This language does not aim for universality. It owns a specific aesthetic niche that no competitor occupies. The biosynthetic laboratory is:

- **Distinctive**. Recognizable within 2 seconds of viewing
- **Uncontested**. No major design system occupies this position
- **Emotionally resonant**. The laboratory metaphor triggers trust, precision, and capability
- **Functionally grounded**. The metaphor maps directly to interface patterns (forms are specimen instruments, dashboards are analytical readouts, notifications are diagnostic events)

A design language that owns a niche propagates more efficiently than one that aims for universality, because niche ownership creates identity. Users don't say "I use a generic design system." They say "I use the biosynthetic system." Identity drives word-of-mouth. Word-of-mouth drives adoption.

---

## Part II: Named Principles

These are the laws of the design language. When in doubt on any design decision, apply these in order. Each principle has a name (for recall), a definition (for understanding), and a test (for enforcement).

### Principle 1: Cognitive Economy

Every visual element earns its place by reducing the cognitive operations required to understand the interface.

A user viewing a screen performs a sequence of cognitive operations: identify element, determine purpose, decide action. Each unnecessary element increases the sequence length. Each well-designed element decreases it. The total count of cognitive operations from "screen loaded" to "task complete" is the **cognitive cost** of that interface.

Decoration increases the cognitive cost. Information decreases it. A decorative border, an ornamental gradient, a stock photograph: each adds a cognitive step ("what is this?") that produces no useful output ("oh, nothing"). That step is waste.

**The test:** Remove an element. If the user can still complete their task with no loss of speed or comprehension, the element was decoration. Delete it. If you are not adding back at least 10% of what you delete, you are not deleting enough.

### Principle 2: Biosynthetic Restraint

The most advanced technology in fiction and reality is always presented with extreme restraint. Clutter signals primitive. Space signals advanced.

Consider the near-future research facility: concrete, glass, wood, whitespace. The most advanced systems housed in rooms that look like modern art galleries. Corporate-future control rooms: clean palettes, precision data on white. Biosynthetic aesthetics: white polymer, single blue accent, diffused lighting.

The fewer elements on screen, the more each one matters. The more whitespace around a headline, the more authority it carries. The more restrained the color palette, the more impactful the single accent color becomes.

**The test (two parts, both must pass):**

1. **Quantity.** Count the distinct visual elements on any screen. If the count exceeds 12, the design has not been restrained enough. Reduce until each remaining element is irreducible.

2. **Hierarchy.** Identify the primary element. Every composition has exactly one. If all elements have equal visual weight (equal size, equal padding, equal spacing), the composition has no focal point. An instrument without a focal point is a parts bin, not an instrument. The primary element must be visually dominant: larger, more space around it, or positioned to draw the eye first. The remaining elements support it.

### Principle 3: Performance Gravity

Performance is not a property of the design. It is the gravitational field the design exists within. Every visual decision either respects the performance budget or is rejected. A 60fps animation is premium. A 30fps animation is cheap. A 1-second load is confidence. A 3-second load is doubt.

There is no visual design that compensates for poor performance. A beautifully designed page that loads in 4 seconds will be perceived as lower quality than a plain page that loads in 400 milliseconds. Speed is the first and last design decision.

The benchmark tools across every category (project management, email, developer platforms, launchers) all became dominant not through features but through speed. 60fps interaction. Sub-100ms response. Sub-50ms startup. Performance IS the product. Performance IS the design.

**The test:** Measure First Contentful Paint, Interaction to Next Paint, and animation framerate. If FCP > 1.2s, or INP > 50ms, or any animation drops below 60fps, the design has failed, regardless of how beautiful it looks in a screenshot.

| Metric | Industry "Good" | Strand Target |
|---|---|---|
| TTFB | < 800ms | < 200ms |
| FCP | < 1.8s | < 1.2s |
| LCP | < 2.5s | < 1.5s |
| DOMContentLoaded | N/A | < 1s |
| INP | < 200ms | < 50ms |
| CLS | < 0.1 | < 0.05 |
| TBT | < 200ms | < 150ms |
| Total page weight (first-party) | N/A | < 200KB |

### Principle 4: The Blue Discipline

One accent color. Used with discipline. Blue means: interactive, alive, processing, important.

If an element is not clickable, not data, and not a status indicator, it does not get blue. Blue is **earned**, not decorative. The difference between a precision instrument (blue means something) and a decorated page (blue means emphasis) is discipline.

Non-interactive annotation text uses gray. Section labels use gray. Decorative elements (if they survive Principle 1) use gray. Only elements that the user can act upon, or that represent live data, earn blue.

This constraint is what makes the single accent color powerful. In a sea of white and gray, blue becomes a signal that the eye learns to trust. When everything is blue, nothing is.

**The test:** Audit every blue element on screen. For each, answer: "Is this clickable, or live data, or a status indicator?" If the answer is no, change it to gray. If more than 5% of blue elements fail this test, the Blue Discipline has been violated.

### Principle 5: Earned Elevation

Shadow is information, not decoration. A component earns shadow by existing on a higher z-layer. By floating above the surface in the visual stack.

Shadow communicates three things:
1. **Stacking context**. This element is above that element
2. **Interactive potential**. Elevated elements are often interactive (cards, buttons, dropdowns)
3. **Transience**. Highly elevated elements (modals, toasts) are temporary visitors

A flat element that is part of the page surface does not get shadow. A card that represents a discrete, manipulable object earns subtle shadow. A modal that demands attention earns strong shadow. The shadow scale is a 5-level system where each level has a specific semantic meaning.

**The test:** For every element with box-shadow, answer: "What z-layer is this on, and what does the elevation communicate?" If the answer is "it just looks nicer," remove the shadow.

### Principle 6: Compound Silence

Negative space is not emptiness. It is the medium through which elements communicate their relationships.

Things closer together belong together (Gestalt proximity). Things farther apart are separate. The space between cards must exceed the space within cards. The space between sections must exceed the space between cards. This hierarchy compounds: each level of spacing amplifies the structural clarity of every other level.

**The test (the 30% Test):** Remove 30% of the whitespace from any layout. If nothing feels cramped, the original whitespace was too generous: it was decorative, not structural. If the layout breaks or elements blur together, the original whitespace was correct, the minimum that still felt generous.

| Within-card padding | Minimum card-to-card gap |
|---|---|
| sm (16px) | 24px |
| md (24px) | 32px |
| lg (40px) | 48px |

### Principle 7: The Grain of Precision

A blank white page is empty. A white surface with a subtle dot-grid pattern, a faint overhead blue glow, and imperceptible film grain is a laboratory.

The difference is invisible in isolation. Place them side by side and it is obvious. The textured surface feels designed, controlled, intentional. The blank surface feels unfinished. Precision lives in details below conscious perception: the barely-blue-shifted background (#FAFCFF, not #FFFFFF), the 0.012 opacity grain overlay, the 0.07 opacity dot grid at 24px intervals. These do not register as individual effects. They register as "this feels right."

**The test:** Open the interface on a large, high-quality display. Does the background feel like a designed surface or a blank canvas? If blank: the grain is missing. If obviously textured: the grain is too strong. The correct intensity is felt, not seen.

### Principle 8: Default Philosophy

Your defaults ARE your design philosophy.

A developer who uses every component at its default settings, with zero customization and without reading documentation, should produce output that embodies the biosynthetic laboratory aesthetic. If defaults produce cramped, generic, or visually flat output, the design language has failed, not the developer.

Every default value is a design decision. Default padding is a design decision. Default font weight is a design decision. Default border radius is a design decision. The sum of all defaults IS the design language in its most common form, because most consumers will not customize.

Institutional design systems' defaults produce output recognizable as the parent corporation's aesthetic. Enterprise component libraries produce output that reads as "admin panel." This language's defaults must produce "this looks like a precision laboratory."

**The test:** Build a form, a card layout, and a data table using only default component settings. Take a screenshot. Show it to someone who has never seen the design language. They should be able to describe the aesthetic in specific terms ("clean," "scientific," "precise," "modern") rather than generic terms ("nice," "fine," "normal").

### Principle 9: Typography Carries the Room

In a restrained design system with one accent color, no illustrations, and no stock photography, typography does 80% of the visual work.

The contrast between a 300-weight 72px headline with tight tracking and a tracked-out monospace overline in uppercase IS the design. The hierarchy of Inter for display and body, JetBrains Mono for labels and data readouts IS the laboratory feel. The weight progression from light (display) through regular (body) to medium (labels) through semibold (data) IS the instrument panel.

If the interface works in grayscale with no images, the typography is correct. If it falls apart without color and imagery, the typography is insufficient and the design is fragile.

**The test (two parts, both must pass):**

1. **Grayscale.** Render the interface in grayscale. Remove all images and illustrations. Does it still feel designed? Does the hierarchy still communicate? If yes, the typography is carrying the room.

2. **Contrast ratio.** Measure the font size of the largest text and the smallest text on the same screen. The ratio must be at least 3:1 (e.g., 39px value vs 11px overline = 3.5:1). If all text is within 2x of the same size, the typography is uniform. Uniform typography is a spreadsheet. Hierarchical typography is an instrument panel. The dramatic contrast between the specimen label (tiny, tracked, uppercase, monospace) and the readout value (large, light, tight) is what makes the design feel engineered, not templated.

### Principle 10: The Instrument Principle

Every interface is an instrument in a laboratory. The metaphor is not decorative. It determines naming, microcopy, interaction patterns, and visual hierarchy.

| Interface | Instrument Metaphor |
|---|---|
| Form | Specimen collection instrument |
| Dashboard | Analytical readout panel |
| Notification | Diagnostic event |
| Search | Query instrument |
| Data table | Tabulated results |
| Progress indicator | Processing status |
| Navigation | Laboratory directory |
| Settings | Instrument calibration |

This metaphor does three things:
1. **Unifies**. Every screen belongs to the same facility, even if the instruments differ
2. **Elevates**. "specimen collection" is more serious than "form," and the visual treatment follows
3. **Constrains**. A laboratory instrument does not have decorative illustrations, playful animations, or casual language

**The test:** Describe the interface using only laboratory vocabulary. If the description feels natural ("the user submits specimen data to the collection instrument, which processes and returns a diagnostic readout"), the metaphor is correctly applied. If it feels forced ("the user browses the fun laboratory store"), the metaphor has been misapplied.

---

## Part III: Color

### 3.1 Philosophy

The color system uses **cool-shifted whites** as the dominant surface, not pure white (#FFFFFF), which feels like a blank page, and not warm cream, which feels literary/humanist. The whites have a barely-perceptible blue tint that says "controlled environment" without saying "hospital."

The accent color is a single, carefully calibrated blue: the blue of biosynthetic indicators, of clean-room LED strips, of DNA visualization software. Not corporate blue (too dark, too safe). Not neon blue (too aggressive, too cyberpunk). The blue of precision instrumentation.

**The Blue Discipline (Principle 4) governs all color usage:** blue is earned by interactive, data, or status elements. Everything else is white, gray, and silence.

### 3.2 Surface Palette

| Token | Value | Purpose |
|---|---|---|
| `--strand-surface-primary` | `#FAFCFF` | Page background. Barely blue. The lab walls. |
| `--strand-surface-elevated` | `#FFFFFF` | Cards, modals. Pure white. Lifted off the wall. |
| `--strand-surface-recessed` | `#F0F5F8` | Secondary sections, form fields. The lab bench. |
| `--strand-surface-subtle` | `#E8EEF3` | Borders, dividers, faint rules. The seams. |

**Usage rule:** The page background is `--strand-surface-primary`. Cards and modals float above it on `--strand-surface-elevated`. Form fields and secondary areas are recessed into `--strand-surface-recessed`. Dividers and borders use `--strand-surface-subtle`. This four-layer system creates z-axis depth without shadow alone.

### 3.3 Blue Biosynthetic Spectrum

| Token | Value | Purpose |
|---|---|---|
| `--strand-blue-glow` | `#E8F5FD` | Hover backgrounds, selected rows, active sections. |
| `--strand-blue-wash` | `#DBECFE` | Light backgrounds for emphasis blocks. |
| `--strand-blue-indicator` | `#93CCFD` | Progress bars, secondary interactive elements. |
| `--strand-blue-primary` | `#3B8EF6` | Primary actions, links, key data points. |
| `--strand-blue-vivid` | `#2570EB` | Hover state on primary elements. |
| `--strand-blue-deep` | `#1D5AD8` | Active/pressed states, high-emphasis data. |
| `--strand-blue-midnight` | `#1E3E5F` | Headlines on light backgrounds. |
| `--strand-blue-abyss` | `#0F192A` | Maximum contrast text, near-black. |

The spectrum runs from near-white (#E8F5FD) to near-black (#0F192A), all blue-shifted. This is a single hue at varying luminance. The visual equivalent of a single instrument indicator at varying intensity levels.

### 3.4 Cool Grays (Blue-Shifted)

| Token | Value | Purpose |
|---|---|---|
| `--strand-gray-50` | `#F7FAFD` | Lightest gray. |
| `--strand-gray-100` | `#F1F6F9` | Subtle backgrounds. |
| `--strand-gray-200` | `#E2E9F0` | Borders, dividers. |
| `--strand-gray-300` | `#CBD6E1` | Disabled states. |
| `--strand-gray-400` | `#94A5B8` | Placeholder text. |
| `--strand-gray-500` | `#64778B` | Secondary text, annotation labels. |
| `--strand-gray-600` | `#475769` | Primary body text. |
| `--strand-gray-700` | `#334355` | Headings. |
| `--strand-gray-800` | `#1E2B3B` | Strong headings. |
| `--strand-gray-900` | `#0F192A` | Maximum contrast. |

Every gray is blue-shifted. Warm grays (yellow/brown undertone) feel corporate or literary. Cool grays feel clinical and controlled. The blue shift is subtle. 2-5%. But the cumulative effect across an entire interface is significant.

**Never use pure black (#000000).** Pure black on white creates harsh optical vibration. `--strand-gray-900` (#0F192A) provides equivalent contrast (17.13:1) with less visual strain.

### 3.5 Semantic Accents

| Token | Value | Purpose |
|---|---|---|
| `--strand-cyan-signal` | `#22D3EE` | Data visualization energy, secondary data. |
| `--strand-teal-vital` | `#14B8A6` | Success, match confirmed, alive. |
| `--strand-green-positive` | `#10B981` | Growth, positive delta. |
| `--strand-violet-data` | `#8B5CF6` | Secondary data category. |
| `--strand-red-alert` | `#EF4444` | Errors, critical, destructive. |
| `--strand-amber-caution` | `#F59E0B` | Warnings, attention needed. |

Semantic colors appear **only** in data and status contexts. Never as brand expression, never as decorative emphasis.

### 3.6 On-Colors (Contrast-Safe Pairings)

Every background color has a designated text color that guarantees WCAG 2.2 AA contrast compliance (4.5:1 for normal text, 3:1 for large text).

| Background Token | On-Color Token | Value | Contrast Ratio |
|---|---|---|---|
| `--strand-surface-primary` | `--strand-on-surface-primary` | `#475769` (gray-600) | 7.21:1 |
| `--strand-surface-elevated` | `--strand-on-surface-elevated` | `#475769` (gray-600) | 7.41:1 |
| `--strand-surface-recessed` | `--strand-on-surface-recessed` | `#475769` (gray-600) | 6.74:1 |
| `--strand-blue-primary` | `--strand-on-blue-primary` | `#FFFFFF` | 3.68:1 (large text/interactive) |
| `--strand-blue-vivid` | `--strand-on-blue-vivid` | `#FFFFFF` | 5.45:1 |
| `--strand-blue-deep` | `--strand-on-blue-deep` | `#FFFFFF` | 6.74:1 |
| `--strand-red-alert` | `--strand-on-red-alert` | `#FFFFFF` | 3.76:1 (large text/interactive) |
| `--strand-teal-vital` | `--strand-on-teal-vital` | `#0F192A` (gray-900) | 7.07:1 |
| `--strand-amber-caution` | `--strand-on-amber-caution` | `#0F192A` (gray-900) | 8.20:1 |

**Rule:** When placing text on any colored background, use the corresponding `--strand-on-*` token. Never guess. Never manually check contrast. The token system handles it.

### 3.7 Usage Rules

1. **70% surface whites, 25% cool grays, 5% blue accent.** This ratio IS the laboratory. Deviation from this ratio is deviation from the aesthetic.
2. **Blue is earned.** Interactive elements, live data, and status indicators. Nothing else.
3. **Never warm colors in the base palette.** Warm signals organic, cozy, imprecise. This language is cool, controlled, precise.
4. **Semantic colors appear only in data/status contexts.** Never as brand expression.
5. **Dark text is `--strand-gray-600` for body, `--strand-gray-700` or `--strand-blue-midnight` for headlines.** Never pure black.
6. **Every color pairing has a minimum 4.5:1 contrast ratio.** Enforced by automated test, not by manual review.

### 3.8 Color Roles (Semantic Layer)

Beyond the raw palette, colors have functional roles. This is where the system goes deeper than generic primary/secondary/tertiary categories. Roles are specific to the biosynthetic context.

| Role | Token | When Applied |
|---|---|---|
| Primary action | `--strand-blue-primary` | Buttons, links, CTAs that advance the user's task |
| Primary action hover | `--strand-blue-vivid` | Hover state on primary actions |
| Primary action active | `--strand-blue-deep` | Pressed/active state on primary actions |
| Data highlight | `--strand-blue-glow` | Selected rows, active filters, current items |
| Headline | `--strand-blue-midnight` | Page-level and section-level headings |
| Body text | `--strand-gray-600` | Paragraph text, descriptions |
| Secondary text | `--strand-gray-500` | Captions, timestamps, helper text |
| Placeholder | `--strand-gray-400` | Input placeholders, empty states |
| Disabled | `--strand-gray-300` | Disabled controls, inactive elements |
| Border | `--strand-gray-200` | Default borders, dividers, rules |
| Success | `--strand-teal-vital` | Confirmed, completed, positive outcome |
| Error | `--strand-red-alert` | Failed, invalid, destructive |
| Warning | `--strand-amber-caution` | Attention needed, non-critical issue |
| Info | `--strand-blue-indicator` | Informational, neutral status |

---

## Part IV: Typography

### 4.1 Font Stack

**Primary (UI / Headlines):** Inter
- Geometric, engineered for screens, open-source, variable-weight, optimized for every size
- Fallback: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`

**Monospace (Data / Labels / Code):** JetBrains Mono
- Purpose-built for code and data display, excellent legibility at small sizes, ligatures for technical notation
- The "laboratory instrument readout" font
- Fallback: `'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace`

**Why these and not custom fonts:** Performance (custom fonts add 50-200KB of blocking requests), cost (both are free and CDN-hosted), and quality (both are better-engineered than most paid alternatives). Performance Gravity (Principle 3) rejects custom fonts that don't clear this bar.

### 4.2 Type Scale (Major Third Ratio: 1.250)

| Token | Size | Pixel Equivalent | Use |
|---|---|---|---|
| `--strand-text-xs` | `0.694rem` | 11.1px | Monospace labels, fine metadata |
| `--strand-text-sm` | `0.833rem` | 13.3px | Captions, timestamps, field labels |
| `--strand-text-base` | `1rem` | 16px | Body text, the anchor |
| `--strand-text-lg` | `1.25rem` | 20px | Lead paragraphs, card titles |
| `--strand-text-xl` | `1.563rem` | 25px | H4, subheadings |
| `--strand-text-2xl` | `1.953rem` | 31.3px | H3 |
| `--strand-text-3xl` | `2.441rem` | 39px | H2 |
| `--strand-text-4xl` | `3.052rem` | 48.8px | H1 |
| `--strand-text-5xl` | `3.815rem` | 61px | Hero headline |
| `--strand-text-6xl` | `4.768rem` | 76.3px | Display, single statement |
| `--strand-text-7xl` | `5.96rem` | 95.4px | Ultra-display, one word |

The Major Third (1.250) produces a tighter ratio than the default Major Second (1.125) used by most systems. The result: more distinct size differentiation between levels, which creates clearer hierarchy without relying on weight or color.

**Responsive hero (fluid scaling):**
```css
.hero-headline {
  font-size: clamp(2.5rem, 5vw + 1rem, 5.5rem);
}
```

### 4.3 Tracking Hierarchy

**The rule: large text tighter, small text looser.** Default tracking on large text looks amateur. This single adjustment is the highest-impact "premium" signal.

| Token | Value | Use |
|---|---|---|
| `--strand-tracking-tightest` | `-0.05em` | Display 60px+ |
| `--strand-tracking-tighter` | `-0.03em` | Large headlines 40-60px |
| `--strand-tracking-tight` | `-0.02em` | H1-H2, 30-48px |
| `--strand-tracking-normal` | `0` | Body, 16-20px |
| `--strand-tracking-wide` | `0.02em` | Monospace data |
| `--strand-tracking-wider` | `0.05em` | Small labels |
| `--strand-tracking-widest` | `0.08em` | All-caps overlines |
| `--strand-tracking-ultra` | `0.12em` | Spaced-out scientific micro-labels |

**Adopted pattern:**
- Hero headlines: -0.015em to -0.03em
- Navigation: 0
- Eyebrow / overline: 0.07em + uppercase + 12px font size

### 4.4 Line Height

| Token | Value | Use |
|---|---|---|
| `--strand-leading-none` | `1.0` | Display text, single-line heroes |
| `--strand-leading-tight` | `1.15` | Large headlines 40px+ |
| `--strand-leading-snug` | `1.25` | Medium headlines 24-40px |
| `--strand-leading-normal` | `1.5` | Body text |
| `--strand-leading-relaxed` | `1.625` | Long-form, narrow columns |
| `--strand-leading-loose` | `1.75` | Very small text, captions |

**As font size increases, line-height ratio decreases.** A 72px headline at 1.5 has a canyon between lines. A 14px paragraph at 1.15 suffocates. The scale inverts proportionally.

### 4.5 Weight Hierarchy (The "Premium Tech" Pattern)

| Role | Weight | Tracking | Line Height |
|---|---|---|---|
| Display headlines | 300 (Light) | tighter (-0.03em) | tight (1.15) |
| Subheadings | 500 (Medium) | tight (-0.02em) | snug (1.25) |
| Body text | 400 (Regular) | normal (0) | normal (1.5) |
| Overlines / Labels | 500 (Medium) + uppercase + monospace | widest (0.08em) | - |
| Data values | 600 (SemiBold) + monospace | wide (0.02em) | - |

**Why light-weight headlines:** At large sizes (48px+), thin strokes become visible and elegant. The contrast between 300-weight 72px heading and 400-weight 16px body creates hierarchy through weight differential, not just size. Bold headlines at large sizes feel heavy and amateur.

### 4.6 Paragraph Width

**60-75 characters per line. Non-negotiable.**

```css
.prose { max-width: 65ch; }
```

Lines wider than 75ch cause the eye to lose track of the next line start. Lines shorter than 55ch create too many line breaks, disrupting reading flow.

### 4.7 Named Text Patterns

Five text patterns appear throughout the design language:

**Overline (specimen label).** Monospace, text-xs, medium weight, ultra tracking, uppercase, gray-500. Used for section labels, data annotations, form field labels, and category headers. The most distinctive typographic element in the language. It says "this has been classified."

**Headline (display).** Monospace, light weight (300), tracked, uppercase, blue-midnight. Two sizes: xl (hero, fluid 2.5rem-5rem with 0.35em tracking) and lg (section, fluid 1.5rem-2.5rem with tighter tracking).

**Lead (intro).** Sans-serif, text-lg, gray-500, max-width 50ch, relaxed line-height. Follows headlines. Explains the purpose in one or two sentences.

**Title (human voice).** Sans-serif (Inter), light weight (300), tight tracking, blue-midnight. Fluid size: clamp(1.5rem, 3vw + 0.5rem, 2.5rem). Used for marketing copy, CTAs, and any display text that speaks as a human, not as an instrument. The distinction from Headline: Headline is monospace uppercase (the system speaking). Title is sans-serif sentence case (a human speaking with authority). Both carry the room through weight contrast, but Title is warm where Headline is clinical.

**Secondary (caption/description).** Sans-serif, text-sm, gray-500, relaxed line-height. Used for feature descriptions, helper text, annotations, and any supporting content that accompanies a primary element. An xs variant exists for fine print and metadata.

---

## Part V: Spacing

### 5.1 Base Unit: 4px

Every spacing value is a multiple of 4px (0.25rem). This creates mathematical rhythm that the eye perceives as "designed" rather than "random." The human visual system detects mathematical regularity unconsciously. The layout feels "right" without the viewer knowing why.

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

### 5.2 Component Padding Tiers

Components use three padding tiers. The **default tier (md) must produce premium output without customization** (Principle 8: Default Philosophy).

| Tier | Token | Value | When to Use |
|---|---|---|---|
| `sm` | `--strand-space-4` | 16px | Compact contexts: dashboard widgets, dense data, badge clusters |
| `md` | `--strand-space-6` | 24px | Standard: cards, forms, alerts, toasts. **The default.** |
| `lg` | `--strand-space-10` | 40px | Generous: showcase, hero cards, documentation, landing pages |

**Validation (30% Test):** Remove 30% of the padding (24px becomes ~17px). If the result feels cramped, 24px is correct. If it still feels fine, 24px was too generous. Applied to every tier during development.

### 5.3 Spacing Hierarchy (Gestalt Proximity)

The gap between sibling elements must exceed the padding within each element. Things closer together feel grouped; things further apart feel separate. If this hierarchy collapses, visual structure collapses.

| Within-element padding | Minimum sibling gap |
|---|---|
| sm (16px) | `--strand-space-6` (24px) |
| md (24px) | `--strand-space-8` (32px) |
| lg (40px) | `--strand-space-12` (48px) |

**The rule:** `gap > padding`, always. This is Gestalt proximity operationalized as a hard constraint, not a guideline.

### 5.4 Section Rhythm

| Context | Value |
|---|---|
| Standard section padding | `clamp(4rem, 8vw, 8rem)` |
| Hero section padding | `clamp(6rem, 12vw, 12rem)` |
| Section header margin-bottom | `clamp(2rem, 4vw, 4rem)` |
| Overline to heading | `0.75rem` (space-3) |
| Heading to description | `1rem` (space-4) |

### 5.5 Grid

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
}

/* Content width tiers */
.content-narrow   { max-width: 640px;  }   /* Long text, forms */
.content-default  { max-width: 768px;  }   /* General content */
.content-wide     { max-width: 1024px; }   /* Features, card layouts */
.content-full     { max-width: 1280px; }   /* Full layouts */
```

Text-heavy content never exceeds the Default tier (768px), even on wide screens. The remaining space is structural whitespace that communicates restraint (Principle 2: Biosynthetic Restraint).

**Responsive auto-fit grids.** For card layouts that adapt to viewport width, use `auto-fit` with minimum child widths:

| Variant | Minimum child width | Use case |
|---|---|---|
| auto-sm | 200px | Compact cards, metric readouts, badge grids |
| auto-md | 280px | Standard cards, feature showcases |
| auto-lg | 360px | Wide cards, documentation panels |

Columns adjust automatically. No breakpoint-specific overrides needed.

### 5.6 Premium Whitespace vs. Empty Whitespace

Premium whitespace is:
- **Consistent**. Based on the 4px mathematical system
- **Proportional**. Larger elements get proportionally more space
- **Directional**. More space above a heading than below (it belongs to what follows)
- **Purposeful**. Every gap groups or separates (Gestalt proximity)

Empty whitespace is random, inconsistent, and directionless. The test: if you can remove 30% and nothing feels cramped, it was empty, not premium.

---

## Part VI: Motion

Motion in this language is not decoration. It is the primary quality signal. The difference between a 150ms exponential-ease hover transition and a 300ms linear one is the difference between a precision instrument and a cheap toy. Users cannot articulate why one feels premium and the other feels generic -- but they feel it instantly. The benchmark tools that dominated their categories did so not through features but through the feel of every interaction at 60fps. Every micro-interaction in this language must run at 60fps with the specified easing, or the interface reads as lower quality than a static page. Performance does not enable aesthetic ambition -- performance IS the aesthetic.

**The framerate test:** Play any interaction at 30fps. If it still feels acceptable, the interaction is not doing enough visual work. If it feels broken or cheap, the interaction is correctly tuned -- its quality depends on framerate fidelity.

### 6.1 Easing Functions

| Token | Value | Use |
|---|---|---|
| `--strand-ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Enter/open: snappy arrival |
| `--strand-ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | General smooth transitions |
| `--strand-ease-in-out-sine` | `cubic-bezier(0.37, 0, 0.63, 1)` | Gentle, scientific, continuous |
| `--strand-ease-in-expo` | `cubic-bezier(0.7, 0, 0.84, 0)` | Exit/close: accelerating departure |

**No bounce. No elastic. No spring physics.** Bounce signals playfulness. Springs signal physics simulation. This language signals precision. Exponential and sinusoidal easings feel engineered and deliberate. Like the motion of laboratory automation.

### 6.2 Duration Scale

| Token | Value | Use |
|---|---|---|
| `--strand-duration-instant` | `75ms` | Opacity, color changes. Imperceptible |
| `--strand-duration-fast` | `150ms` | Button states, toggles. Tactile |
| `--strand-duration-normal` | `250ms` | Cards, dropdowns. Smooth |
| `--strand-duration-slow` | `400ms` | Page transitions, large reveals. Deliberate |
| `--strand-duration-glacial` | `700ms` | Hero animations, entrance sequences. Cinematic |

**Psychology of timing:**
- < 100ms: perceived as instant
- 100-300ms: perceived as responsive
- 300-1000ms: perceived as animated
- > 1000ms: perceived as slow (user loses attention)

All interactive state transitions (hover, focus, pressed) use fast (150ms). Content reveals use normal to slow. Only hero/entrance animations may use glacial, and only once per page load.

### 6.3 Animation Principles

What signals "precision" in motion:
- **Small translate distances (16-32px).** Large movements (50-100px) feel dramatic and consumer-grade. Small movements feel controlled and scientific.
- **No bounce or elastic easing.** Playful, not precise.
- **Short stagger intervals (60-100ms).** Sequential reveal, not simultaneous.
- **Opacity always animates.** Elements fade in, never pop.
- **Transform-only properties.** `transform` and `opacity` are GPU-composited. Animating `width`, `height`, `margin`, or `padding` causes layout recalculation and kills framerate. Non-negotiable.

### 6.4 The Scientific Reveal (Scroll-Triggered)

```css
@keyframes revealUp {
  from {
    opacity: 0;
    transform: translateY(24px);  /* 24px. NOT 50-100px. Subtle. */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal {
  animation: revealUp 0.6s var(--strand-ease-out-expo) both;
}

/* Sequential stagger: "processing" feel */
.reveal-group > *:nth-child(1) { animation-delay: 0ms; }
.reveal-group > *:nth-child(2) { animation-delay: 80ms; }
.reveal-group > *:nth-child(3) { animation-delay: 160ms; }
.reveal-group > *:nth-child(4) { animation-delay: 240ms; }
```

**Trigger once.** Elements animate when they enter the viewport for the first time (`IntersectionObserver`, `{ threshold: 0.1, rootMargin: '0px 0px -10% 0px' }`). They do NOT re-animate on exit and re-entry. Re-animation is gimmicky. Once is scientific.

### 6.5 Interactive State Transitions

```css
/* Button */
.btn-primary {
  background: var(--strand-blue-primary);
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  transition:
    background var(--strand-duration-fast) ease,
    transform var(--strand-duration-fast) var(--strand-ease-out-expo),
    box-shadow var(--strand-duration-fast) ease;
}

.btn-primary:hover {
  background: var(--strand-blue-vivid);
  transform: translateY(-1px);    /* 1px lift. Not 4px. Subtle. */
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-primary:active {
  transform: translateY(0);       /* Press back down */
  box-shadow: 0 1px 4px rgba(37, 99, 235, 0.15);
  transition-duration: 75ms;      /* Instant tactile response */
}

/* Focus ring */
:focus-visible {
  outline: 2px solid var(--strand-blue-primary);
  outline-offset: 2px;
}

/* Link. Underline grows from left */
.link {
  text-decoration: none;
  color: var(--strand-blue-primary);
  background-image: linear-gradient(var(--strand-blue-primary), var(--strand-blue-primary));
  background-size: 0% 1px;
  background-position: left bottom;
  background-repeat: no-repeat;
  transition: background-size 250ms var(--strand-ease-out-expo);
}
.link:hover { background-size: 100% 1px; }

/* Card. Lift with shadow evolution */
.card {
  transition:
    transform 250ms var(--strand-ease-out-expo),
    box-shadow 250ms ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(15,23,42,0.04), 0 12px 24px rgba(15,23,42,0.06);
}
```

### 6.6 Loading States

```css
/* Skeleton shimmer */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg,
    var(--strand-gray-100) 25%, var(--strand-gray-50) 50%, var(--strand-gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.8s ease-in-out infinite;
  border-radius: 4px;
}

/* Thin ring spinner */
.spinner {
  width: 20px; height: 20px;
  border: 2px solid var(--strand-gray-200);
  border-top-color: var(--strand-blue-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

**Scientific loading concepts:**
- Progress bar + monospace counter: `PROCESSING... 47%`
- Stepped: `Step 2 of 4: Validating credentials`
- Terminal-style log: monospace lines appearing sequentially

### 6.7 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Non-negotiable. This is not a feature. It is a physical accessibility requirement. Every animation in the system degrades gracefully to instant state change when this media query is active.

### 6.8 Motion Anti-Patterns (Never Do These)

- Re-animating elements on every viewport entry/exit
- Horizontal scroll hijacking
- Scroll-jacking (overriding native scroll behavior)
- Animations > 0.6s that block content reading
- More than 3-4 elements animating simultaneously
- Parallax on text
- Bounce or elastic easing
- Animating layout properties (width, height, margin, padding)

---

## Part VII: Elevation

### 7.1 Shadow Scale (Default Cool)

Five levels, each with a specific semantic meaning. The default scale uses blue-shifted rgba to maintain the cool-toned aesthetic. Use these on dashboard, readout, and data contexts where the laboratory should feel clinical and controlled.

| Token | Box-Shadow | Use |
|---|---|---|
| `--strand-elevation-0` | `none` | Flat, no lift. |
| `--strand-elevation-1` | `0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.02)` | Cards at rest. |
| `--strand-elevation-2` | `0 4px 6px rgba(15, 23, 42, 0.04), 0 12px 24px rgba(15, 23, 42, 0.06)` | Cards on hover, dropdowns. |
| `--strand-elevation-3` | `0 8px 16px rgba(15, 23, 42, 0.06), 0 24px 48px rgba(15, 23, 42, 0.08)` | Modals, popovers. |
| `--strand-elevation-4` | `0 16px 32px rgba(15, 23, 42, 0.08), 0 32px 64px rgba(15, 23, 42, 0.12)` | Dialogs, toasts. |

### 7.1b Warm Shadow Variants (Showcase / Hero / Wood-Floor Contexts)

Showcase contexts (hero cards, feature cards on landing pages, intent gallery cards) use additive warm shadow variants. These layer a very subtle warm tint (`rgba(74, 62, 47, 0.025)` -- the color of warm wood shadow) **alongside** the existing cool shadow layers, never replacing them. The cool layers preserve the controlled-laboratory feel; the warm layer encodes the spatial signature from Part I (warm wood, controlled daylight, glass walls).

| Token | Box-Shadow | Use |
|---|---|---|
| `--strand-elevation-1-warm` | `0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.02), 0 2px 8px rgba(74, 62, 47, 0.025)` | Showcase cards at rest. |
| `--strand-elevation-2-warm` | `0 4px 6px rgba(15, 23, 42, 0.04), 0 12px 24px rgba(15, 23, 42, 0.06), 0 6px 16px rgba(74, 62, 47, 0.025)` | Showcase cards on hover. |
| `--strand-elevation-3-warm` | `0 8px 16px rgba(15, 23, 42, 0.06), 0 24px 48px rgba(15, 23, 42, 0.08), 0 12px 32px rgba(74, 62, 47, 0.025)` | Hero modals. |

**Constraint:** the warm layer alpha is capped at 0.03. Above that, the warm layer becomes visible as warmth and breaks the cool-controlled aesthetic. The 0.025 value is calibrated to be felt, not seen, in the same spirit as the 0.012 grain.

**Where to use warm vs cool shadows:**

| Context | Variant |
|---|---|
| Dashboard cards, readout panels, data viewports | Default cool (`--strand-elevation-1`) |
| Hero cards on landing pages | Warm (`--strand-elevation-1-warm`) |
| Feature showcase cards (gallery archetype, Part XVIII.3) | Warm |
| Intent / process step cards on marketing surfaces | Warm |
| Form fields, alerts, toasts | Default cool |
| Modal dialogs | Cool by default, warm if the modal is on a hero/landing context |
| Mobile (battery-conscious) | Default cool always (the warm layer is an extra paint that costs nothing on desktop and a hair on mobile; default to cool) |

The warm shadow is the elevation system's encoding of "warm wood under controlled daylight." Combined with the warm lab surface variant (Part 9.1), the warm grain variant (Part 9.2), and the frosted glass surfaces (Part 9.5), it produces the full natural-material spatial signature without crossing into warm color in the base palette.

### 7.2 Container Elevation Contexts

| Context | Level | Rationale |
|---|---|---|
| Card at rest | 1 | Lifted off page. "Glass instrument panel." Border: `--strand-border-subtle` (1px, barely visible). |
| Card on hover | 2 | Responds to attention. Signals interactivity. |
| Dropdown menu | 2 | Floats above content. Temporary. |
| Preview/showcase container | 0 (recessed) | Sits below card surface. Instrument viewport is recessed. |
| Modal/dialog | 3 | Floats above everything. Demands focus. |
| Toast notification | 2 | Edge-of-viewport. Temporary. |
| Critical dialog | 4 | Maximum elevation for maximum urgency. |

### 7.3 The Recessed Viewport

Preview areas and instrument viewports use a recessed treatment instead of elevation:

```css
.viewport {
  background: var(--strand-surface-recessed);
  box-shadow: inset 0 1px 3px rgba(15, 23, 42, 0.06);
  border-radius: var(--strand-radius-lg);
  padding: var(--strand-space-6);
}
```

This creates the dual-surface feel: the white card frame surrounds a recessed viewport where the instrument lives. The lab bench holds the instrument. The instrument is embedded, not floating.

---

## Part VIII: Shape

### 8.1 Border Radius System

| Token | Value | Use |
|---|---|---|
| `--strand-radius-sm` | `4px` | Small elements: badges, tags. |
| `--strand-radius-md` | `6px` | Interactive elements: buttons, inputs. |
| `--strand-radius-lg` | `8px` | Containers: cards. |
| `--strand-radius-xl` | `12px` | Overlays: modals, dialogs. |
| `--strand-radius-full` | `9999px` | Circular: avatars, pills. |

### 8.2 Shape as Personality

**Never 0px**. Sharp corners are cold, corporate, hostile. They belong to previous-era enterprise software.

**Never 16px+**. Overly rounded corners are playful, bubbly, casual. They belong to consumer social apps.

The 4-12px range is the biosynthetic sweet spot: engineered, not organic. Controlled, not rigid. The corners say "this was designed" without saying "this is a toy."

---

## Part IX: Surfaces and Backgrounds

The laboratory's spatial signature is the duality of natural materials (concrete, warm wood, glass walls, controlled daylight) housing synthetic instruments (polymer, brushed aluminum, frosted surfaces). The surface system encodes this duality. The base palette stays cool and blue-shifted (Part III.7 rule 3 is non-negotiable). The material cues come through via additive layers that are felt, not seen: subtle warm shadow tints on showcase elevations, frosted-glass effects on the nav and over-content surfaces, optional grain variants that echo concrete or wood texture without crossing into warm color.

### 9.1 The Lab Surface

The default lab surface is the body background. It is also exposed as the `.strand-lab-surface` utility class so any element can become a lab surface (nested cards-as-stages, hero containers, etc.).

```css
.strand-lab-surface {
  background:
    /* Layer 1: Faint dot grid. Graph paper / cleanroom floor */
    radial-gradient(circle,
      rgba(148, 163, 184, 0.07) 1px,
      transparent 1px),
    /* Layer 2: Overhead LED glow. Subtle blue from above */
    radial-gradient(ellipse 80% 50% at 50% 0%,
      rgba(59, 130, 246, 0.03) 0%,
      transparent 100%),
    /* Layer 3: Vertical gradient. Lab walls */
    linear-gradient(180deg,
      var(--strand-surface-primary) 0%,
      var(--strand-surface-elevated) 40%,
      var(--strand-surface-recessed) 100%);
  background-size: 24px 24px, 100% 100%, 100% 100%;
  background-color: var(--strand-surface-primary);
}
```

This three-layer background transforms flat white into a laboratory surface (Principle 7: The Grain of Precision). Each layer is imperceptible in isolation. Together they create "this feels designed."

**Warm variant (`.strand-lab-surface--warm`):** for showcase contexts (hero sections, landing pages, gallery views) the warm variant adds a fourth layer: a very subtle warm radial at the bottom edge that echoes "warm wood underfoot, controlled daylight overhead." The added layer carries `rgba(74, 62, 47, 0.015)` -- below the perceptual threshold individually, present in aggregate.

```css
.strand-lab-surface--warm {
  background:
    /* Layer 1: Dot grid */
    radial-gradient(circle,
      rgba(148, 163, 184, 0.07) 1px,
      transparent 1px),
    /* Layer 2: Overhead LED glow */
    radial-gradient(ellipse 80% 50% at 50% 0%,
      rgba(59, 130, 246, 0.03) 0%,
      transparent 100%),
    /* Layer 3 (NEW): Warm wood/floor resonance from below */
    radial-gradient(ellipse 80% 40% at 50% 100%,
      rgba(74, 62, 47, 0.015) 0%,
      transparent 100%),
    /* Layer 4: Vertical gradient */
    linear-gradient(180deg,
      var(--strand-surface-primary) 0%,
      var(--strand-surface-elevated) 40%,
      var(--strand-surface-recessed) 100%);
  background-size: 24px 24px, 100% 100%, 100% 100%, 100% 100%;
  background-color: var(--strand-surface-primary);
}
```

The warm variant is opt-in. The default surface stays cool. The warm radial alpha is capped at 0.02. Above that, the surface starts reading as "warm/literary" and the cool-controlled aesthetic breaks. Test: with the warm variant applied, the page must still pass the Part I energy test ("forward-looking, not careful") and the Part 3.7.3 base palette rule (no warm colors as palette colors -- the warm radial is texture, not palette).

### 9.2 Film Grain Overlay

The default grain is uniform fractal noise at 0.012 opacity. Two opt-in variants exist for surfaces that benefit from a different material character: concrete (slightly coarser texture, evokes brushed aluminum / poured concrete) and wood (directional texture, evokes brushed wood grain under daylight).

```css
/* Default: uniform fractal noise (current behavior) */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.012;
  pointer-events: none;
  z-index: 9999;
  background-image: url("data:image/svg+xml,...feTurbulence baseFrequency='0.9'...");
}

/* Concrete variant: coarser texture, brushed-aluminum / poured-concrete feel */
.strand-grain-concrete::after {
  background-image: url("data:image/svg+xml,...feTurbulence baseFrequency='0.65'...");
  opacity: 0.012;
}

/* Wood variant: directional texture, brushed wood grain feel */
.strand-grain-wood::after {
  background-image: url("data:image/svg+xml,...feTurbulence baseFrequency='0.9 0.3'...");
  opacity: 0.010;
}
```

**Opacity rules:**
- Default: 0.012 (felt, not seen on high-density displays)
- Concrete: 0.012 (same opacity, different baseFrequency)
- Wood: 0.010 (slightly lower because directional turbulence is more visible)

All variants must pass the Part 7 test: the texture is invisible in isolation, present in aggregate. Higher opacity is "dirty screen." Lower opacity is no effect.

### 9.3 The Instrument Viewport (Dark Mode Island)

Instruments within the laboratory may use dark backgrounds for data-dense contexts (maps, charts, terminal-style displays) while the surrounding lab frame stays white. This is the dual-surface principle: white frame, dark viewport.

```css
.strand-instrument-viewport {
  background: var(--strand-blue-abyss);
  color: var(--strand-gray-100);
  border-radius: var(--strand-radius-lg);
  overflow: hidden;
}

.strand-instrument-viewport .strand-readout-label {
  color: var(--strand-gray-400);
}

.strand-instrument-viewport .strand-readout-value {
  color: var(--strand-on-blue-primary);
}
```

The dark viewport is dark mode contained inside a white frame. It is the only place dark backgrounds appear. Dashboards, maps, terminal output, FUI overlays, real-time data feeds. The frame around it stays the lab surface.

### 9.4 The Frosted Viewport (Light Frosted Glass)

Light data-dense contexts that want the glass-pane character without going dark use the frosted variant. This is the "frosted glass instrument panel embedded in the lab bench" feel.

```css
.strand-viewport--frosted {
  background: var(--strand-glass-bg);
  backdrop-filter: blur(var(--strand-glass-blur));
  -webkit-backdrop-filter: blur(var(--strand-glass-blur));
  border: 1px solid var(--strand-glass-border);
  border-radius: var(--strand-radius-lg);
  box-shadow: var(--strand-shadow-inset);
}
```

The frosted viewport is the most direct visual encoding of "glass walls with controlled daylight" from Part I. It belongs above content (where the blur reveals the page surface beneath) and inside content sections (where it groups data without going dark).

### 9.5 Glass Surfaces

The frosted-glass treatment is also exposed as a general utility (`.strand-glass-surface`) for any element that wants the glass character. The nav uses it. Modal headers may use it. Sticky toolbars may use it. The DL constraint: glass surfaces must be applied **above** content (not as a base layer), because backdrop-filter only renders meaningfully when there is something behind it.

```css
.strand-glass-surface {
  background: var(--strand-glass-bg);
  backdrop-filter: blur(var(--strand-glass-blur));
  -webkit-backdrop-filter: blur(var(--strand-glass-blur));
  border: 1px solid var(--strand-glass-border);
}
```

| Token | Value | Purpose |
|---|---|---|
| `--strand-glass-bg` | `rgba(250, 252, 254, 0.72)` | Translucent surface-primary at 0.72 alpha (frosted glass body) |
| `--strand-glass-border` | `rgba(148, 163, 184, 0.12)` | Hairline border that defines the glass edge |
| `--strand-glass-blur` | `12px` | Backdrop blur amount. Higher = more frosted, less legible. 12px is the calibrated value. |

Glass surfaces are the encoded "glass walls" from the spatial signature in Part I. They are not decoration. They communicate "this surface is above the page content; you can see through it but not clearly."

### 9.6 Decision Framework

| Context | Surface Treatment |
|---|---|
| Body / page background | `body` default lab surface (9.1) + grain (9.2) |
| Hero / landing showcase | `.strand-lab-surface--warm` |
| Card-as-stage / nested showcase | `.strand-lab-surface` utility on the container |
| Dashboard / repeat-visit data | Clean white, no animation (speed matters) |
| Data-dense dark viewport | `.strand-instrument-viewport` (9.3) |
| Data-dense light viewport | `.strand-viewport--frosted` (9.4) |
| Sticky nav, sticky toolbar, modal header | `.strand-glass-surface` (9.5) |
| Mobile | Static lab surface (no grain. Battery) |
| `prefers-reduced-motion` | Static, always |
| Surface that wants brushed-aluminum/concrete character | `.strand-grain-concrete` modifier on body |
| Surface that wants brushed-wood character | `.strand-grain-wood` modifier on body |

### 9.7 Material Language Test

The collected surface treatments must produce a felt experience that matches the Part I materials list: concrete, warm wood, glass walls, polymer, brushed aluminum, frosted surfaces, controlled daylight. The test:

1. Open any page with the default lab surface. Describe the materials. The answer should include "frosted glass" (nav), "controlled daylight" (overhead glow), "graph paper / cleanroom floor" (dot grid).
2. Open a hero with `.strand-lab-surface--warm`. The answer should add "warm wood underfoot."
3. Open a dashboard with frosted viewports. The answer should add "frosted instrument panels."
4. Open any FUI surface with `.strand-instrument-viewport`. The answer should include "dark instrument cabinet inside the white lab."

If a tester describes the materials as only "white background, blue accents," the boost has not been applied. If a tester describes them as "warm and cozy" or "literary" or "dark theme," the boost has been over-applied.

---

## Part X: Layout

### 10.1 Responsive Breakpoints

| Token | Value | Label |
|---|---|---|
| `--strand-breakpoint-sm` | `640px` | Small (mobile landscape) |
| `--strand-breakpoint-md` | `768px` | Medium (tablet) |
| `--strand-breakpoint-lg` | `1024px` | Large (desktop) |
| `--strand-breakpoint-xl` | `1280px` | Extra-large (wide desktop) |

**Mobile-first.** Base styles target the smallest viewport. Media queries add complexity for larger screens. This ensures performance on constrained devices (Principle 3: Performance Gravity).

### 10.2 Container System

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
}
```

Fluid padding (clamp) eliminates the need for breakpoint-specific padding rules. The container breathes naturally from 24px on small screens to 64px on large screens.

### 10.3 Content Width Tiers

| Tier | Max Width | Use Case |
|---|---|---|
| Narrow | 640px | Long-form text, single-column forms, prose |
| Default | 768px | General content, moderate-width layouts |
| Wide | 1024px | Card grids, multi-column layouts, features |
| Full | 1280px | Full layouts, dashboards, data-heavy views |

**Text-heavy content never exceeds the Default tier (768px)**, even on wide screens. The remaining space is structural whitespace that communicates restraint (Principle 2: Biosynthetic Restraint).

### 10.4 Boundary Integrity

Padding is inviolable. No child element may visually breach its parent's padding zone. Not by overflow, not by shadow, not by negative margin, not by any mechanism. If a container has 24px of padding, every child renders at least 24px inset from the container's edge on every side.

This is enforced at the component level, not by the consumer. Container components apply `overflow: hidden` and ensure children cannot exceed the content box. Layout primitives apply `min-width: 0` to their children so flex/grid items shrink correctly rather than overflowing.

A consumer who places any component inside any container should never see asymmetric padding, clipped content at one edge, or children touching a container boundary. If they do, the container component has a bug.

### 10.5 Composability Constraint

Padding layers compound. When nesting containers with padding (e.g., page > card > viewport > card), available content width decreases at each level. Before composing more than two padded layers, calculate the remaining content width at the narrowest expected viewport. If content clips: use a compact (sm) component variant at the innermost level, reduce an inner padding tier, or reduce nesting depth. The preferred fix is always reducing nesting. A composition that requires four padding layers to show a single value has too many containers.

---

## Part XI: Component Design Patterns

Every component follows standard UX best practices -- forms are usable, buttons are clickable, navigation is clear. What distinguishes this language is not different interaction patterns but a different level of visual and tactile craft applied to the same patterns every interface uses.

The distinction is in the details that accumulate into atmosphere. A button's hover lift is 1px, not 4px -- subtle enough to feel mechanical rather than bouncy. A button's press response is 75ms -- fast enough to feel tactile. A form label uses monospace uppercase at 11px with ultra tracking -- a visual treatment that reads as "classified" rather than "labeled." None of these break UX conventions. All of them, combined, create a specific aesthetic that generic component libraries do not produce.

The token system is the constraint mechanism: components can only use values from the defined scales, which guarantees visual consistency. But consistency is not enough. The components must also carry the atmosphere of the environment -- the warm-but-precise feeling of an architect-designed research facility where every detail was considered.

**The craft test:** Place any component next to the same component from a generic design system (a framework default button, a Bootstrap card, a Material form field). The Strand version must be visibly more refined -- not through added decoration, but through the quality of its spacing, typography, transitions, and shadow. If the two are indistinguishable, the component has not achieved the required level of craft.

### 11.1 Form Fields (The Specimen Instrument)

Forms are the primary input surface. They collect structured data for processing. The visual treatment should feel like filling out a scientific specimen form, not a web application.

```css
.field-label {
  font-family: var(--strand-font-mono);
  font-size: var(--strand-text-xs);
  font-weight: 500;
  letter-spacing: var(--strand-tracking-widest);
  text-transform: uppercase;
  color: var(--strand-gray-500);
  margin-bottom: var(--strand-space-2);
}

.field-input {
  width: 100%;
  padding: var(--strand-space-3) var(--strand-space-4);
  background: var(--strand-surface-elevated);
  border: 1px solid var(--strand-gray-200);
  border-radius: var(--strand-radius-md);
  font-size: var(--strand-text-base);
  color: var(--strand-gray-900);
  transition:
    border-color var(--strand-duration-fast) ease,
    box-shadow var(--strand-duration-fast) ease;
}

.field-input:focus {
  outline: none;
  border-color: var(--strand-blue-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-input::placeholder {
  color: var(--strand-gray-400);
}
```

**The monospace uppercase label** is the laboratory signature. It says "this field has a purpose" in the same way a specimen label on a vial says "this sample has been classified." This single pattern. Monospace, 11px, uppercase, tracked, gray-500. Is the most distinctive typographic element in the entire design language. **All form field labels MUST use this pattern** (font-mono, text-xs, weight-medium, tracking-widest, uppercase, gray-500). Sans-serif labels at body size violate the specimen instrument metaphor and are not permitted.

**Form security: honeypot field.** Every public form should include a hidden honeypot input that bots fill but humans never see. The field is visually hidden (not `display: none` which some bots skip, but positioned offscreen with `aria-hidden="true"` and `tabindex="-1"`). If the honeypot contains a value on submission, the submission is silently rejected. This is a standard spam prevention pattern that belongs in the form component toolkit.

### 11.2 Data Display (The Readout Panel)

When displaying processed data (metrics, scores, status), the interface becomes an analytical readout:

```css
.readout-label {
  font-family: var(--strand-font-mono);
  font-size: var(--strand-text-xs);
  letter-spacing: var(--strand-tracking-ultra);
  text-transform: uppercase;
  color: var(--strand-gray-500);
}

.readout-value {
  font-family: var(--strand-font-mono);
  font-size: var(--strand-text-3xl);
  font-weight: 300;              /* Light weight at large size = biosynthetic elegance */
  letter-spacing: var(--strand-tracking-tighter);
  font-variant-numeric: tabular-nums;
  color: var(--strand-blue-midnight);
}
```

**The DataReadout pattern**. Monospace overline + large light-weight value + tabular numerals. Is unique to this design language. It is the instrument panel made typographic.

**Size variants.** The default value size (text-3xl, 39px) suits standard cards and standalone readouts. Compact and hero contexts need proportional scaling:

| Modifier | Value Font | Pixel | Use Case |
|---|---|---|---|
| `--sm` | `--strand-text-xl` | 25px | Dashboard widgets, compact cards, sidebar metrics, dense data views |
| (none) | `--strand-text-3xl` | 39px | Standard cards, standalone readouts |
| `--lg` | `--strand-text-4xl` | 49px | Hero metrics, feature highlights, landing pages |
| `--xl` | `clamp(4.5rem, 10vw, 7rem)` | 72-112px | Primary instrument readout. The single dominant number on the screen (Principle 2). |

The overline label stays at `--strand-text-xs` across all sizes. The label-to-value ratio shifts from 44% (sm) to 14% (xl): in larger readouts, the number is the hero and the label is the caption. The default (no modifier) preserves the current behavior.

### 11.3 Status Indicators

```css
/* Tiered quality */
.status-excellent  { color: var(--strand-teal-vital); }    /* 90%+ */
.status-strong     { color: var(--strand-blue-primary); }   /* 70-89% */
.status-moderate   { color: var(--strand-amber-caution); }  /* 50-69% */
.status-low        { color: var(--strand-gray-400); }        /* <50% */

/* Operational status */
.status-active     { color: var(--strand-teal-vital); }
.status-pending    { color: var(--strand-blue-primary); }
.status-review     { color: var(--strand-amber-caution); }
.status-closed     { color: var(--strand-gray-400); }
.status-error      { color: var(--strand-red-alert); }
```

### 11.4 Code Display (The Terminal Readout)

Code is a readout. It should feel like reading terminal output in the laboratory.

```css
.code-block {
  font-family: var(--strand-font-mono);
  font-size: var(--strand-text-sm);
  line-height: var(--strand-leading-relaxed);
  color: var(--strand-blue-midnight);
  background: var(--strand-surface-recessed);
  box-shadow: inset 0 1px 3px rgba(15, 23, 42, 0.06);
  border-radius: var(--strand-radius-lg);
  padding: var(--strand-space-3) var(--strand-space-4);
  overflow-x: auto;
  white-space: pre;
  tab-size: 2;
}

.code-block__label {
  font-family: var(--strand-font-mono);
  font-size: var(--strand-text-xs);
  font-weight: var(--strand-weight-medium);
  letter-spacing: var(--strand-tracking-widest);
  text-transform: uppercase;
  color: var(--strand-gray-500);
  margin-bottom: var(--strand-space-2);
}
```

**Rules:**
- Code never wraps. Horizontal scroll preserves structure.
- Background uses the recessed surface with inner shadow (same as instrument viewport pattern from 7.3).
- Font is always JetBrains Mono at text-sm (13.3px). Smaller than body text, larger than labels.
- Padding uses space-4 horizontal (16px), space-3 vertical (12px). Compact but breathable.
- Optional language label uses the overline pattern (monospace, uppercase, tracked).
- Tab size is 2 spaces (consistent with modern code formatting).

### 11.5 Navigation

Navigation is the laboratory directory. It tells you where you are and what instruments are available.

- Brand mark always present in the nav. Links to home
- Lab/section name in monospace (e.g., "DASHBOARD")
- Horizontal bar on desktop, hamburger collapse on mobile
- Active item indicated by blue underline (2px, animated from left)
- Navigation background: white or glassmorphic (for dark-viewport contexts)

### 11.6 Feedback Patterns

Diagnostic events use a **monospace status prefix** (INFO / COMPLETE / WARNING / ERROR) rendered as the first element in the feedback component. Status color is applied to the **prefix text only**, never as a background tint or border stripe. Backgrounds are neutral: `surface-recessed` for inline alerts, `surface-elevated` for floating toasts. No colored borders or tinted backgrounds on feedback components.

| Pattern | Treatment |
|---|---|
| Toast (transient) | Monospace status prefix, surface-elevated background, Level 3 elevation, auto-dismisses, sr-only live region |
| Alert (persistent) | Monospace status prefix, surface-recessed background, full-width within content flow, dismissible optional |
| Banner (page-level) | Fixed to top of viewport, full-width, surface-elevated or tinted background. Communicates system-wide status (maintenance, announcements, warnings). Dismissible. Pushes page content down. Variants: info (blue-glow bg), warning (amber-tint bg), critical (red-tint bg). Uses instrument voice for the message. |
| Dialog (modal) | Centered, focus-trapped, Level 3 elevation, backdrop overlay, escape-to-close |
| Tooltip (contextual) | Small, positioned, delay on show (200ms), no delay on hide |
| Progress (status) | Bar or ring, determinate or indeterminate, monospace percentage label |

### 11.7 Microcopy Voice

Inside instrument viewports, the microcopy speaks as a system, not as a person. This is the instrument's voice:

| Generic | Biosynthetic |
|---|---|
| "Loading..." | "Processing..." |
| "3 results found" | "3 matches detected" |
| "Job details" | "Position analysis" |
| "Error occurred" | "Process interrupted" |
| "Please try again" | "Retry sequence" |
| "Invalid email" | "Format unrecognized. Expected: name@domain.tld" |
| "Required field" | "Required input" |
| "Thanks for submitting!" | "Data received. Processing." |

This is not gimmicky sci-fi. It is precise, active-voice, system language. It communicates: you are interacting with an engineered process, not filling out a form that a human will eventually read.

---

## Part XI-B: Composition Grammar

Atoms compose into molecules through production rules. A finite set of rules generates the full space of valid compositions. This grammar is informed by context-free grammar theory: terminals are irreducible tokens, nonterminals are composition patterns that expand into other patterns, and derivation is the process of expanding a composition until only terminals remain.

### 11.8 Notation

```
rule-name  →  body ;
```

- `→` separates the rule name (head) from what it produces (body).
- `|` separates alternatives for the same rule.
- `( )` groups sub-expressions.
- `*` means zero or more. `+` means one or more. `?` means optional.
- `UPPER_CASE` names are terminals (design tokens from Part III, text patterns from Part IV).
- `lower-case` names are nonterminals (references to other rules in this grammar).
- Quoted strings `"value"` are literal CSS property values.

### 11.9 Terminals

Terminals are the atomic alphabet. They do not decompose further. Every composition bottoms out at these.

**Token terminals** (Part III):
```
COLOR         →  any --strand- color token ;
SPACE         →  any --strand-space- token ;
BORDER        →  "1px solid" COLOR ;
RADIUS        →  any --strand-radius- token ;
FONT          →  FONT_MONO | FONT_SANS ;
FONT_MONO     →  "--strand-font-mono" ;
FONT_SANS     →  "--strand-font-sans" ;
WEIGHT        →  any --strand-weight- token ;
SIZE          →  any --strand-text- token ;
TRACKING      →  any --strand-tracking- token ;
LEADING       →  any --strand-leading- token ;
```

**Text pattern terminals** (Part IV.5 -- these are named patterns, not CSS classes):
```
OVERLINE      →  FONT_MONO  SIZE_XS  WEIGHT_MEDIUM  TRACKING_ULTRA  "uppercase"  COLOR_GRAY_500  LEADING_NORMAL ;
HEADLINE      →  FONT_MONO  WEIGHT_LIGHT  TRACKING_WIDEST  "uppercase"  COLOR_MIDNIGHT  LEADING_TIGHT ;
TITLE         →  FONT_SANS  WEIGHT_LIGHT  TRACKING_TIGHTER  COLOR_MIDNIGHT  LEADING_SNUG ;
LEAD          →  SIZE_LG  COLOR_GRAY_500  "max-width: 50ch"  LEADING_RELAXED ;
SECONDARY     →  SIZE_SM  COLOR_GRAY_500  LEADING_RELAXED ;
MONO_VALUE    →  FONT_MONO  SIZE_XS  COLOR_GRAY_600  "tabular-nums" ;
STATUS_VALUE  →  FONT_MONO  SIZE_XS  COLOR_SEMANTIC  "tabular-nums" ;
```

**Semantic color terminals** (Part III.8):
```
COLOR_SEMANTIC  →  COLOR_TEAL_VITAL | COLOR_BLUE_PRIMARY | COLOR_AMBER_CAUTION | COLOR_RED_ALERT ;
```

**Surface terminals** (Part V):
```
SURFACE       →  SURFACE_BASE | SURFACE_ELEVATED | SURFACE_RECESSED ;
ELEVATION     →  SHADOW_LEVEL_1 | SHADOW_LEVEL_2 | SHADOW_INSET ;
```

### 11.10 Productions

These are the composition rules. Each rule defines how elements arrange. All visual styling comes from terminals; productions define only spatial relationships and containment.

**Axis rules** (how elements share space):

```
inline-pair       →  identifier  quantifier ;
identifier        →  OVERLINE ;
quantifier        →  MONO_VALUE | STATUS_VALUE ;
```
Axis: horizontal. Distribution: `"space-between"`. Cross-alignment: `"center"`. The pair fills container width.

```
inline-sequence   →  element  element  element* ;
```
Axis: horizontal. Distribution: `"flex-start"`. Gap: `SPACE_3`. Elements do not stretch. Each element is a terminal text pattern.

```
centered-group    →  self-contained  self-contained  self-contained* ;
self-contained    →  atom ;
```
Axis: horizontal. Distribution: `"center"`. Gap: `"clamp(2rem, 5vw, 4rem)"`. Each child is independent of sibling count or position. Text centers within each child.

**Stacking rules** (how items repeat vertically):

```
ranked-sequence   →  ranked-item  ( RANK_BORDER  ranked-item )* ;
ranked-item       →  inline-pair | inline-sequence | atom ;
RANK_BORDER       →  "border-top: 1px solid" COLOR_BORDER_SUBTLE ;
```
Items of equal semantic rank stack vertically. Adjacent same-rank siblings separate with `RANK_BORDER`, never spacing alone. Padding-block is consistent across all items. Different-rank groups (a section header above a list) separate with space, not border.

**Connected sequence** (sequential process steps):

```
connected-sequence  →  step-card  CONNECTOR  step-card  ( CONNECTOR  step-card )* ;
step-card           →  surface  step-indicator  heading  description ;
step-indicator      →  FONT_MONO  SIZE_XS  WEIGHT_SEMIBOLD  COLOR_BLUE_PRIMARY ;
CONNECTOR           →  "::before" gradient-line between siblings (hidden below 768px) ;
```
Connected sequences display process steps with a visual line linking them. The connector is a horizontal gradient line (`transparent → blue-indicator → transparent`) drawn behind the cards via a `::before` pseudo-element on the container. On mobile (below 768px), the connector hides and steps stack vertically. Each step is a surface (card) containing a step indicator (monospace number), heading, and description.

**Containment rules** (how sections nest inside surfaces):

```
sectioned-surface →  section  ( section )* ;
section           →  SECTION_BOUNDARY  section-content ;
SECTION_BOUNDARY  →  boundary-header  "border-bottom: 1px solid" COLOR_GRAY_200  "margin-bottom:" SPACE_3  "padding-bottom:" SPACE_2 ;
boundary-header   →  OVERLINE | inline-pair ;
section-content   →  ranked-sequence | centered-group | atom+ ;
```
The boundary distributes its header children on the inline axis (space-between). A single OVERLINE sits at the start. Two elements (e.g., label + metadata, title + action) distribute to opposite ends. The last section in a surface omits its trailing border.

**Column rules** (how data maps to proportional visual elements):

```
column-array      →  column  column  column* ;
column            →  column-amount?  column-bar  column-label ;
column-amount     →  OVERLINE ;
column-bar        →  COLOR_BLUE_INDICATOR  RADIUS_TOP  "height:" DATA_VALUE ;
column-label      →  OVERLINE ;
DATA_VALUE        →  inline style (CSS cannot know the data) ;
```
All columns are `"flex: 1"` (equal width). Columns align to `"flex-end"` (bottom). One color only for bars (Blue Discipline, Part III.4). Semantic color is earned through annotation on the label, not bar color. The array goes inside a `SURFACE_RECESSED` when it needs the dual-surface treatment (Part V).

### 11.11 Containment Precedence

Compositions nest in a strict hierarchy. Higher-level compositions contain lower-level ones, never the reverse. This is the stratification that prevents ambiguity.

```
page              →  surface* ;
surface           →  SURFACE  ( sectioned-surface | ranked-sequence | centered-group | column-array | atom+ ) ;
sectioned-surface →  section+ ;
section           →  SECTION_BOUNDARY  ( ranked-sequence | centered-group | atom+ ) ;
ranked-sequence   →  ranked-item+ ;
ranked-item       →  inline-pair | inline-sequence | atom ;
atom              →  (any component from Part XI: Button, Card, DataReadout, Badge, etc.) ;
```

Reading top-down: a page contains surfaces, a surface contains sections or sequences, a section contains ranked items, a ranked item contains atoms. No level skips. A `ranked-sequence` never directly contains a `surface`. An `inline-pair` never contains a `section`.

### 11.12 Derivation

Derivation is how you verify a composition. Start from the outermost nonterminal and expand each rule until only terminals remain. If you cannot reach all-terminals through legal productions, the composition is invalid.

**Example: dashboard card with KV metadata**

```
surface
  → SURFACE_ELEVATED  sectioned-surface
  → SURFACE_ELEVATED  section
  → SURFACE_ELEVATED  SECTION_BOUNDARY  ranked-sequence
  → SURFACE_ELEVATED  ( OVERLINE  BORDER_GRAY_200  SPACE_3  SPACE_2 )  ranked-item  RANK_BORDER  ranked-item
  → SURFACE_ELEVATED  ( OVERLINE  BORDER )  inline-pair  RANK_BORDER  inline-pair
  → SURFACE_ELEVATED  ( OVERLINE  BORDER )  ( OVERLINE  MONO_VALUE )  RANK_BORDER  ( OVERLINE  STATUS_VALUE )
  → all terminals ✓
```

**Example: secondary readout row**

```
centered-group
  → self-contained  self-contained  self-contained
  → atom  atom  atom
  → DataReadout--sm  DataReadout--sm  DataReadout--sm
  → all terminals ✓
```

**Validation rule:** A molecule is valid when it fully derives to terminals using only the productions in 11.10 and the containment precedence in 11.11. If derivation requires a rule not in this grammar, either:
1. The composition is a new atom (it needs its own component in Part XI), or
2. A production is missing from this section (propose it).

### 11.13 Tests

Each production has a test. Run these at composition time.

| Production | Test |
|---|---|
| inline-pair | Cover the value. Can you tell what the row measures? Cover the label. Can you interpret the value? Both must pass. |
| ranked-sequence | Remove one item from the middle. Does the layout still look correct (no double borders, no collapsed gaps)? |
| section (boundary) | Remove the boundary. Can you tell where one section ends and the next begins? If yes, the boundary is redundant (Principle 1). |
| centered-group | Remove one child. Does the group still look balanced? Add one child. Does it still fit? |
| column-array | Reorder columns randomly. Is data still readable? (If not, labels are insufficient.) Swap all bar colors to gray. Is information lost? (If yes, Blue Discipline violation.) |
| containment | Does each nonterminal nest inside a legal parent per 11.11? If a ranked-sequence sits directly inside a page with no surface, the containment is invalid. |

Named molecules in strand-ui (see HTML_REFERENCE.md) are convenience CSS classes for common derivations. An agent that knows this grammar can compose any valid molecule from first principles without needing the named class.

---

## Part XII: Interaction State System

### 12.1 Universal State Layer

Every interactive element uses the same state system. Consistency is what makes the interface feel like a single instrument rather than a collection of disparate widgets.

| State | Visual Change | Duration |
|---|---|---|
| Default | Base appearance | - |
| Hover | Background shift + 1px lift + shadow evolution | 150ms |
| Focus | 2px blue outline, 2px offset | 0ms (instant) |
| Pressed | Return to 0px lift + darker shade + instant duration | 75ms |
| Disabled | 40% opacity, no pointer events | - |
| Loading | Skeleton shimmer or spinner replaces content | - |

### 12.2 Hover: The Diagnostic Response

Hover communicates: "this element is alive and responds to your attention." The visual response is subtle:

- **Buttons:** Background darkens one step. 1px vertical lift. Shadow appears.
- **Cards:** 2px vertical lift. Shadow deepens from Level 1 to Level 2.
- **Links:** Underline grows from left to right (250ms, ease-out-expo).
- **Table rows:** Background shifts to `--strand-blue-glow`.
- **Icons:** Opacity shifts from 0.7 to 1.0.

### 12.3 Focus: The Accessibility Ring

```css
:focus-visible {
  outline: 2px solid var(--strand-blue-primary);
  outline-offset: 2px;
}
```

- Always `2px solid`. Visible, unambiguous
- Always `2px offset`. Does not overlap the element
- Only on `:focus-visible`. Not on mouse click (keyboard users see it, mouse users don't)
- Color is `--strand-blue-primary`. Consistent with the accent system

### 12.4 Pressed: The Tactile Response

Pressed state must feel physical:
- **Lift returns to 0** (if the element was lifted on hover)
- **Shadow reduces** (pressed into the surface)
- **Duration is 75ms**. Instant, tactile, like pressing a physical button
- **Background darkens one more step** than hover

### 12.5 Disabled: The Powered-Down Instrument

Disabled elements are powered-down instruments. They exist but are not operational:
- **40% opacity**. Visible but clearly inactive
- **`pointer-events: none`**. Cannot be interacted with
- **`cursor: not-allowed`**. Visual reinforcement (on elements that still receive pointer events)
- **No transition**. Disabled elements do not animate. They are static.

---

## Part XIII: Data Visualization

### 13.1 Principles

Data visualization in this design language follows the same principles as the rest of the system: restrained, precise, earned. But data visualization is also one of the primary aesthetic signatures of this language. A well-rendered chart should be visually compelling enough that someone would screenshot it and share it. The data IS the visual interest. No decorative elements are needed because the data itself, rendered with the right colors, typography, and spacing, is the art. Biology rendered as abstract composition. Workforce data treated with the same visual reverence that genomics companies give to DNA sequences.

1. **Data-ink ratio.** Maximize the proportion of ink (pixels) used to display data vs. decoration. Remove gridlines that don't serve comprehension. Remove backgrounds that don't aid reading. Every pixel earns its place (Principle 1).
2. **Color is data, not decoration.** Chart colors encode data categories. They do not exist for visual interest. Use the semantic accent palette for data series.
3. **Typography is legible at chart scale.** Axis labels use monospace, text-xs, tracking-wider. Values use monospace, text-sm, tabular-nums.
4. **Animation reveals, not entertains.** Data transitions should feel like a readout updating, not a show. Duration: 400ms. Easing: ease-in-out-sine.
5. **Data as brand identity.** Data visualization is not a secondary feature -- it is where the biosynthetic aesthetic is most powerfully expressed. The combination of the blue spectrum, monospace typography, and precise spacing renders data the way advanced research facilities render experimental results: with clarity that is simultaneously functional and beautiful.

**The abstract composition test:** Remove all axis labels and legends from a chart. Is the chart still visually interesting as an abstract composition? If yes, the visualization is correct. If it becomes a meaningless blob, the visual encoding is insufficient.

### 13.2 Chart Color Palette

For data series that need categorical distinction:

| Rank | Token | Usage |
|---|---|---|
| 1 | `--strand-blue-primary` | Primary series |
| 2 | `--strand-teal-vital` | Secondary series |
| 3 | `--strand-violet-data` | Tertiary series |
| 4 | `--strand-cyan-signal` | Quaternary series |
| 5 | `--strand-amber-caution` | Quinary series |
| 6 | `--strand-blue-indicator` | Senary series |

**Maximum 6 series per chart.** If more than 6 categories exist, group or filter. A chart with 12 colors is a chart with zero comprehension.

### 13.3 Chart Typography

```css
.chart-axis-label {
  font-family: var(--strand-font-mono);
  font-size: var(--strand-text-xs);
  letter-spacing: var(--strand-tracking-wider);
  color: var(--strand-gray-500);
}

.chart-value {
  font-family: var(--strand-font-mono);
  font-size: var(--strand-text-sm);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--strand-gray-700);
}

.chart-title {
  font-family: var(--strand-font-sans);
  font-size: var(--strand-text-lg);
  font-weight: 500;
  color: var(--strand-gray-800);
}
```

---

## Part XIV: Accessibility

### 14.1 Accessibility as Physics

Accessibility is not a feature. It is not a nice-to-have. It is not a compliance checkbox. It is a constraint of the medium, like gravity is a constraint of architecture. You do not "add" gravity compliance to a building. You design within it, or the building falls down.

Every decision in this design language satisfies WCAG 2.2 AA as a minimum. AAA where achievable without aesthetic compromise. Violations are structural failures, not style preferences.

### 14.2 Color Contrast

All text meets minimum contrast ratios against its background:
- **Normal text (< 24px / < 18.66px bold):** 4.5:1 minimum
- **Large text (>= 24px / >= 18.66px bold):** 3:1 minimum
- **UI components and graphical objects:** 3:1 minimum

The color palette was designed to satisfy these ratios:
- `--strand-gray-600` (#475769) on `--strand-surface-primary` (#FAFCFF) = **7.21:1** (passes AA and AAA)
- `--strand-gray-500` (#64778B) on `--strand-surface-primary` = **4.49:1** (passes AA)
- `--strand-blue-primary` (#3B8EF6) on white = **3.29:1** (passes AA for large text; for small text, use `--strand-blue-deep`)
- `--strand-blue-midnight` (#1E3E5F) on `--strand-surface-primary` = **10.70:1** (passes AAA)

### 14.3 Focus Indicators

- **All interactive elements** have a visible focus indicator
- Focus ring: 2px solid `--strand-blue-primary`, 2px offset
- `:focus-visible` only (not `:focus`). Keyboard users see it, mouse users don't
- Focus ring must not be obscured by adjacent elements
- Focus order follows DOM order, which follows visual order

### 14.4 Reduced Motion

Full `prefers-reduced-motion` support. Every animation in the system reduces to instant state change. No exceptions. No "gentle" fallbacks. If the user says "reduce motion," motion is eliminated.

### 14.5 Keyboard Navigation

- Every interactive element is reachable via Tab/Shift+Tab
- Complex widgets (dialogs, tabs, menus) use arrow keys per WAI-ARIA Authoring Practices 1.2
- Escape closes modals, dropdowns, and overlays
- Enter/Space activates buttons and toggles
- Focus traps exist in modals (Tab cycles within the modal, not behind it)
- No keyboard traps (the user can always Tab away from any element)

### 14.6 Semantic HTML

- Exactly one `<h1>` per page
- Heading hierarchy does not skip levels (h1, h2, h3. Never h1, h3)
- Form inputs have visible, associated `<label>` elements
- ARIA labels on all non-text interactive elements (icon buttons, etc.)
- ARIA live regions for dynamic content (toasts, notifications, form errors)
- Landmark regions: `<main>`, `<nav>`, `<header>`, `<footer>`

### 14.7 Touch Targets

Minimum 44x44px on all interactive elements. This is WCAG 2.2 AA Target Size (Success Criterion 2.5.8). Touch-screen users cannot reliably hit targets smaller than 44px.

---

## Part XV: Propagation Architecture

This section addresses a property that no competing design language explicitly engineers: how the system spreads. Institutional design systems propagate through corporate backing and component quantity. This language propagates through quality, specificity, and the structural properties described below.

### 15.1 Why Design Languages Spread

A design language is a cultural unit that replicates through imitation and transmission. It spreads when developers adopt it, retain it, and recommend it. The propagation fitness of a design language depends on three properties:

1. **Immediate utility (propagation).** The system must solve a problem the developer has right now. Fast setup, clear documentation, copy-paste examples, zero build configuration. If the time from "I heard about this" to "I have a working component" exceeds 5 minutes, propagation stalls.

2. **Retained quality (stickiness).** The developer must keep using the system after the first session. This requires: defaults that produce premium output (Principle 8), a coherent aesthetic that improves every page it touches, and depth that rewards continued exploration. If the first result looks generic, the developer switches to the next option.

3. **Social currency (repeatability).** Using the system must make the developer look good. When they show their work to teammates, clients, or the public, the interface should provoke "this looks professional". Which the developer attributes to their skill + the design system. This attribution is the social currency that drives word-of-mouth.

### 15.2 The Three Channels

Design languages propagate through three channels:

**Channel 1: Utility adoption.** Developer needs a component library. Finds this one. Installs it. Uses it. Outcome: the developer's project now carries the biosynthetic aesthetic. Every user of that project encounters the aesthetic without knowing its origin.

**Channel 2: Aesthetic contagion.** Designer or developer sees an interface built with this language. Recognizes the aesthetic (distinctive niche, Part I). Investigates the source. Adopts it. Outcome: the aesthetic propagates person-to-person through recognition.

**Channel 3: Intellectual engagement.** Developer reads this specification. Encounters the Named Principles. Finds them applicable beyond this specific design language. Uses concepts like "Cognitive Economy," "The Blue Discipline," and "Default Philosophy" in design discussions, reviews, and teaching. Outcome: the conceptual vocabulary propagates through professional discourse, independent of whether the developer uses the component library.

**Channel 3 is the highest-leverage channel** because it propagates even when the library is not adopted. A developer who reads this spec and says "I disagree with the biosynthetic aesthetic but 'Default Philosophy' changed how I think about component defaults" has still propagated the ideas. The ideas are the deepest propagation layer.

### 15.3 Stickiness Engineering

Stickiness is retention. A developer who tries the system and keeps using it has been "stuck." The mechanisms:

1. **Deceptive depth.** The surface is simple: install, import, use. The depths are rich: 10 named principles, a complete token system, a coherent philosophy. Simple surface drives adoption. Rich depth drives retention. The developer discovers new layers over time, each reinforcing the value of the system.

2. **Default quality.** Defaults produce premium output (Principle 8). The developer does not need to fight the system to get good results. Fighting the system is the #1 cause of framework abandonment. Defaults that work are defaults that retain.

3. **Identity formation.** The biosynthetic aesthetic is distinctive enough that developers begin to identify with it. "I use the biosynthetic system" is an identity statement in a way that "I use [institutional design system]" is not (because it is generic). Identity attachment is the strongest retention mechanism.

4. **Naming creates thinking tools.** The Named Principles (Part II) are designed as cognitive tools. Concepts that, once learned, become permanent analytical lenses. "The Blue Discipline" changes how you think about accent colors forever. "Cognitive Economy" changes how you evaluate visual complexity forever. Tools you use daily are tools you don't abandon.

### 15.4 Tribal Resonance

In the developer community, three value systems coexist:

- **Craft-driven** developers value beauty, polish, and aesthetic quality. They evaluate design systems by visual output.
- **Engineering-driven** developers value performance, architecture, and technical elegance. They evaluate design systems by bundle size, runtime cost, and API design.
- **Pragmatism-driven** developers value speed, simplicity, and "just works." They evaluate design systems by time-to-productive.

A design language that appeals to only one group spreads within that tribe but dies at tribal borders. This language is engineered for tri-tribal resonance:

| Developer Tribe | What They See | Why They Adopt |
|---|---|---|
| Craft-driven | The biosynthetic aesthetic, typography, motion | "Most distinctive design system I've seen" |
| Engineering-driven | Zero-runtime CSS, <50KB, performance budgets, token architecture | "Technically superior to CSS-in-JS alternatives" |
| Pragmatism-driven | 5-minute setup, copy-paste, good defaults, clear docs | "Just works and looks great out of the box" |

The same system, three different value propositions, no contradiction. This is maximal tribal reach.

### 15.5 Self-Demonstrating Quality

The documentation site is built with the design language. The specification you are reading demonstrates the principles it describes. The components in the docs are the components you install.

This is not a coincidence. It is a propagation mechanism. A developer evaluating the design language has already experienced it before deciding to adopt it. The evaluation IS the demonstration. If the documentation site looks premium, the developer trusts that their own project will look premium.

Institutional design system documentation does not feel like an app built with that system. Enterprise component library documentation feels like documentation, not a product. This language's documentation must feel like the best-designed product the developer has ever used. The docs are the sales pitch. The docs are the proof.

### 15.6 Origin Encoding

Every artifact produced by this design language carries provenance metadata in standard locations:

| Surface | How Origin Appears |
|---|---|
| LICENSE (MIT) | Copyright line with author name and URL |
| package.json | author, homepage, repository, bugs fields |
| CSS file banners | `/*! Strand vX.X.X \| MIT License \| [url] */` |
| README.md | "Created by [Author]" in footer section |
| CLI output | One-line banner on init |
| Docs site footer | "Strand is crafted by [Author]" with link |
| npm registry | Inherits homepage, author, repository from package.json |

**Organic, not intrusive.** The origin appears where developers naturally look for authorship. It does not appear in rendered component output, console logs during normal operation, or watermarks on user interfaces. The developer can remove all attribution (MIT license permits this). But it ships by default.

**Every copy-pasted file carries provenance.** When a developer uses the CLI to add a component, the copied file includes a one-line header comment with the MIT license notice and origin URL. This is standard open-source practice. The developer can remove it, but it ships by default.

---

## Part XVI: Quality Gates

### 16.1 Performance Budget

| Metric | Budget | Enforcement |
|---|---|---|
| FCP | < 1.2s | Automated test assertion |
| LCP | < 1.5s | Automated test assertion |
| DOMContentLoaded | < 1s | Automated test assertion |
| INP | < 50ms | Minimal JS + GPU compositing |
| CLS | < 0.05 | Automated test assertion |
| TBT | < 150ms | Automated test assertion |
| Total library size | < 50KB gzipped | Build step validation |
| Animation framerate | 60fps | Transform-only animations |
| RAIL response budget | JS tasks < 50ms | Architecture constraint |

### 16.2 Accessibility Compliance

| Standard | Requirement | Enforcement |
|---|---|---|
| WCAG 2.2 AA | All content | Automated (axe-core) + manual audit |
| Color contrast (normal text) | 4.5:1 | Token system + automated test |
| Color contrast (large text) | 3:1 | Token system + automated test |
| Touch targets | 44x44px minimum | Automated test |
| Keyboard navigation | All interactive elements | Manual test per component |
| Screen reader | All non-text content has text alt | Manual test per component |
| Reduced motion | All animations disabled | Automated test |
| Focus visible | All interactive elements | Automated test |

### 16.3 Token Completeness

Every design value used in any component must be a named token. Zero magic numbers.

| Category | Token Prefix | Required Coverage |
|---|---|---|
| Colors | `--strand-surface-*`, `--strand-blue-*`, `--strand-gray-*` | Every color in the system |
| Typography | `--strand-text-*`, `--strand-tracking-*`, `--strand-leading-*` | Every size, tracking, and line-height |
| Spacing | `--strand-space-*` | Every spacing value |
| Motion | `--strand-ease-*`, `--strand-duration-*` | Every easing and duration |
| Elevation | `--strand-elevation-*` | Every shadow level |
| Shape | `--strand-radius-*` | Every border radius |
| Layout | `--strand-breakpoint-*`, `--strand-content-*` | Every breakpoint and width tier |

**Test:** Search the component CSS for any raw value (a hex color, a pixel value, a duration, an easing) that is not a token reference. If found, it is a violation. Convert it to a token.

### 16.4 Component Quality Standard

Every component must satisfy ALL of the following before it is considered complete:

- All visual states: default, hover, focus, pressed, disabled, loading, error
- Keyboard navigation: Tab to reach, Enter/Space to activate, Escape to dismiss
- ARIA compliance: correct roles, labels, states, live regions
- Reduced motion: graceful degradation of all animations
- Responsive: correct at sm, md, lg, xl breakpoints
- Token-only CSS: zero magic numbers
- Unit tests: covering all states and interactions
- Visual tests: screenshot verification at key breakpoints
- Documentation: usage, props, examples, do's and don'ts
- Performance: no layout thrashing, transform-only animations

---

## Appendix A: Competitive Positioning

### A.1 vs. Institutional Design Systems

| Property | Institutional Systems | Strand |
|---|---|---|
| Aesthetic identity | Generic (recognizable as parent corporation) | Specific niche (biosynthetic laboratory) |
| Runtime cost | CSS-in-JS, computes styles per render | Zero-runtime CSS custom properties |
| Bundle size | 300KB+ | Target: <50KB gzipped |
| Framework dependency | Single framework only | Framework-agnostic tokens; Preact/React components |
| Performance specification | No specific budgets | Specific budgets enforced as automated tests |
| Named principles | Generic, untestable | 10 named, testable, memorable principles |
| Default output quality | Recognizable as parent corporation | Distinctive as biosynthetic laboratory |
| Theming approach | Proprietary ThemeProvider API | Override CSS custom properties (universal CSS) |
| Propagation awareness | None (relies on institutional weight) | Explicit architecture (Part XV) |
| Philosophy depth | ~2 paragraphs | Full thesis + 10 operational principles |
| Elevation system | Tonal elevation (tint-based) | Shadow-based 5-level scale with semantic contexts |
| Color system | Dynamic color from a single seed | Fixed palette with semantic roles (precision over flexibility) |

### A.2 vs. Enterprise Component Libraries

| Property | Enterprise Libraries | Strand |
|---|---|---|
| Aesthetic ambition | Corporate/enterprise | Biosynthetic laboratory |
| Component count | 60+ at varying quality | 31 (each flawless) |
| Bundle size | 1MB+ | <50KB gzipped |
| Motion philosophy | Basic (generic ease-in-out) | Specific easings per context (expo for enter, quart for general) |
| Typography as design | Standard (14px base, generic weights) | Core mechanism (weight hierarchy + monospace labels IS the design) |
| Organizing metaphor | None (abstract values) | The laboratory (concrete, functional, constraining) |
| Color philosophy | Multi-color algorithmic palette | Single accent with earned usage |
| Default output | Enterprise admin panel | Precision laboratory |

### A.3 Unique Differentiators

1. **Named, testable principles.** 10 named cognitive tools that designers and developers adopt as permanent thinking vocabulary.
2. **The "earned" framework.** Color is earned. Elevation is earned. Animation is earned. This provides a decision framework for every visual property.
3. **Cognitive Economy.** The explicit measurement of cognitive operations per screen. No competitor has a framework for evaluating visual complexity from first principles.
4. **Default Philosophy.** The explicit commitment that defaults ARE the philosophy. No competitor states this or tests against it.
5. **Propagation Architecture.** The explicit engineering of spread mechanics. No competitor addresses how their system propagates.
6. **Zero-runtime token architecture.** CSS custom properties for everything. No ThemeProvider, no styled(), no CSS-in-JS, no runtime computation. Pure CSS.
7. **The DataReadout pattern.** Monospace overline + large light-weight value + tabular numerals. A signature component unique to Strand.
8. **The dual-surface principle.** White lab frame + recessed instrument viewport. A layout concept no competitor offers.

---

## Appendix B: Token Quick Reference

### Colors
| Token | Value | Role |
|---|---|---|
| `--strand-surface-primary` | #FAFCFF | Page background |
| `--strand-surface-elevated` | #FFFFFF | Cards, modals |
| `--strand-surface-recessed` | #F0F5F8 | Form fields, secondary areas |
| `--strand-surface-subtle` | #E8EEF3 | Borders, dividers |
| `--strand-blue-glow` | #E8F5FD | Hover backgrounds, selections |
| `--strand-blue-wash` | #DBECFE | Light emphasis backgrounds |
| `--strand-blue-indicator` | #93CCFD | Progress, secondary interactive |
| `--strand-blue-primary` | #3B8EF6 | Primary actions, links |
| `--strand-blue-vivid` | #2570EB | Hover on primary |
| `--strand-blue-deep` | #1D5AD8 | Active/pressed |
| `--strand-blue-midnight` | #1E3E5F | Headlines |
| `--strand-blue-abyss` | #0F192A | Maximum contrast |
| `--strand-gray-50` to `--strand-gray-900` | #F7FAFD to #0F192A | Full neutral scale |
| `--strand-cyan-signal` | #22D3EE | Data visualization energy |
| `--strand-teal-vital` | #14B8A6 | Success, confirmed |
| `--strand-green-positive` | #10B981 | Growth, positive |
| `--strand-violet-data` | #8B5CF6 | Secondary data category |
| `--strand-red-alert` | #EF4444 | Errors, destructive |
| `--strand-amber-caution` | #F59E0B | Warnings |

### Typography
| Token | Value |
|---|---|
| `--strand-text-xs` to `--strand-text-7xl` | 0.694rem to 5.96rem (Major Third scale) |
| `--strand-tracking-tightest` to `--strand-tracking-ultra` | -0.05em to 0.12em |
| `--strand-leading-none` to `--strand-leading-loose` | 1.0 to 1.75 |

### Spacing
| Token | Value |
|---|---|
| `--strand-space-1` to `--strand-space-48` | 4px to 192px (multiples of 4) |

### Motion
| Token | Value |
|---|---|
| `--strand-ease-out-expo` | cubic-bezier(0.16, 1, 0.3, 1) |
| `--strand-ease-out-quart` | cubic-bezier(0.25, 1, 0.5, 1) |
| `--strand-ease-in-out-sine` | cubic-bezier(0.37, 0, 0.63, 1) |
| `--strand-ease-in-expo` | cubic-bezier(0.7, 0, 0.84, 0) |
| `--strand-duration-instant` to `--strand-duration-glacial` | 75ms to 700ms |

### Elevation
| Token | Levels |
|---|---|
| `--strand-elevation-0` to `--strand-elevation-4` | none to 32px/64px spread |

### Shape
| Token | Value |
|---|---|
| `--strand-radius-sm` | 4px |
| `--strand-radius-md` | 6px |
| `--strand-radius-lg` | 8px |
| `--strand-radius-xl` | 12px |
| `--strand-radius-full` | 9999px |

---

## Appendix C: Aesthetic Lineage

### Cinematic Interface Aesthetics

The biosynthetic laboratory aesthetic draws from four cinematic interface lineages:

**The biosynthetic.** White polymer surfaces, blue LED indicators, smooth organic curves. Technology that has absorbed biological design language while remaining obviously artificial. Diffused, shadowless, clinical lighting. Materials: smooth polymers, brushed aluminum, frosted glass, soft-touch plastics. Everything slightly translucent or matte-sheen. This is the primary visual influence on the design language.

**The minimalist research facility.** Brutalist concrete + Scandinavian minimalism + warm wood + floor-to-ceiling glass. The most advanced technology presented in rooms that look like modern art galleries. Light is control -- daylight filtered through glass, not fluorescent tubes. Technology is understated: screens embedded in walls, minimal interfaces. The materials are natural (concrete, wood, glass, stone) and the technology is synthetic (polymer, aluminum, frosted surfaces). This duality -- natural environment, synthetic instruments -- is the spatial signature of the design language. Restraint as the signal of true advancement. The facility is beautiful before any instrument is turned on.

**The analytical control room.** Clean, white/light palettes with precision data visualization. Corporate-future aesthetic. Interfaces designed to look like they process real information. Directly relevant to dashboard and analytical readout patterns in this language.

**Fantasy user interfaces (FUI).** Interfaces designed as world-building elements. Each screen has internal logic: consistent iconography, type systems, color coding. Interfaces suggest how they would be used -- you can look at a control panel and understand its function before reading any text. Extreme detail density when needed: thin lines, small monospace type, layered semi-transparent panels. The best FUI work proves that futuristic interfaces can be clean and white, not dark and cluttered. This functional-feeling quality -- where every element implies purpose -- is what separates this design language from generic component libraries. It directly informs the component patterns in Part XI: every form field, data readout, and status indicator must feel like it is performing a function, not merely existing on screen.

### Performance-as-Design Precedents

| Pattern | Principle |
|---|---|
| 60fps interaction as brand identity | Precision spacing, monospace labels, optimistic UI updates. The benchmark tools became dominant by making every interaction feel instant. |
| Documentation as design | Animated gradients, editorial restraint. Proof that B2B tools can be beautiful. |
| The absence of waiting | Near-instant page loads via edge rendering. Route prefetching creates native-app feel. No loading spinners. |
| Speed as the product | Charging premium prices because every action completes in <100ms. Performance justifies pricing. |
| Sub-frame response | <50ms response time. The tool becomes an extension of thought, not a separate application. |

### Technology Aesthetic Positions

| Position | What Strand Adopts | What Strand Rejects |
|---|---|---|
| Neural-interface aesthetics | Sparseness, one idea per section, enormous negative space | The void/darkness (Strand is white, not dark) |
| Consumer technology benchmark | Scroll-as-narrative, weight variation as hierarchy, restraint as luxury | Product-as-hero (Strand has no physical product) |
| AI research visualization | Data visualization as brand identity | Academic tone (Strand is applied, not research) |
| Literary-humanist technology | Proof that warm palettes can feel scientific | Too warm (Strand is cool/blue-shifted) |
| Humanoid robotics | Cinematic reverence for the subject | Single-product focus (Strand covers many instrument types) |

---

## Part XVII: Token Architecture

### 17.1 Three-Tier Model

Tokens organize into three tiers. Each tier serves a different audience and changes at a different frequency.

**Reference tokens** are the raw palette. They name values without implying usage: `--strand-blue-500`, `--strand-gray-200`, `--strand-space-6`. These change only when the aesthetic itself changes (rare).

**System tokens** are semantic decisions. They assign reference values to roles: `--strand-color-primary` resolves to `--strand-blue-primary`. `--strand-color-text-body` resolves to `--strand-gray-600`. These change when the design system evolves (occasional).

**Component tokens** are scoped to a single component: `--strand-button-bg` resolves to `--strand-color-primary`. These change when a component is redesigned (component-level).

**Implementation:** All three tiers are CSS custom properties in the same `:root` block. The tiers are a conceptual model for understanding change impact, not separate files. A change to a reference token cascades through every system and component token that references it. A change to a component token affects only that component.

**Theming:** To create a variant theme (warmer lab, cooler lab), override system tokens only. Reference tokens define the palette; system tokens define how the palette is applied. Overriding `--strand-color-primary` from blue to teal changes every primary-colored element without touching component code.

**The test:** Change one system token (e.g., `--strand-color-primary`). Does every component that uses primary color update correctly? If any component uses a hardcoded reference token instead of the system token, it will not update. That component has a token architecture violation.

### 17.2 Contrast-Safe Pairing Rule

Every background token has a paired foreground token that guarantees WCAG 2.2 AA contrast. Components MUST use the paired token, never select foreground colors independently.

On `--strand-surface-primary` (#FAFCFF): use `--strand-on-surface-primary` (gray-600, 7.21:1).
On `--strand-surface-recessed` (#F0F5F8): use `--strand-on-surface-recessed` (gray-600, 6.74:1).
On `--strand-blue-primary` (#3B8EF6): use `--strand-on-blue-primary` (#FFFFFF, 3.68:1 large text).

When a component moves to a different surface (e.g., overline inside a recessed section), it MUST switch to the paired foreground for that surface. This is not optional. The token system enforces accessibility; manual contrast checking is not acceptable.

---

## Part XVIII: Layout Archetypes

The laboratory has a finite number of room types. Every page or view in this design language uses one of these archetypes.

### 18.1 The Specimen Collection Room (Form Flow)

Purpose: collect structured data from the user. The talent profile form. The employer role form. The feedback form.

Structure: centered container (content-narrow or content-default), section header (overline + heading + lead), form fields in a vertical stack with Gestalt-compliant spacing, submit button, success/error feedback.

The user's attention should be on the form. Nothing else competes. Whitespace communicates: "take your time, this matters."

### 18.2 The Readout Panel (Dashboard)

Purpose: display processed data. Match scores. Job intelligence. Analytics.

Structure: full-width or content-wide container, grid of cards, each card is a sectioned-surface (Part XI-B) containing DataReadouts, inline-pairs, or ranked-sequences. The instrument viewport (dark recessed) may house charts or maps.

The user scans, compares, and decides. Visual hierarchy directs the eye: the primary readout is largest (DataReadout --xl), supporting data is smaller.

### 18.3 The Showcase Gallery (Feature Display)

Purpose: demonstrate capabilities. The Strand lab page. The process steps. The lab card grid.

Structure: alternating sections with generous padding (section rhythm from Part V.4), each section has a centered header (overline + heading + lead) followed by a grid or stack of cards. Scroll reveal animations (Part VI.4) create the "processing" feel.

The user scrolls and discovers. Each section is a self-contained exhibit.

### 18.4 The Directory (Navigation Hub)

Purpose: orient the user and provide navigation. The lab discovery section. Breadcrumbs. Sidebar navigation.

Structure: compact container, linked cards or list items, status indicators (badges). The navigation is the instrument — it should feel like a laboratory directory panel, not a website menu.

### 18.5 The Report (Long-Form Content)

Purpose: present extended text content. Documentation. Analysis. Articles.

Structure: content-narrow container (640px max), prose typography (Part IV.6: 60-75 characters per line), generous line-height (leading-relaxed), section rhythm between blocks. The DataReadout pattern and overline pattern break up long text with instrument-like data callouts.

**The archetype test:** For any new page, name the archetype. If it does not fit any of the five, either it is a new archetype that needs specification (strategy session), or the page is trying to do too many things at once (simplify per Principle 1).

---

## Part XIX: Navigation

### 19.1 Primary Navigation

Horizontal bar on desktop. Monospace lab identifier on the left. Linked items on the right. Active item indicated by a 2px blue underline that animates from left (250ms, ease-out-expo). Scrolled state: subtle background + elevation-1 shadow.

Mobile: hamburger collapse into a slide-down panel. All items visible. Touch targets 44px minimum. The mobile nav is still the laboratory directory — compact but functional.

### 19.2 Breadcrumbs

Monospace text-xs, gray-500, separated by `/` or `>`. Current item is not linked and uses gray-700. Each breadcrumb level corresponds to a level of the containment hierarchy (Part XI-B 11.11): page > section > item.

### 19.3 Tabs

Horizontal tab bar. Each tab is a text button with a 2px bottom border. Active tab: blue-primary border + blue-primary text. Inactive: transparent border + gray-500 text. Hover: gray-700 text. Transition: color and border-color at duration-fast.

Tabs switch content panels. The panel transition is instant (no animation between panels). The user is switching instruments, not navigating to a new room.

### 19.4 Pagination

Monospace page numbers. Current page: blue-primary text + blue-glow background. Other pages: gray-600 text. Navigation arrows at the ends. Touch targets 44px minimum.

### 19.5 Footer

The footer is the laboratory's closing panel. Compact, informational, visually quiet.

Structure: border-top using the standard divider color (gray-200), generous padding (space-12), centered content. Navigation links in a horizontal row using monospace text-xs, tracking-wider, gray-400 with blue-primary hover. Copyright line in text-xs, gray-400.

The footer does not compete with page content. It is the last instrument in the room — visible but unobtrusive.

---

## Part XX: Density

### 20.1 Three Density Levels

| Level | Token Modifier | Component Padding | Line Height | Use Case |
|---|---|---|---|---|
| Default | (none) | md (24px) | normal (1.5) | Marketing, forms, showcase |
| Compact | `--compact` | sm (16px) | snug (1.25) | Dashboards, data tables, admin |
| Dense | `--dense` | space-2 (8px) | tight (1.15) | Data-heavy readouts, logs, terminal views |

Density affects padding, line-height, and gap values. It does NOT affect font sizes, colors, border-radius, or elevation. The aesthetic stays the same; the information density increases.

**The density test:** Switch a view between default and compact density. Does it still feel like the same laboratory, just with instruments closer together? If the compact version feels like a different design system, the density implementation has leaked into aesthetic properties.

---

## Part XXI: Empty States

When an instrument has no data, it does not disappear. It shows an idle state.

### 21.1 The Idle Readout

A DataReadout with no value displays `--` in the value position, with the label still visible. The label says what the instrument WOULD measure. The user understands: this instrument exists and will activate when data arrives.

### 21.2 The Empty Collection

A list or grid with no items displays a single centered message in instrument voice: "No [items] detected." Below it, an optional action: "Begin [process]" as a link. The empty state uses gray-400 text on the primary surface. No illustrations. No icons. The absence of data IS the visual.

### 21.3 The Search With No Results

"0 matches detected." followed by a suggestion in secondary text: "Adjust parameters and retry." The search instrument is still active — it ran and returned nothing. This is different from an error (process interrupted).

**The empty state test:** Remove all data from any view. Is the resulting page still recognizable as a Strand interface? If it collapses into a blank white page, the empty states are insufficient.

---

## Part XXII: Formatting Standards

The laboratory uses consistent notation for all data types.

### 22.1 Numbers

- Integers: no decimal, no thousands separator below 10,000. Above 10,000: use comma separator (10,000 / 1,000,000).
- Decimals: maximum 2 decimal places for display. Trailing zeros preserved for consistency (94.00%, not 94%).
- Percentages: number + % with no space. Always show one decimal for precision when the value matters (94.3%), integers when approximate (94%).
- Currency: symbol prefix, no space, comma separator ($10,000 / $1,234.56).
- Large numbers: abbreviate at millions (1.2M, not 1,200,000) unless precision matters.
- All numeric values use `font-variant-numeric: tabular-nums` for alignment.

### 22.2 Dates and Times

- Absolute dates: YYYY-MM-DD (ISO 8601) in instrument voice. "March 15, 2026" in human voice.
- Relative dates: "2 hours ago", "Yesterday", "3 days ago". Switch to absolute after 7 days.
- Times: 12-hour format with AM/PM in human voice. 24-hour in instrument voice. Always include timezone abbreviation for non-local times.
- Ranges: en-dash separator with spaces (Jan 1 -- Mar 15).

### 22.3 Empty Values

Never show blank. Always show a placeholder:
- Numeric: `--`
- Text: `Not provided` (human voice) / `null` (instrument voice)
- Date: `Not set`

---

*This specification is a living document. It evolves through implementation, testing, and community feedback. Every change must satisfy the Named Principles, pass the Quality Gates, and maintain the biosynthetic laboratory aesthetic.*

*The design language is the visible output. The quality speaks for itself.*

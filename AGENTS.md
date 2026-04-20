# AGENTS.md

Strand is a design token system and UI component library. Zero-runtime CSS. 47 components across 8 categories. Ships to Preact, React, Vue, Svelte, vanilla HTML, tokens-only, Bulma, and Bootstrap consumers.

## Install

Pick your stack:

```bash
# Preact (native)
npm install preact @dillingerstaffing/strand @dillingerstaffing/strand-ui

# React (via preact/compat alias)
npm install react react-dom @dillingerstaffing/strand @dillingerstaffing/strand-ui

# Vue 3
npm install vue @dillingerstaffing/strand @dillingerstaffing/strand-vue

# Svelte
npm install svelte @dillingerstaffing/strand @dillingerstaffing/strand-svelte

# CSS Only (no framework)
npm install @dillingerstaffing/strand @dillingerstaffing/strand-ui

# Tokens Only (design tokens, no components)
npm install @dillingerstaffing/strand

# Bulma coexistence (Strand aesthetic on Bulma components)
# See docs/migration/from-bulma.md

# Bootstrap coexistence (zero class collisions, side by side)
# See docs/migration/from-bootstrap.md
```

## Required CSS

Every project using Strand components must import these four CSS files in order:

```css
@import '@dillingerstaffing/strand/css/tokens.css';
@import '@dillingerstaffing/strand/css/reset.css';
@import '@dillingerstaffing/strand/css/base.css';
@import '@dillingerstaffing/strand-ui/css/strand-ui.css';
```

Missing any of these is the most common integration mistake. Components will render without styles if the imports are incomplete.

## Required JS (vanilla HTML consumers only)

Vanilla HTML consumers (no Preact/Vue/Svelte) must also load the vanilla runtime for interactive behavior (copy buttons, mobile nav, tab switching, cross-browser `:has()` fallbacks):

```html
<script src="path/to/strand-ui.js"></script>
```

The file is at `@dillingerstaffing/strand-ui/vanilla` (or `dist/vanilla/strand-ui.js` in the package). It is a standalone IIFE with no dependencies. Load it after the CSS. Framework consumers (Preact/Vue/Svelte) do NOT need this file because their components handle these behaviors internally.

CSS-only consumers who do not load the vanilla runtime require a browser that supports the CSS `:has()` selector (Firefox 121+, Chrome 105+, Safari 15.4+) for glass nav body padding to work correctly. For cross-browser support, load the vanilla runtime.

## Rules

1. Always use `strand-` prefixed CSS classes. Never write raw hex color values when a Strand token exists.
2. Never use inline `style=""` for properties that Strand tokens cover (color, spacing, radius, elevation, typography).
3. Use Strand design tokens (`--strand-*` CSS custom properties) for all visual values.
4. Every component supports all interaction states, keyboard navigation, ARIA compliance, and `prefers-reduced-motion`.

## Where to find what

- **CSS class API for every component**: [html-reference.md](./generated/html-reference.md)
- **Design specification (tokens, principles, rationale)**: [design-language.md](./docs/design-language.md)
- **Component TypeScript types**: each component directory in `packages/strand-ui/src/components/`
- **Consumer types and framework parity**: [consumers.md](./generated/consumers.md)
- **Copy-paste CLI**: `npx strand-ui add <component>` copies source into your project

## Layout primitives quick reference

When a handoff uses a custom wrapper for a layout pattern, reach for the
existing Strand layout primitive instead of inventing a new one. Common
translations:

| Pattern (px) | Strand classes |
|---|---|
| vertical stack, 12px gap | `strand-stack strand-stack--vertical strand-stack--gap-3` |
| horizontal row, 12px gap, wrap, center | `strand-stack strand-stack--horizontal strand-stack--gap-3 strand-stack--align-center strand-stack--wrap` |
| horizontal row, 24px gap | `strand-stack--gap-6` (on the same stack) |
| 2-column grid, 16px gap | `strand-grid strand-grid--cols-2 strand-grid--gap-4` |
| 3-column grid, 16px gap | `strand-grid strand-grid--cols-3 strand-grid--gap-4` |
| 4-column grid, 12px gap | `strand-grid strand-grid--cols-4 strand-grid--gap-3` |

Crosswalk: `--strand-space-N` = `4 * N` px (so `--strand-space-3` = 12px,
`--strand-space-4` = 16px, `--strand-space-6` = 24px). See
[design-language.md](./docs/design-language.md) for the full spacing scale.

## Component-reference page chrome (strand-ref-*)

Use the `strand-ref-*` primitive family when building a component-reference
page on a docs site or inside a consumer's lab. The family includes a
shell/sidebar/main grid, a header with metrics, a taxonomy explainer, and
section/example blocks that pair a component name with a demo panel.

Override the sticky-top offset for a consumer's fixed nav:

```html
<div class="strand-ref-shell" style="--strand-ref-sticky-top: var(--strand-nav-height);">
  <aside class="strand-ref-shell__sidebar">...</aside>
  <main class="strand-ref-shell__main">...</main>
</div>
```

Related specimen primitives (same docs-site use case):
`strand-swatch*`, `strand-type-specimen*`, `strand-token-specimen*`,
`strand-container-scale*`, `strand-ref-frame*` (in-page modal stage),
`strand-ref-glass-stage`/`__panel`, `strand-ref-reveal-stage`/`-line`,
`strand-ref-tip*`, `strand-ref-util-*`. See
[html-reference.md](./generated/html-reference.md).

## Dark-viewport cascades

Two Strand primitives have on-dark overrides that trigger when the primitive
is inside a dark instrument surface. Consumers do not need inline style
overrides to re-theme these for dark cabinets:

- `.strand-status-chip--neutral` becomes a translucent gray chip with a
  hairline border when inside `.strand-instrument-viewport` or
  `.strand-body--instrument`.
- `.strand-btn--ghost` flips to white text with a hairline translucent
  border under the same selectors.

The cascade mirrors the existing `.strand-kv__label` / `.strand-kv__value`
dark-mode handling. No new class required; the override fires on the
existing neutral chip and ghost-button classes.

## Common mistakes

1. **Missing CSS imports.** All four CSS files are required. `tokens.css` alone is not enough for components.
2. **Hardcoded colors.** Use `var(--strand-blue-primary)`, not `#2563eb`. Strand tokens are the API.
3. **Missing preact peer dep.** Even React projects need `preact` installed for the compatibility layer.
4. **Wrong class prefix.** Strand classes use `strand-` prefix with BEM modifiers (`strand-btn--primary`), not utility classes.
5. **Skipping size modifiers.** Strand buttons need explicit size: `strand-btn--sm`, `strand-btn--md`, or `strand-btn--lg`.
6. **Using Bootstrap/Bulma class patterns.** Strand uses its own BEM conventions. See the class mapping guides in `docs/migration/`.
7. **Missing vanilla runtime for vanilla HTML consumers.** Without the runtime script, copy buttons, mobile nav hamburger, tab switching, and `:has()` fallbacks are missing. Framework consumers get these for free from their components.

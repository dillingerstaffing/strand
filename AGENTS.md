# AGENTS.md

Strand is a design token system and UI component library. Zero-runtime CSS. 34 components across 7 categories. Ships to Preact, React, Vue, Svelte, vanilla HTML, tokens-only, Bulma, and Bootstrap consumers.

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

## Common mistakes

1. **Missing CSS imports.** All four CSS files are required. `tokens.css` alone is not enough for components.
2. **Hardcoded colors.** Use `var(--strand-blue-primary)`, not `#2563eb`. Strand tokens are the API.
3. **Missing preact peer dep.** Even React projects need `preact` installed for the compatibility layer.
4. **Wrong class prefix.** Strand classes use `strand-` prefix with BEM modifiers (`strand-btn--primary`), not utility classes.
5. **Skipping size modifiers.** Strand buttons need explicit size: `strand-btn--sm`, `strand-btn--md`, or `strand-btn--lg`.
6. **Using Bootstrap/Bulma class patterns.** Strand uses its own BEM conventions. See the class mapping guides in `docs/migration/`.

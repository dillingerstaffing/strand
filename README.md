<p align="center">
  <strong>S T R A N D</strong>
</p>

<p align="center">
  Design tokens + UI components. Zero-runtime CSS. Ship faster.
</p>

<p align="center">
  <a href="./docs/design-language.md">Design Language</a> &#183;
  <a href="./AGENTS.md">Agents</a> &#183;
  <a href="./generated/consumers.md">Consumers</a> &#183;
  <a href="./CONTRIBUTING.md">Contributing</a> &#183;
  <a href="https://github.com/dillingerstaffing/strand/issues">Issues</a> &#183;
  <a href="https://dillingerstaffing.com/labs/strand">Official Website</a>
</p>

<p align="center">
  Strand supports Preact, React, Svelte, Vue, vanilla HTML, tokens-only, Bulma, and Bootstrap. See <a href="./generated/consumers.md">consumers.md</a> for the full registry and each consumer type's parity obligation.
</p>

---

## Documentation

<!-- DOCMAP:START -->
| Doc | Purpose |
|---|---|
| [README](./README.md) | Install, configure, start building |
| [AGENTS.md](./AGENTS.md) | AI coding agent usage instructions |
| [HTML Reference](./generated/html-reference.md) | CSS class API for every component |
| [Design Language](./docs/design-language.md) | Complete design specification |
| [Consumers](./generated/consumers.md) | Consumer types and framework parity |
| [Changelog](./generated/changelog.md) | Version history |
| [Contributing](./CONTRIBUTING.md) | How to contribute |
| [Bulma Migration](./docs/migration/from-bulma.md) | Use Strand alongside Bulma |
| [Bootstrap Migration](./docs/migration/from-bootstrap.md) | Use Strand alongside Bootstrap |
| [Strand Lab Page](https://dillingerstaffing.com/labs/strand) | Live showcase and brand entry point |
<!-- DOCMAP:END -->

---

## Quick Start

**CDN** (zero install, one copy-paste)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand@0.5/css/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand@0.5/css/reset.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand@0.5/css/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand-ui@0.5/dist/css/strand-ui.css">
```

Start using Strand classes immediately. No npm, no bundler, no build step. Works in static HTML, CodePen, JSFiddle, or any page.

**CLI** (recommended for projects)

```bash
npx strand-ui init
```

Auto-detects your framework (Preact/React, Vue, Svelte, or CSS-only), copies tokens, and generates `STRAND.md` for AI coding agents.

**npm** (manual install)

```bash
npm install @dillingerstaffing/strand @dillingerstaffing/strand-ui
```

```css
@import '@dillingerstaffing/strand/css/reset.css';
@import '@dillingerstaffing/strand/css/tokens.css';
@import '@dillingerstaffing/strand/css/base.css';
@import '@dillingerstaffing/strand-ui/css/strand-ui.css';
```

**Use components:**

```jsx
import { Button, Input, Card, Stack } from '@dillingerstaffing/strand-ui';

function App() {
  return (
    <Card variant="elevated" padding="lg">
      <Stack gap={4}>
        <Input placeholder="Enter your email" />
        <Button>Get Started</Button>
      </Stack>
    </Card>
  );
}
```

---

## Framework Setup

### Vue 3

```bash
npm install vue @dillingerstaffing/strand @dillingerstaffing/strand-vue
```

```vue
<script setup>
import { Button, Card, Stack } from '@dillingerstaffing/strand-vue'
</script>

<template>
  <Card variant="elevated" padding="lg">
    <Stack :gap="4">
      <Button>Get Started</Button>
    </Stack>
  </Card>
</template>
```

### Svelte

```bash
npm install svelte @dillingerstaffing/strand @dillingerstaffing/strand-svelte
```

```svelte
<script>
import { Button, Card, Stack } from '@dillingerstaffing/strand-svelte'
</script>

<Card variant="elevated" padding="lg">
  <Stack gap={4}>
    <Button>Get Started</Button>
  </Stack>
</Card>
```

### Preact (native)

Strand UI is built with Preact. No additional configuration needed.

```bash
npm install preact @dillingerstaffing/strand @dillingerstaffing/strand-ui
```

### React

Strand UI works with React via Preact's compatibility layer. Add a bundler alias so `preact` resolves to `preact/compat`:

**Vite** (vite.config.ts):
```ts
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'preact': 'preact/compat',
      'preact/hooks': 'preact/hooks',
    },
  },
});
```

**Next.js** (next.config.js):
```js
module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'preact/compat': 'preact/compat',
      'preact': 'preact/compat',
    };
    return config;
  },
};
```

**webpack** (webpack.config.js):
```js
module.exports = {
  resolve: {
    alias: {
      'preact': 'preact/compat',
      'preact/hooks': 'preact/hooks',
    },
  },
};
```

In all cases, install preact alongside react:
```bash
npm install preact @dillingerstaffing/strand @dillingerstaffing/strand-ui
```

---

## Tokens Only

Use the design system with any framework. No components, no runtime, no peer dependencies.

```bash
npm install @dillingerstaffing/strand
```

```css
@import '@dillingerstaffing/strand/css/tokens.css';

.card {
  background: var(--strand-surface-elevated);
  border-radius: var(--strand-radius-lg);
  box-shadow: var(--strand-elevation-1);
  padding: var(--strand-space-6);
}

.label {
  font-family: var(--strand-font-mono);
  font-size: var(--strand-text-xs);
  letter-spacing: var(--strand-tracking-widest);
  text-transform: uppercase;
  color: var(--strand-gray-500);
}
```

Tokens are also available as typed JavaScript constants:

```ts
import { colors, spacing, typography } from '@dillingerstaffing/strand';
```

---

## CSS Only (No Framework)

Use Strand's full component library with plain HTML. No JavaScript required.

```bash
npm install @dillingerstaffing/strand @dillingerstaffing/strand-ui
```

```html
<link rel="stylesheet" href="node_modules/@dillingerstaffing/strand/css/tokens.css">
<link rel="stylesheet" href="node_modules/@dillingerstaffing/strand-ui/dist/css/strand-ui.css">

<button class="strand-btn strand-btn--primary strand-btn--md" type="button">
  <span class="strand-btn__content">Get Started</span>
</button>
```

See [html-reference.md](./generated/html-reference.md) for every component's CSS class API.

**Using Bulma?** Strand ships a [Bulma theme](./docs/migration/from-bulma.md) that works with all four of Bulma's customization paths: CSS variables, Sass full import, modular Sass, or scoped `[data-theme="strand"]`. Bulma components adopt the Strand aesthetic through Bulma's own documented mechanisms.

**Using Bootstrap or another CSS framework?** Strand's `strand-` prefix means zero class name collisions. Load both and use each where you want. See [Using Strand with Bootstrap](./docs/migration/from-bootstrap.md).

---

## Copy-Paste Components

Own the source. No dependency lock-in.

```bash
npx strand-ui init          # Set up tokens in your project
npx strand-ui add button    # Copy Button source to your codebase
npx strand-ui add dialog    # Copy Dialog source to your codebase
npx strand-ui list          # See all <!-- COMPONENT-COUNT:START -->34<!-- COMPONENT-COUNT:END --> components
```

After install, the CLI is available as `strand` (e.g., `strand add button`).
The CLI auto-detects your framework (Preact, Vue, Svelte, or CSS-only) and copies the right file format.

Copies the full TypeScript source (.tsx + .css) into your project. Modify freely.

---

## Components

<!-- COMPONENT-COUNT:START -->34<!-- COMPONENT-COUNT:END --> components across 7 categories. Every component includes: all interaction states, keyboard navigation, ARIA compliance, `prefers-reduced-motion` support, responsive behavior. Full prop documentation: [html-reference.md](./generated/html-reference.md).

### Input

| Component | Description |
|---|---|
| `Button` | Primary action trigger |
| `Input` | Single-line text entry |
| `Textarea` | Multi-line text entry |
| `Select` | Option selection |
| `Checkbox` | Binary toggle (multiple) |
| `Radio` | Single selection from set |
| `Switch` | Binary toggle (single) |
| `Slider` | Range value selection |
| `FormField` | Label + input + hint + error wrapper |

### Display

| Component | Description |
|---|---|
| `Card` | Content container |
| `Badge` | Status/count indicator |
| `Avatar` | User/entity representation |
| `Tag` | Categorization label |
| `Table` | Tabular data display |
| `DataReadout` | Monospace metric display |
| `CodeBlock` | Code snippet display |

### Layout

| Component | Description |
|---|---|
| `Stack` | Flex layout primitive |
| `Grid` | Grid layout primitive |
| `Container` | Width constraint |
| `Divider` | Visual separator |
| `Section` | Page section |

### Navigation

| Component | Description |
|---|---|
| `Link` | Inline navigation |
| `Tabs` | Content switching |
| `Breadcrumb` | Hierarchical location |
| `Nav` | Site/app navigation |

### Feedback

| Component | Description |
|---|---|
| `Toast` | Transient notification |
| `Alert` | Persistent notification |
| `Dialog` | Modal overlay |
| `Tooltip` | Contextual hint |
| `Progress` | Completion indicator |
| `Spinner` | Loading indicator |
| `Skeleton` | Content placeholder |

### Surface

| Component | Description |
|---|---|
| `InstrumentViewport` | Dark instrument panel container |

### Animation

| Component | Description |
|---|---|
| `ScrollReveal` | Scroll-triggered entrance animation |

---

## Design Tokens

Strand ships CSS custom properties for every visual value. Three examples of the pattern:

```css
/* Surface tokens */
background: var(--strand-surface-elevated);

/* Blue spectrum (interactive elements only) */
color: var(--strand-blue-primary);

/* Spacing scale (4px base unit) */
padding: var(--strand-space-6);
```

Full token specification: [design-language.md](./docs/design-language.md)

---

## Principles

Strand is governed by 10 named principles (Cognitive Economy, Biosynthetic Restraint, Performance Gravity, The Blue Discipline, Earned Elevation, Compound Silence, The Grain of Precision, Default Philosophy, Typography Carries the Room, The Instrument Principle). Each has a definition, a rationale, and a test. Full specification: [design-language.md](./docs/design-language.md)

---

## Troubleshooting

**Components render without styles**
You must import the CSS files. See step 2 of Quick Start. All four CSS imports are required for the component library: reset.css, tokens.css, base.css, and strand-ui.css.

**Peer dependency warning for preact**
Install preact: `npm install preact`. Strand UI is built with Preact (3KB). If using React, you still need preact installed for the compatibility layer. See Framework Setup above.

**TypeScript errors with JSX**
Ensure your tsconfig.json includes `"jsxImportSource": "preact"` (or the appropriate alias if using React). Components export typed props interfaces for full IntelliSense.

**Copy-paste components need TypeScript**
The `strand add` command copies .tsx source files. For JavaScript projects, rename files from .tsx to .jsx and remove type annotations manually. TypeScript is recommended.

---

<p align="center">
  <a href="https://dillingerstaffing.com">Dillinger Staffing</a>
  &#183;
  <a href="./LICENSE">MIT License</a>
</p>

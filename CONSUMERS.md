# Strand Consumer Types

Strand ships a single design language through multiple consumer-type surfaces so developers can adopt it without changing their stack. Every consumer type below is kept in **strict parity**: the same component inventory, the same token system, the same version number, in the same release. A primitive added to one consumer type is added to every consumer type in the same PR.

This file is the **single source of truth** for which consumer types Strand supports. The machine-readable companion `consumers.json` powers the parity test and the atomic release workflow. To add a new consumer type, add an entry to `consumers.json`, add a block to this file, and build the package to parity with the existing consumer types.

---

## 1. Preact

Import Preact components from `@dillingerstaffing/strand-ui`. Preact is the primary framework target; the package is Preact-first with React compatibility via `preact/compat`.

```bash
npm install preact @dillingerstaffing/strand @dillingerstaffing/strand-ui
```

```jsx
import { Button, Card, Stack } from '@dillingerstaffing/strand-ui';
```

Package: `packages/strand-ui/`
Parity obligation: exports every component in `parity-manifest.json` under `components`, with matching prop shapes.

---

## 2. React

The same package, consumed from a React codebase through `preact/compat` aliasing at the bundler level. Works in Vite, Next.js, webpack, and any bundler that supports path aliases.

```bash
npm install react react-dom @dillingerstaffing/strand @dillingerstaffing/strand-ui
```

See the React setup section in the repo README for alias configuration examples.

Package: `packages/strand-ui/` (same package as Preact, different bundler config)
Parity obligation: same as Preact (one package serves both).

---

## 3. Svelte

Svelte-native component library with the same visual output and the same component inventory.

```bash
npm install svelte @dillingerstaffing/strand @dillingerstaffing/strand-svelte
```

```svelte
<script>
  import { Button, Card, Stack } from '@dillingerstaffing/strand-svelte';
</script>
```

Package: `packages/strand-svelte/`
Parity obligation: exports every component in `parity-manifest.json` with the same prop names.

---

## 4. Vue 3

Vue 3 component library with matching inventory and prop shapes.

```bash
npm install vue @dillingerstaffing/strand @dillingerstaffing/strand-vue
```

```vue
<script setup>
import { Button, Card, Stack } from '@dillingerstaffing/strand-vue';
</script>
```

Package: `packages/strand-vue/`
Parity obligation: exports every component in `parity-manifest.json` with the same prop names.

---

## 5. Vanilla HTML with Strand classes

Zero JavaScript framework. Load the standalone CSS bundles and use Strand's BEM-style class names directly on HTML elements.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand/css/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand/css/reset.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand/css/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand-ui/dist/css/strand-ui.css">

<button class="strand-btn strand-btn--primary strand-btn--md">Click me</button>
```

Package: `packages/strand-ui/` sub-export `./dist/css/strand-ui.css` + `packages/tokens/` css files.
Parity obligation: every component in `parity-manifest.json` has its `cssClass` (and every variant/size modifier) present in the built standalone CSS bundle.

---

## 6. Tokens only

Use Strand's CSS custom properties with your own hand-written classes. You get the design language's colors, typography, spacing, motion, and elevation without Strand's component CSS.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand/css/tokens.css">

<style>
  .my-button {
    background: var(--strand-blue-primary);
    color: var(--strand-on-blue);
    padding: var(--strand-space-3) var(--strand-space-4);
    border-radius: var(--strand-radius-md);
  }
</style>
```

Package: `packages/tokens/` (`@dillingerstaffing/strand`, css sub-exports only).
Parity obligation: every token in `parity-manifest.json` is defined in `tokens.css` with the value specified in DESIGN_LANGUAGE.md.

---

## 7. Bulma coexistence

Use Bulma's components with Strand's aesthetic applied. Two paths, pick whichever matches how you already customize Bulma:

**Path A: CSS variables (no build step).** Load the Strand theme after Bulma; Bulma's `--bulma-*` variables resolve to Strand token values at runtime.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1/css/bulma.min.css">
<link rel="stylesheet" href="node_modules/@dillingerstaffing/strand/css/tokens.css">
<link rel="stylesheet" href="node_modules/@dillingerstaffing/strand/bulma/strand-bulma-compat.css">
```

**Path B: Sass (full-import).** Drop in a single Sass `@use` statement in place of your existing Bulma import.

```scss
@use "@dillingerstaffing/strand/bulma/strand-bulma-use";
```

Shipped files: `packages/tokens/bulma/strand-bulma-compat.css`, `packages/tokens/bulma/_strand-bulma-use.scss`, `packages/tokens/bulma/_strand-bulma-vars.scss`.
Parity obligation: the Bulma compat layer maps every Strand token listed in `parity-manifest.json` under `tokens` to the corresponding Bulma variable, and the `docs/migration/from-bulma.md` guide's class mapping stays consistent with the current Strand class inventory.

---

## 8. Bootstrap coexistence

Run Strand and Bootstrap side by side without conflicts. Strand prefixes every class with `strand-`, so there are zero collisions with Bootstrap's `btn-`, `col-`, `card`, etc. Add Strand components to an existing Bootstrap project alongside the current layout and utilities, or migrate incrementally.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand/css/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand-ui/dist/css/strand-ui.css">

<div class="container">
  <button class="btn btn-primary">Bootstrap button</button>
  <button class="strand-btn strand-btn--primary strand-btn--md">Strand button</button>
</div>
```

See `docs/migration/from-bootstrap.md` for a full class-mapping reference.

Shipped files: none dedicated (class-prefix coexistence is a naming-convention guarantee). The migration guide is the artifact.
Parity obligation: `docs/migration/from-bootstrap.md` stays consistent with the current Strand class inventory. An automated staleness check fails CI if any Strand class name referenced in the guide is missing from the built standalone CSS.

---

## Adding a new consumer type

1. Add an entry to `consumers.json` with a stable `id`, display `name`, `kind` (`package` | `sub-export` | `coexistence-layer`), path, install instructions, and parity obligation.
2. Add a block to this file (`CONSUMERS.md`) describing the new type for human readers.
3. Build the package to parity: every primitive listed in `parity-manifest.json` must be reachable through the new consumer type.
4. The parity test picks up the new consumer type automatically from `consumers.json`. No tooling changes needed.
5. The release workflow publishes the new package on the next root version bump.

Every consumer type shares one invariant: the same design language reaches every developer, regardless of their stack. The library is the brand argument. Parity is how it holds.

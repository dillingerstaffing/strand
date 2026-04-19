# Strand Consumer Types

Strand ships a single design language through multiple consumer-type surfaces so developers can adopt it without changing their stack. Every consumer type below is kept in **strict parity**: the same component inventory, the same token system, the same version number, in the same release. A primitive added to one consumer type is added to every consumer type in the same PR.

This file is the **single source of truth** for which consumer types Strand supports. The machine-readable companion `consumers.json` powers the parity test and the atomic release workflow. To add a new consumer type, add an entry to `consumers.json`, add a block to this file, and build the package to parity with the existing consumer types.

---

## 1. Preact

Install the `@dillingerstaffing/strand-ui` package to use Preact components.

```bash
npm install preact @dillingerstaffing/strand @dillingerstaffing/strand-ui
```

Package: `packages/strand-ui/`
Parity obligation: every component in parity-manifest.json#/components is exported from src/index.ts with matching prop names

---

## 2. React

Shares the same package as preact via preact/compat aliasing at the bundler level.

```bash
npm install react react-dom @dillingerstaffing/strand @dillingerstaffing/strand-ui
```

Package: `packages/strand-ui/`
Parity obligation: served by the same package as Preact via preact/compat; parity inherits from the preact entry

---

## 3. Svelte

Install the `@dillingerstaffing/strand-svelte` package to use Svelte components.

```bash
npm install svelte @dillingerstaffing/strand @dillingerstaffing/strand-svelte
```

Package: `packages/strand-svelte/`
Parity obligation: every component in parity-manifest.json#/components is exported from src/index.ts with matching prop names

---

## 4. Vue 3

Install the `@dillingerstaffing/strand-vue` package to use Vue 3 components.

```bash
npm install vue @dillingerstaffing/strand @dillingerstaffing/strand-vue
```

Package: `packages/strand-vue/`
Parity obligation: every component in parity-manifest.json#/components is exported from src/index.ts with matching prop names

---

## 5. Vanilla HTML with Strand classes

Shares the same package as preact.

```bash
load packages/tokens/css/* and packages/strand-ui/dist/css/strand-ui.css via link tags, plus dist/vanilla/strand-ui.js as a script tag for interactive behavior and cross-browser :has() fallbacks
```

Package: `packages/strand-ui/`
Artifact: `packages/strand-ui/dist/css/strand-ui.css`
Parity obligation: every CSS class in parity-manifest.json#/cssClasses is present in the built standalone strand-ui.css bundle

---

## 6. Tokens only

Install the `@dillingerstaffing/strand` package to use Tokens only components.

```bash
npm install @dillingerstaffing/strand
```

Package: `packages/tokens/`
Artifact: `packages/tokens/css/tokens.css`
Parity obligation: every token in parity-manifest.json#/tokens is defined in packages/tokens/css/tokens.css as a CSS custom property

---

## 7. Bulma coexistence

Coexistence layer: use Bulma coexistence alongside your existing CSS framework.

Install: see generated/consumers.md section 7

Package: `packages/tokens/`
Artifacts: `packages/tokens/bulma/strand-bulma-compat.css`, `packages/tokens/bulma/_strand-bulma-use.scss`, `packages/tokens/bulma/_strand-bulma-vars.scss`
Migration guide: [docs/migration/from-bulma.md](./docs/migration/from-bulma.md)
Parity obligation: strand-bulma-compat.css references every Strand token used by Bulma variables, and docs/migration/from-bulma.md class mappings correspond to real Strand CSS classes

---

## 8. Bootstrap coexistence

Coexistence guide: Bootstrap coexistence coexists via class-prefix naming convention.

Install: see generated/consumers.md section 8

Migration guide: [docs/migration/from-bootstrap.md](./docs/migration/from-bootstrap.md)
Parity obligation: every Strand class name referenced in docs/migration/from-bootstrap.md exists in the built standalone strand-ui.css bundle

---

## Adding a new consumer type

1. Add an entry to `consumers.json` with a stable `id`, display `name`, `kind` (`package` | `sub-export` | `coexistence-layer`), path, install instructions, and parity obligation.
2. Run `pnpm build:docs` to regenerate `generated/consumers.md` with the new consumer type.
3. Build the package to parity: every primitive listed in `parity-manifest.json` must be reachable through the new consumer type.
4. The parity test picks up the new consumer type automatically from `consumers.json`. No tooling changes needed.
5. The release workflow publishes the new package on the next root version bump.

Every consumer type shares one invariant: the same design language reaches every developer, regardless of their stack. The library is the brand argument. Parity is how it holds.

# Contributing to Strand

Thank you for your interest in contributing to Strand. This document covers everything you need to get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/strand.git`
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feat/your-feature`
5. Make your changes
6. Run tests: `pnpm test`
7. Run lint: `pnpm lint`
8. Commit with a conventional commit message
9. Push and open a pull request

## Development

```bash
pnpm install     # Install all dependencies
pnpm build       # Build all packages
pnpm test        # Run all tests
pnpm lint        # Lint all files
```

## Project Structure

<!-- GENERATED:PROJECT-STRUCTURE:START -->
| Directory | Package | Description |
|---|---|---|
| `packages/cli/` | `strand-ui` | CLI for adding Strand UI components to your project |
| `packages/strand-svelte/` | `@dillingerstaffing/strand-svelte` | Strand UI - Svelte component library built on the Strand Design Language |
| `packages/strand-ui/` | `@dillingerstaffing/strand-ui` | Strand UI - Preact/React component library built on the Strand Design Language |
| `packages/strand-vue/` | `@dillingerstaffing/strand-vue` | Strand UI - Vue 3 component library built on the Strand Design Language |
| `packages/tokens/` | `@dillingerstaffing/strand` | Strand Design Language tokens - CSS custom properties and JS constants |
<!-- GENERATED:PROJECT-STRUCTURE:END -->

## Available Commands

<!-- GENERATED:COMMANDS:START -->
| Command | Script |
|---|---|
| `pnpm audit-dogfood` | `node scripts/dogfood-audit.mjs` |
| `pnpm build` | `pnpm -r build` |
| `pnpm build:docs` | `node scripts/build-docs.mjs` |
| `pnpm dogfood` | `node scripts/dogfood-scaffold.mjs` |
| `pnpm lint` | `biome check .` |
| `pnpm lint:fix` | `biome check --write .` |
| `pnpm purity-scan` | `node scripts/purity-scan.mjs` |
| `pnpm sync-versions` | `node scripts/sync-versions.mjs` |
| `pnpm sync-versions:check` | `node scripts/sync-versions.mjs --check` |
| `pnpm test` | `pnpm -r test` |
| `pnpm test:all` | `pnpm test && pnpm test:parity && pnpm test:migration-staleness` |
| `pnpm test:migration-staleness` | `node scripts/migration-staleness.mjs` |
| `pnpm test:parity` | `node scripts/parity-check.mjs` |
| `pnpm test:scripts` | `vitest run --config vitest.config.mjs` |
<!-- GENERATED:COMMANDS:END -->

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style (formatting, semicolons, etc.)
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `test:` - Adding or updating tests
- `chore:` - Build process, tooling, dependencies

## Quality Standards

Every contribution must meet these standards:

- **Tests required.** Every new function gets unit tests. Every component gets interaction + accessibility tests. 100% branch coverage.
- **Accessibility required.** WCAG 2.2 AA compliance. All interactive elements keyboard-accessible. ARIA attributes correct per WAI-ARIA Authoring Practices.
- **Token-only values.** No hardcoded colors, sizes, spacings, or durations. Every value references a Strand token.
- **TypeScript strict mode.** No `any` types. Full type safety.

## Component Contribution

Each component requires:

1. `Component.tsx` - Implementation
2. `Component.css` - Styles using only Strand tokens
3. `Component.test.tsx` - Tests (render, interaction, accessibility)
4. `index.ts` - Public exports

All components must support:
- All interaction states (default, hover, focus-visible, active, disabled)
- Keyboard navigation per WAI-ARIA Authoring Practices
- `prefers-reduced-motion`
- 44px minimum touch targets on mobile

## Links

- [Strand Design Language](./DESIGN_LANGUAGE.md)
- [Dillinger Staffing](https://dillingerstaffing.com) - Project home
- [Issues](https://github.com/dillingerstaffing/strand/issues)

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

- `packages/tokens/` - Design tokens (CSS custom properties + JS constants)
- `packages/strand-ui/` - Preact/React component library
- `packages/cli/` - CLI for copy-paste component distribution
- `docs/` - Documentation site

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

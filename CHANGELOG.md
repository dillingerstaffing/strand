# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- add Vite + Preact starter template
- add AGENTS.md, llms.txt, and migration guides to scaffold reading list
- add agent consumption infrastructure (AGENTS.md, llms.txt, registry.json)
- add build-agent-surfaces script with tests
- add Vite + Preact starter template
- add AGENTS.md, llms.txt, and migration guides to scaffold reading list
- strand-nav__slot + strand-section--hero-compact primitives (v0.15.0)
- cross-consumer parity + dogfood chamber + migration staleness gate
- mobile nav primitive + viewport tweaks for a consumer round2
- subtler card--active treatment + chip--joined primitive
- CodeBlock copy button + parity across frameworks
- InstrumentViewport full-bleed mode + map/FUI primitives
- fine-grained margin utilities + button loading hides label
- v0.5.0 boost items + nav typography + axe-safe code block
- overline accent variant, gradient headline, section-hero centering
- hero-bg container, pulse indicator, auth indicator, auth avatar
- banner component, honeypot utility, gradient divider, overline contrast fix, tint tokens
- add nav scrolled, footer, form layout, steps connected, scroll-target, utilities
- Listening Station showcase (replaces previous examples)
- Culture Monitor showcase (biosynthetic laboratory CodePen demo)
- propagate all new variants to Preact, Vue, Svelte components
- heading styles and code element mono in base.css (DL 4.2 + 4.5)
- nav glass variant, text-center, code-name, viewport-flex, heading-sm, section-compact
- sr-only, section-header, step-indicator, link variants, section border-top, scroll-reveal CSS-only fallback
- DataReadout --xl + distributed card-section + example refactor
- composition grammar + molecular CSS classes
- examples/ folder with Coffee Supply Monitor showcase
- STRAND.md output audit checklist (ship-time principle verification)
- composition-time DL tripwires across all surfaces
- strengthen Principle 2 and 9 tests for composition-time enforcement
- Title text primitive (human voice display, DL Part IV.7)
- v0.9.0 -- first-principle text + surface + grid primitives
- v0.8.0 -- Overline/Headline/Lead utilities, border-subtle + shadow-inset tokens
- v0.7.0 -- full DL compliance
- v0.6.0 -- DL-aligned feedback components + FormField labels
- CDN distribution -- zero-install path via jsdelivr
- Bulma integration -- CSS compat layer + Sass vars + single-import
- v0.5.0 -- CodeBlock component, Svelte lib, Bulma adoption UX
- Phase 16 -- CodeBlock + Svelte + Bulma adoption UX
- Vue 3 component library + CSS-only path + CLI framework detection
- bespoke palette -- 4-degree cyan shift, all values original
- v0.3.0 -- fix publish workflow, bump all packages
- BLUF init output -- lead with STRAND.md, end with agent-ready
- HTML_REFERENCE.md tripwires to DESIGN_LANGUAGE.md
- generate STRAND.md on init + ship HTML_REFERENCE.md in npm
- DataReadout size variants (sm/lg) + composability guidance

### Changed
- bump strand packages to 0.15.1
- generate initial agent surface files
- bump all packages to v0.14.0
- bump all packages to v0.13.0
- bump all packages to v0.12.0
- bump all packages to v0.11.0
- bump all packages to v0.10.0
- add strand-svelte to publish workflow
- Node 24 for npm trusted publishing (Node 20 npm lacks OIDC support)
- OIDC trusted publishing -- no registry-url, .npmrc in repo, workspace dep resolution
- OIDC trusted publishing without NODE_AUTH_TOKEN
- single workflow -- npm publish --provenance from package dirs
- bump strand-ui to 0.2.4 (test auto-release chain)
- auto-release on push, publish on release (proven OIDC path)
- bump tokens to 0.2.3 (verify scoped OIDC publish)
- fix unscoped package.json generation (heredoc produced malformed JSON)
- retrigger publish (npm OIDC propagation)
- add --provenance to unscoped strand-ui publish
- trigger publish after npm OIDC config
- drop scoped CLI publish (consumers use unscoped strand-ui)
- publish on push to main (skip if version already on npm)
- add unscoped strand-ui to publish workflow
- bump strand-ui to 0.2.3 (tripwired HTML_REFERENCE.md)
- bump all packages to 0.2.1
- Merge pull request #2 from Intymax/add-readme-website-link
- Update README.md
- Add official website link to README

### Fixed
- bump nav slot margin from space-6 to space-8 for visual breathing room
- contain code-block copy button inside the pre border box
- replace Card --active rotating radar with static treatment
- align copy button icon with first line of code
- slider thumb renders as solid circle, not hollow ring
- InstrumentViewport map slot primitive
- banner offsets in-flow nav and full-bleed viewport
- blue required indicator + auto select arrow + responsive stack + auto-220/260 grids + smooth scroll
- nav logo pulse, mobile menu fixed positioning, tabs instrument variant
- gradient headline uses DS-quality vertical gradient, add section hero-xl
- strand-text-secondary strong/a styles for natural content emphasis
- STRAND.md references DL principles, doesn't duplicate them
- primary button uses blue-deep (darker, authoritative), generous padding on all sizes
- Svelte Tabs uses scoped slot props (static name required)
- use workspace:^ + pnpm publish --provenance for all packages
- rename CLI package to strand-ui, single publish mechanism
- remove broken npm upgrade, align Node to 20
- update lockfile after workspace:* to semver change
- resolve workspace:* dependency for npm consumers

### Documentation
- add JSDoc summaries and @example blocks to all components
- add JSDoc summaries and @example blocks to all components
- restructure for MECE with generated sections
- add AGENTS.md for AI coding agent consumption
- propagate strand-nav__slot + strand-section--hero-compact to package HTML_REFERENCE
- HTML_REFERENCE page recipes, new class docs, recessed surface contrast fixes
- document all 13 new classes in HTML_REFERENCE.md
- Bulma theme aligned to official Bulma customization paths
- READMEs for all packages + bump 0.5.1 (bulma compat ships)
- complete public surface audit -- Svelte, Bulma compat, CodeBlock
- comprehensive Bulma coexistence guide (v1 CSS vars, forms, dark mode, layout)
- add strand-vue README, bump to 0.4.1
- Quick Start leads with CLI init, shows both install paths
- update CLI commands to npx strand-ui for first-touch discovery

## [0.2.0] - 2026-04-02

### Added
- DESIGN_LANGUAGE.md v2.0 production specification
- boundary integrity - containers enforce child containment
- production-grade design language + component padding update
- CSS-first usability - .strand-static, layout utilities, HTML reference

### Changed
- bump all packages to v0.2.0 (aligns with DESIGN_LANGUAGE.md spec)
- design language enforcement tests + CSS compliance fixes

### Fixed
- complete token compliance across all component CSS
- align component CSS with v2 design language spec
- replace all raw hex colors with design tokens

### Documentation
- align all documentation with v2 design language spec
- update HTML_REFERENCE.md with viewport class and padding tiers
- comprehensive README, package metadata, CLI JS detection

## [0.1.1] - 2026-04-01

### Added
- Strand Design Language + UI Component Library

### Changed
- use OIDC trusted publishing, no NPM_TOKEN needed
- use npm provenance (OIDC trusted publishing)
- add GitHub Pages deployment for docs site
- add GitHub Actions CI/CD workflows

### Fixed
- OIDC trusted publishing with npm 11.5+ (no token needed)
- restore NPM_TOKEN for publish auth (OIDC adds provenance, not auth)
- use Node 22 for OIDC npm publish support
- scope CLI package as @dillingerstaffing/strand-cli
- CI build before test (build-output tests need dist/)
- CI pnpm version mismatch, enable GitHub Pages
- ship CSS, TypeScript declarations, and src/ for CLI copy-paste
- rename CLI bin from strand-ui to strand for usability
- add @types/node to CLI, fix build scripts

> For releases before the first tagged version, see git history.

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- every prop a component offers exists in all three ports, and a check keeps it so
- shared internals (cx, mergeRefs, styled), a render helper for snapshots, and docs/cf with a pointer check
- a 10px overline rung, a compact chip strip, and a touch-target floor that can be answered (v0.62.0)
- PersonChip carries a secondary label, plus a layout-transparent wrapper (v0.61.0)
- a consumer can bound and scroll a long list vertically (v0.60.0)
- a field can confirm a checked value, and its messages reach the control (v0.59.0)
- a consumer can tint an avatar without overriding the class (v0.58.0)
- an off-ladder gap stops rendering as no gap at all (v0.57.0), gaps #122-#123
- Breadcrumb renders as an instrument label (v0.56.1)
- Breadcrumb renders as an instrument label (v0.56.0)
- ActionDock owns its own reveal (v0.55.0)
- the modal shape a thumb can reach, and the density the design draws (v0.54.0), gaps #117-#120
- the cell floor a full-screen month needs (v0.53.0), gap #116
- the overlay a palette actually needs, and a stylesheet that was 72% prose (v0.51.0), gaps #110-#113
- an alert on a feature surface, a live dot, and a label that can thin out (v0.50.0), gaps #107-#109
- the tab bar owns its contrast, the field owns its width (v0.49.0, gaps #104-#106)
- a feature surface can hand its inset to its panes, and a readout can leave the ladder (v0.48.0, gaps #102-#103)

### Changed
- stylesheets carry rules, not essays; the reasoning moves to docs/cf
- surfaces recolour primitives through tokens, not selectors
- one focus ring, one reduced-motion rule, one disabled opacity
- delete every rule no known source emits, and gate it
- every block lives in the directory named for it
- class-name assertions give way to the snapshots that subsume them; the audit counts the shared snapshot helper and ignores directives
- overlays, chrome and data components on the shared internals; ids come from useId, Sheet ships no test hooks, Nav no longer writes to body, focus and scroll follow refs; five invariant articles
- forms, layout and avatar on the shared internals; Checkbox sets indeterminate as a prop and Switch and Checkbox trust native key activation; Textarea autosize follows a controlled value
- twenty display, layout and instrument components on the shared internals, markup identical; TabBar's click rule is an invariant article
- Alert, AppShell, Badge, BigMonoTime, Breadcrumb, Card, CardSection, Container on the shared internals, markup identical
- the specimen families are one-line style components; markup proven identical by snapshots recorded first
- snapshots serialize attributes in name order, so a rewrite that reorders JSX cannot fake a change
- snapshot every component's rendered markup, recorded on the 0.62.0 output
- a CSS home audit that reports which file defines each block
- the component audit counts verbose JSDoc as prose
- a component audit that reports the facts behind a review
- re-trigger the publish workflow for 0.55.2
- v0.54.1, gap #121

### Fixed
- Dialog locks scroll before paint, so a centred panel cannot re-centre (v0.61.2)
- the PersonChip separator inherits its text colour (v0.61.1)
- the gap class ladder matches the token ladder (v0.57.1), gap #124
- the instrument separator keeps a text-tier colour
- ActionDock reads the intersection ratio, not isIntersecting (v0.55.2)
- ActionDock covers a partially visible control (v0.55.1)
- a chip is one token and its parts do not separate, gap #121
- a layout primitive stops clipping, and a thumb bar stops charging desktop (v0.52.0), gaps #114-#115
- alerts on dark live in one place, not two (v0.50.1)
- the opaque background fell back to a token that does not exist (v0.49.1, gap #104)

### Documentation
- css architecture and component patterns, and the docs that point at them
- tighten the wording of the type-scale note
- three gaps from the event-screen parity build
- #101, Dialog's Escape binding and the unit test that cannot see it

## [0.47.1] - 2026-08-13

### Fixed
- an icon-only control is a shape, not a word (v0.47.1, gap #100)

## [0.47.0] - 2026-08-13

### Added
- the bar spans its parent, destinations hold, and 14.7's floor follows the pointer (v0.47.0, gaps #93-#99)

### Fixed
- delete two rules that fought each other and the consumer

## [0.46.1] - 2026-08-12

### Fixed
- release must measure the bundle it publishes (v0.46.1)

## [0.46.0] - 2026-08-12

### Added
- AppShell and the four screen primitives (v0.46.0, gaps #91-#92)

## [0.45.0] - 2026-08-12

### Fixed
- a shipped heading at 1.23:1, and the compositional check that finds them (v0.45.0, gaps #89-#90)

## [0.44.0] - 2026-08-12

### Added
- FeatureSurface, and 9.3 admits two dark surface roles (v0.44.0, gap #88)

## [0.43.0] - 2026-08-12

### Added
- sticky, scroll-row and the split grid; overflow:clip so sticky works inside a grid (v0.43.0, gaps #85-#87)

## [0.42.0] - 2026-08-12

### Added
- the size budget becomes three gated numbers (v0.42.0, gap #84)

## [0.41.0] - 2026-08-12

### Added
- map primitives as components; fixedWeeks; the spec gets a contrast gate (v0.41.0, gaps #79-#83)

## [0.40.0] - 2026-08-12

### Added
- grid sidebar preset; correct 7 fill-tier-as-text prescriptions in the DL (v0.40.0, gaps #77-#78)

## [0.39.0] - 2026-08-12

### Added
- CalendarGrid; 10.6 bounded cells and the well-plate production (v0.39.0, gaps #75-#76)

## [0.38.0] - 2026-08-12

### Added
- TabBar and SearchTrigger; 19.1.1 settles which mobile nav a surface takes (v0.38.0, gaps #73-#74)
- SearchField, responsive visibility, progress on dark (v0.37.0, gaps #69-#72)

### Fixed
- commit SearchField's source, which v0.37.0 exported and never shipped
- release ceremony can bump a minor; SearchField is (v0.37.0), not a patch

## [0.36.9] - 2026-08-11

### Added
- strand-flex-none, the shrink-proof pair of flex-1 (v0.36.9)

## [0.36.8] - 2026-08-11

### Added
- strand-truncate utility, single-line ellipsis (v0.36.8)

### Changed
- pnpm release, the whole ceremony in one command

## [0.36.7] - 2026-08-11

### Fixed
- dialog focus moves without moving the page (v0.36.7)

### Documentation
- component-count markers 49 to 51 (same build:docs refresh; ActionDock and CommandPalette were missing from every count surface)
- refresh generated reference and changelog to HEAD (stale since 0.34.0; CI regenerated at publish so npm was fresh while the tree lied)

## [0.36.6] - 2026-08-11

### Fixed
- the palette sheds Dialog's prose padding and its orphan close button (v0.36.6)

## [0.36.5] - 2026-08-11

### Fixed
- the scroll lock stops trusting an inert gutter, and the palette drops to instrument scale (v0.36.5)

## [0.36.4] - 2026-08-11

### Added
- every shipped component has a test, and ActionDock stops losing its class in Svelte (v0.36.4, gap #68)

## [0.36.3] - 2026-08-11

### Fixed
- dialogs stop shifting the page, and the palette earns its density (v0.36.3)

## [0.36.2] - 2026-08-11

### Fixed
- the palette's secondary text failed AA on the highlighted row (v0.36.2)

## [0.36.1] - 2026-08-11

### Fixed
- the command palette could not be typed into (v0.36.1)

### Documentation
- record gap #67, the two pipelines that disagree about a component

## [0.36.0] - 2026-08-11

### Added
- CommandPalette reaches consumers, and CSS can no longer ship without it (v0.36.0, gap #67)
- a target you can reach, not merely one you can hit (v0.35.0, gap #66)
- Settle, the moment a state change lands (v0.34.0, gap #65)
- the layout tier can assert where a box is, not only how big
- a browser layout tier, because jsdom does not lay out (gap #64)

### Changed
- regenerate the changelog, which reads the git log it is committed beside
- regenerate the agent surfaces, which Reserve left stale
- regenerate agent surfaces missed by 0.33.0

### Fixed
- publish could not run the browser tiers, so nothing reached npm
- build:docs raced itself, so every release shipped a stale llms-full.txt
- commit the half-built CommandPalette, which was breaking every local build

### Documentation
- three corrections to the layout tier, all found by its consumers

## [0.33.0] - 2026-08-10

### Fixed
- Reserve can collapse when the answer is nothing (v0.33.0, gap #63)

## [0.32.1] - 2026-08-10

### Documentation
- document Reserve for the CSS-only and Bootstrap consumers (v0.32.1, gap #62)

## [0.32.0] - 2026-08-10

### Added
- Reserve, a region that holds its box while data loads (v0.32.0, gap #62)

## [0.31.0] - 2026-08-10

### Added
- the wordmark and the tabs answer the pointer (v0.31.0)

## [0.30.0] - 2026-08-10

### Added
- a skip link that actually reveals, and focus indicators you can see (v0.30.0)

## [0.29.0] - 2026-08-10

### Fixed
- resolve the 4px-grid contradiction, and cap the one uncapped text in the language (v0.29.0)

## [0.28.2] - 2026-08-10

### Documentation
- the reduced-motion emulation a test author reaches for does nothing (v0.28.2)

## [0.28.1] - 2026-08-10

### Fixed
- grouped reveals ignored prefers-reduced-motion entirely (v0.28.1)

## [0.28.0] - 2026-08-10

### Fixed
- an on-color is a guarantee at a text size, not an unconditional one (v0.28.0)

## [0.27.2] - 2026-08-10

### Fixed
- give the log and bar-chart readouts an on-dark rule (v0.27.2)

## [0.27.1] - 2026-08-10

### Changed
- run the whole gate in CI and before publish

### Fixed
- stamp the real version into every shipped banner (v0.27.1)

### Documentation
- regenerate after documenting strand-stack--gap-0

## [0.27.0] - 2026-08-10

### Added
- self-hosted variable faces + a text tier for the palette (v0.27.0)

## [0.26.0] - 2026-08-09

### Changed
- font-display swap on the metric-matched fallbacks (v0.26.0)

### Fixed
- font-display swap on the metric-matched fallbacks so they cannot block first paint (v0.26.0)

## [0.25.0] - 2026-08-09

### Added
- carry form-control labels on the dark viewport (v0.25.0)

### Changed
- carry form-control labels on the dark viewport (v0.25.0)

## [0.24.0] - 2026-08-09

### Added
- light-island colors as a utility, and complete the restore (v0.24.0)

### Changed
- light-island colors utility + complete the restore (v0.24.0)

## [0.23.0] - 2026-08-09

### Added
- metric-matched font fallbacks + reserved nav slot for layout stability (v0.23.0)

### Changed
- strand layout stability (metric-matched font fallbacks + reserved nav slot, v0.23.0)

## [0.22.1] - 2026-08-09

### Fixed
- give the alert an on-dark treatment on the instrument viewport (dogfood gap #47)

## [0.22.0] - 2026-08-09

### Added
- Button renders as an anchor (href/as) for links and CTAs styled as buttons
- Stack supports a zero gap (strand-stack--gap-0)
- orthogonal Card interactive/active state props, Link inherit variant, and polymorphic as prop on Card/Stack/Container/Section

### Changed
- v0.22.0 (Stack gap-{n}/gap-0/as, Card interactive/active/flat/warm/pad-xl/as/elevated-base, Link inherit, Button anchor, Container/Section as)
- refresh parity-manifest byte sizes (strand-stack--gap-0 CSS)

### Fixed
- Card elevated is the base surface (no redundant strand-card--elevated modifier emitted)
- Stack emits the strand-stack--gap-{n} primitive class, never an inline gap style

## [0.21.0] - 2026-08-09

### Added
- instrument dark-context cascade + margin-zero and stacked-alert utilities (v0.21.0, dogfood gap #46)
- utility pack for Weekly Ship Path-A purity (v0.20.0, dogfood gap #45)
- add strand-nowrap one-line data-atom utility
- add green-positive-deep token + strand-value financial tone utility
- make the fleet dashboard live
- lead each agent with its value proposition

### Fixed
- value tone color wins the cascade wherever composed

### Documentation
- regenerate HTML_REFERENCE for utility pack + value/nowrap utilities

## [0.19.0] - 2026-06-22

### Added
- add minColWidth for responsive auto-fit tracks

### Changed
- v0.19.0

## [0.18.1] - 2026-06-10

### Fixed
- ref example grid tracks use minmax(0, 1fr) so composed wide content cannot escape the viewport

## [0.18.0] - 2026-06-09

### Added
- add strand-break-anywhere wrap utility
- add strand-text-sm and strand-text-xs size utilities

### Changed
- remove strand-w-full duplicate, document Stack header-row fill recipe (v0.18.0)
- v0.18.0
- remove duplicate strand-w-full width utility, use strand-full-width

### Documentation
- consolidate dogfood gap logs into docs/dogfood-gaps.md
- document the header-row fill recipe with strand-full-width

## [0.17.7] - 2026-06-06

### Added
- strand-prose styles formatted descendants (lists, inline code, links); v0.17.7

## [0.17.6] - 2026-06-03

### Changed
- Merge fix/strand-reveal-manual-visible into main

### Fixed
- manual reveal toggled visible must beat the view-timeline base rule

## [0.17.5] - 2026-06-03

### Changed
- Merge fix/strand-lab-shell-mobile-gutters into main

### Fixed
- shrink main grid track so mobile gutters stay symmetric
- replayable reveal, centered alert, proportional bar-chart track
- label color gray-500 to gray-600 for WCAG 2.2 AA contrast
- author async-load guidance in source, sync all consumers

## [0.17.4] - 2026-04-21

### Added
- publish gzipped bundle size in parity-manifest + async-load guidance

## [0.17.3] - 2026-04-20

### Fixed
- inner inherits min-height so children center vertically on mobile

## [0.17.2] - 2026-04-20

### Fixed
- mobile menu docks below nav (was viewport top) + logo flex-aligns center

## [0.17.1] - 2026-04-20

### Fixed
- height tracks viewport minus sticky-top + mobile drawer pattern

## [0.17.0] - 2026-04-20

### Added
- add component-reference primitive family + dark-surface cascades + card/kv additions

### Changed
- Merge branch 'feat/strand-ref-primitives'

## [0.16.1] - 2026-04-19

### Added
- add strand-status-chip--committed variant
- add strand-font-mono utility class
- add StarRating primitive across all consumer types
- add vanilla runtime, :has() cross-browser fallbacks, dvh fallback
- world-class Agents tab with rich composite table cells

### Changed
- fix/tooltip-layout-containment (DS calendar subscribe consumer)
- feat/strand-status-chip-committed (DS WS committed chip consumer)
- feat/strand-star-rating (DS WS email lifecycle + rate-via-token consumer)
- feat/strand-font-mono-utility (DS WS hero cadence consumer)
- opt workflows into Node 24 + idempotent release step
- vanilla runtime and :has() cross-browser fallbacks
- rebuild showcase with published 0.15.2 (all L2 fixes live)

### Fixed
- strand-channel-grid stretches cards equal height and anchors last horizontal row (CTA) to bottom
- contain tooltip layout to wrapper so popup does not bloat ancestor scrollWidth
- glass nav height, ghost button contrast, tab overflow, scroll-padding
- restore DOGFOOD_GAPS.md template and append :has() gap entries
- use relative base path for showcase builds
- increase glass-bg opacity from 0.72 to 0.85 for WCAG 2.2 AA contrast over dark backgrounds

## [0.15.2] - 2026-04-11

### Added
- add zero-drift documentation generator system
- add zero-drift documentation generator system

### Changed
- bump to 0.15.2 — triggers fresh publish with prepack build
- commit generated docs from prior session
- reorganize repo root into docs/ and generated/ directories
- regenerate docs to include reorganization commit in changelog
- reorganize repo root into docs/ and generated/ directories

### Fixed
- iteration 7 — publish pipeline, spacing first principles, log typography
- iteration 6 — mobile-first responsive, scaffold mandates, pre-submission audit
- iteration 5 — single-section layout, value stream data, full composition fix
- add product design mandate to scaffold template
- iteration 4 — L2 default padding and bar chart fixes
- iteration 3 gaps #11-13 — layout, activity feed, dist build
- iteration 3 — L2 library fixes + version sync to 0.15.1
- resolve 6 gaps from agent-dashboard iteration 1

## [0.15.1] - 2026-04-09

### Added
- add Vite + Preact starter template
- add AGENTS.md, llms.txt, and migration guides to scaffold reading list
- add agent consumption infrastructure (AGENTS.md, llms.txt, registry.json)
- add build-agent-surfaces script with tests
- add Vite + Preact starter template
- add AGENTS.md, llms.txt, and migration guides to scaffold reading list
- strand-nav__slot + strand-section--hero-compact primitives (v0.15.0)

### Changed
- bump strand packages to 0.15.1
- generate initial agent surface files

### Fixed
- bump nav slot margin from space-6 to space-8 for visual breathing room

### Documentation
- add JSDoc summaries and @example blocks to all components
- add JSDoc summaries and @example blocks to all components
- restructure for MECE with generated sections
- add AGENTS.md for AI coding agent consumption
- propagate strand-nav__slot + strand-section--hero-compact to package HTML_REFERENCE

## [0.15.0] - 2026-04-08

### Added
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

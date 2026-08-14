# Strand Dogfood Gaps Log

This file is an append-only record of every dogfood iteration and every gap discovered. Each gap is classified L1 (usage), L2 (library), or L3 (design language) per `docs/dogfood-protocol.md`. The record is public because it is evidence of Strand's quality discipline and a learning resource for external consumers.

## Entry format

```
## Showcase: <name> - iteration <N>
Date: YYYY-MM-DD
Verdict: PASS | FAIL

### Gap #<n>
- Type: L1 | L2 | L3
- Symptom: what the reviewer saw
- Root cause: why it happened
- Fix: what was done
- Commit: <sha or PR link>
```

## Log

## Showcase: agent-dashboard — iteration 1
Date: 2026-04-09
Verdict: FAIL

### Gap #1
- Type: L1
- Symptom: Dashboard hero section consumes most of the viewport with whitespace. All operational data (tabs, agent roster, activity log) is below the fold. The page feels like a marketing landing page, not an analytical readout panel.
- Root cause: Agent used `Section variant="hero"` for the top section. Per Principle 10 (Instrument Principle), a dashboard maps to "analytical readout panel" — it should use `variant="compact"` to surface data immediately. The primitives exist; the agent chose the wrong one.
- Fix: Enhanced Dashboard page recipe in `generated/html-reference.md` with explicit guidance: dashboards use `--compact`, never `--hero`. Added Instrument Principle mapping. Showcase updated to `variant="compact"`.
- Commit: iteration-2

### Gap #2
- Type: L1
- Symptom: Overline ("AGENT OPERATIONS") and headline ("DASHBOARD") are center-aligned, but the lead text is left-aligned within the same section header group. Visual alignment is inconsistent.
- Root cause: Agent applied centering to the overline and headline but did not apply `strand-text-center` to the lead or its container. The `strand-lead` class defaults to left-align with `max-width: 50ch`. The `strand-section-header` + `strand-text-center` composition pattern exists but was not used.
- Fix: Added centered section header composition to Dashboard recipe in `generated/html-reference.md` showing `strand-section-header strand-text-center` wrapping overline + headline + lead. Showcase updated to use this pattern.
- Commit: iteration-2

### Gap #3
- Type: L1
- Symptom: All 6 agent roster cards have identical visual weight. No card is visually dominant. The grid is a "parts bin, not an instrument" per Principle 2 (Biosynthetic Restraint) hierarchy test.
- Root cause: Agent rendered every agent card with the same variant, padding, and size. A world-class designer would establish hierarchy: feature the most critical agent (or the one in error state) as a larger/different-variant card, or use a different layout that creates a natural focal point.
- Fix: Added focal hierarchy guidance to Dashboard recipe: separate attention-requiring items above the grid, use card variants and padding tiers to differentiate. Showcase updated: error agents rendered as featured `--outlined` cards with `padding="lg"` above the healthy agent grid.
- Commit: iteration-2

### Gap #4
- Type: L2
- Symptom: Bar chart renders at 96px total height within a half-width card. Bars are extremely squat with minimal height variation. The card is mostly empty space below the chart. The visualization fails to communicate data magnitude.
- Root cause: `strand-bar-chart` in `static.css` has a fixed `height: var(--strand-space-24)` (96px) with no size modifier classes. A world-class designer cannot change the chart height without custom CSS, which violates the purity constraint. No `strand-bar-chart--sm`, `--md`, or `--lg` modifier exists.
- Fix: Added `strand-bar-chart--sm` (96px), `--md` (160px), `--lg` (192px) to `packages/strand-ui/src/static.css`. Verified propagation to all three consumer CSS bundles: strand-ui, strand-vue, strand-svelte. Added size modifiers to `generated/html-reference.md` global class table. Showcase updated to use `--md`.
- Commit: iteration-2

### Gap #5
- Type: L1
- Symptom: Agent table "STATUS" column renders raw text ("active", "idle", "error") without color-coded visual differentiation. Status is the highest-signal column in an agent roster but has the weakest visual treatment.
- Root cause: Agent passed string values into the Table `data` prop. The Table component renders `{row[col.key]}` which accepts Preact VNodes, so JSX nodes (StatusChip, Tag, Badge) could have been passed as cell values. The agent did not know this was possible.
- Fix: Added rich table cell guidance to Dashboard recipe in `generated/html-reference.md` with note that Table renders any value type including JSX. Showcase updated: status column passes `<StatusChip>` JSX nodes.
- Commit: iteration-2

### Gap #6
- Type: L1
- Symptom: "Deploy Agent" button in the Agents tab dominates the viewport with primary blue fill, competing with the agent table for visual attention. The table is the primary content; the button is a secondary action.
- Root cause: Agent used `variant="primary"` for a supporting action. Per Principle 2 hierarchy test, each composition has exactly one primary element. In this tab, the table is primary. The deploy button should use `variant="secondary"` or `variant="ghost"` to subordinate itself.
- Fix: Added button variant selection guidance to Dashboard recipe in `generated/html-reference.md`: one primary per page, supporting actions use `--secondary` or `--ghost`. Showcase updated to `variant="secondary"`.
- Commit: iteration-2

## Showcase: agent-dashboard — iteration 2
Date: 2026-04-11
Verdict: FAIL

### Gap #7
- Type: L2
- Symptom: Glass nav (`strand-nav--glass`, position: fixed) overlaps the first section content. The overline text "AGENT OPERATIONS" is visually cut off behind the nav bar. Any page using glass nav has this problem.
- Root cause: No utility class exists to offset content below a fixed glass nav. The Section component's padding variants do not account for fixed nav height. Consumers cannot solve this without inline styles (which violate Strand's rules) or guessing pixel offsets.
- Fix: Added `strand-nav-offset` utility class to `static.css` (`padding-top: var(--strand-space-16)`). Documented in `generated/html-reference.md` global utilities table. Verified in all three consumer CSS bundles (strand-ui, strand-vue, strand-svelte). Showcase applies it to the first content section below the glass nav.
- Commit: iteration-3

### Gap #8
- Type: L1
- Symptom: Agent cards look generic and flat — described as "toy-ish" and resembling "index flash cards" rather than precision instrument panels. Avatars with two-letter initials add no value to an operational dashboard. The Tag component ("QA") is ambiguous without context. The "ERROR" status chip has no diagnostic detail. Cards have too much whitespace and too little information.
- Root cause: Showcase used avatars (a contacts-app pattern, not an instrument-panel pattern), generous padding, and thin mock data with no operational context. A dashboard is an analytical readout panel per Principle 10 — every element must carry operational information. The primitives for density exist (`padding="sm"`, `strand-kv`, `strand-text-secondary--xs`, `strand-glass-surface`) but were not composed for instrument-grade output.
- Fix: Removed avatars from agent cards. Switched to `padding="sm"` with `gap={2}` for tighter density. Added `strand-glass-surface` to agent cards for the frosted-glass instrument feel. Replaced generic Tag labels with descriptive role text (`strand-text-secondary`). Added current task, cost, and tokens to every agent card via `strand-kv` rows. Error card now shows the actual error message, failure timestamp, processing context, and consecutive failure count.
- Commit: iteration-3

### Gap #9
- Type: L1
- Symptom: Bar chart rendered at default 96px height despite the `strand-bar-chart--md` modifier being applied in code. Bars appeared flat and squat, identical to iteration 1.
- Root cause: The showcase loaded CSS from the published CDN (`@0.15.0`) which does not contain the `--md` modifier added in the L2 fix. The modifier exists in the source but was not yet published to npm. The showcase's `index.html` used CDN `<link>` tags instead of JS imports from `node_modules`.
- Fix: Switched showcase CSS loading from CDN `<link>` tags to JS imports in `main.tsx` (standard Vite/bundler pattern). The showcase now imports `@dillingerstaffing/strand/css/tokens.css`, `reset.css`, `base.css`, and `@dillingerstaffing/strand-ui/css/strand-ui.css` via the documented import paths. This is the pattern documented in AGENTS.md and README.md. The bar chart modifier takes effect after 0.15.1 is published and consumed.
- Commit: iteration-3

### Gap #10
- Type: L1
- Symptom: Showcase lacked product design depth. The dashboard displayed generic mock data (agent names, task counts, percentages) without modeling a realistic end-user value stream. A real operator viewing this dashboard could not make a decision or take an action based on the information shown. The visual design did not leverage the two-environment principle (dark synthetic instruments + light natural facility) described in the design language specification.
- Root cause: The showcase was composed as a layout exercise (arrange components on screen) rather than a product design exercise (what does a fleet operator need to see, know, and do?). Strand's surface treatment primitives (`InstrumentViewport`, `strand-glass-surface`, `strand-card--warm`) that create the specified aesthetic were not used.
- Fix: Redesigned showcase as a realistic agent fleet operations dashboard. Data model includes: agent roles, current task descriptions, per-agent cost/tokens, P95 latency, throughput. Error agents show schema-level diagnostic messages, failure timestamps, processing context, consecutive failure counts, and recovery actions. KPI strip uses `InstrumentViewport` with grid overlay (dark synthetic instrument surface) for the four fleet-level readouts. Agent cards use `strand-glass-surface` (frosted glass). System diagnostics card uses `strand-card--warm` (warm wood resonance). This composes both environments specified in the design language: synthetic instruments on dark surfaces and frosted panels in the light facility.
- Commit: iteration-3

### Gap #11
- Type: L1
- Symptom: Activity log feed renders as a plain list of text rows inside a standard light-surface card. It does not achieve the real-time instrument-panel feel specified in the design language. The log looks like a generic admin panel, not a live diagnostic terminal in a precision facility.
- Root cause: The showcase composed the log inside an elevated card on the light surface. Per the two-environment principle (design-language.md Part I), a live diagnostic feed is an instrument — it belongs on a dark synthetic surface (`InstrumentViewport`), not a light facility surface. The primitives exist (`InstrumentViewport`, `strand-scanline--ambient`, `strand-log`) but were composed in the wrong environment.
- Fix: Activity feed composed inside `InstrumentViewport` with `strand-scanline--ambient` overlay. Log entries render on the dark surface, placing the feed in the correct environment per the design specification.
- Commit: iteration-3

### Gap #12
- Type: L1
- Symptom: Massive dead space between the warning alert and the tab content. The area between the alert and the "Overview / Agents / Activity Log" tabs is an empty canyon of unused viewport. A dashboard should have zero wasted pixels — every vertical inch should be data or purposeful structural whitespace (Principle 6: Compound Silence). This gap is neither.
- Root cause: The showcase used two separate `Section` components stacked vertically — one `variant="compact"` for the alert, one `variant="standard"` for the tabs. Each Section applies its own padding (`clamp(4rem, 8vw, 8rem)` for standard), so the transition between them doubles the vertical space. A world-class dashboard consolidates content into a single section.
- Fix: Merged alert and tabs into a single `Section variant="compact"` with a `Stack gap={4}` containing both. Eliminates the double-padding gap entirely.
- Commit: iteration-3

### Gap #13
- Type: L2
- Symptom: Bar chart bars all appear the same height despite values ranging from 280 to 720 (3rd+ report of this issue). The visual difference between bars is imperceptible. The chart fails to communicate data magnitude.
- Root cause: Deep audit of the CSS pixel budget: container height 96px - 40px padding - 17px amount label - 17px axis label - 8px gaps = **14px** maximum bar height, with only **10px dynamic range** (14px minus 4px min-height). At that scale, a 2.5:1 data ratio (720 vs 280) produces a bar height difference of ~6px — below the threshold of useful visual differentiation. Adding a `--md` modifier was insufficient because Principle 8 (Default Philosophy) requires that zero-customization output be premium. The DEFAULT height must produce readable bars.
- Fix: Changed default `strand-bar-chart` height from `var(--strand-space-24)` (96px) to `var(--strand-space-40)` (160px). Reduced padding from `space-5` (20px) to `space-4` (16px) for more bar area. At 160px: 128px content area, ~86px for bars, ~82px dynamic range — bars now clearly differentiate. Removed `--md` modifier (now the default). Retained `--sm` (96px) for compact contexts and `--lg` (192px) for large displays.
- Commit: iteration-4

### Gap #14
- Type: L2
- Symptom: `InstrumentViewport` has zero default padding. Text and child content sit directly against the dark (#0F192A) edge. The extreme contrast ratio (22.4:1) makes the tight spacing psychologically worse — text appears to press against the rounded border. Visible in both the agent-dashboard showcase and the JOBINT Lab production application.
- Root cause: The `.strand-instrument-viewport` CSS class has no `padding` property. Light-surface components (Card, Viewport) have 24px default padding and pass Principle 8. The dark instrument surface was shipped without it. This violates Principle 8: a developer using InstrumentViewport at default settings gets text touching edges.
- Fix: Added `padding: var(--strand-space-6)` (24px) to `.strand-instrument-viewport` in `InstrumentViewport.css`. Matches the Card component's default padding tier (md = 24px). Future agents composing content inside InstrumentViewport will get adequate spacing at zero customization.
- Commit: iteration-4

### Gap #15
- Type: L2
- Symptom: `strand-log` entries have only 8px vertical padding and zero horizontal padding. When rendered inside InstrumentViewport or any container, log text is flush with the left and right edges. Timestamps and status labels press against container borders.
- Root cause: `.strand-log` used `padding-block: var(--strand-space-2)` with no `padding-inline`. The 8px block padding is also less than the text line height (17px), creating visual compression.
- Fix: Changed to `padding: var(--strand-space-2) var(--strand-space-4)` — 8px vertical, 16px horizontal. Provides adequate breathing room within any parent container.
- Commit: iteration-4

### Gap #16
- Type: L2
- Symptom: `strand-kv` rows have only 8px vertical padding and zero horizontal padding. Labels and values sit flush against container edges, especially visible on dark surfaces where high contrast amplifies the cramped feeling.
- Root cause: `.strand-kv` used `padding-block: var(--strand-space-2)` with no `padding-inline`. Same structural deficiency as strand-log.
- Fix: Changed to `padding: var(--strand-space-2) var(--strand-space-4)` — 8px vertical, 16px horizontal.
- Commit: iteration-4

### Gap #17
- Type: L1
- Symptom: Showcase metrics (P95 latency, throughput, cost) are disconnected from any legitimate end-user value stream. The data is plausible-looking but doesn't map to real decisions an agent fleet operator would make. The dashboard should demonstrate a value stream synthesized from first-principles analysis of what operators of autonomous agent systems actually need.
- Fix: Dashboard recipe in `generated/html-reference.md` should mandate that showcase data model be grounded in a real value stream — every visible metric must trace to an operator decision or action. Showcase data redesigned around operator decision model: "Is the system healthy? → What broke? → What do I do?"
- Commit: iteration-4

## Showcase: agent-dashboard — iteration 6
Date: 2026-04-11
Verdict: FAIL

### Gap #18
- Type: L1
- Symptom: InstrumentViewport KPI panel clips DataReadout values on mobile (375px). "720/hr" truncated at right edge. Four `size="lg"` readouts (48px text) cannot fit in a horizontal row at mobile widths. No content wraps; the layout assumes desktop-width viewports throughout.
- Root cause: Showcase used fixed `Stack direction="horizontal"` without the `strand-stack--responsive` modifier that collapses to vertical at 768px. Used `DataReadout size="lg"` which produces 48px text regardless of viewport width. No responsive considerations in any layout across any tab.
- Fix: (1) KPI readouts use `strand-stack--responsive` CSS classes so they wrap to vertical on mobile. Switched DataReadout to `size="sm"` which fits at all widths. (2) Agent card grid uses `strand-grid--auto-md` (auto-fit, 280px min) instead of fixed `columns={3}`. (3) System/chart grid also uses auto-fit. (4) All horizontal Stacks with content use `wrap` prop. These are Strand-native responsive primitives that existed but were not used.
- Commit: iteration-6

### Gap #19
- Type: L1
- Symptom: No layout in the showcase is mobile-friendly. Grids use fixed column counts that break on narrow viewports. Tables have no responsive wrapper. The design was built desktop-out instead of mobile-first.
- Root cause: The scaffold launch prompt had no responsive design mandate. Agents build for the viewport they happen to be thinking about (typically desktop). Without an explicit mobile-first requirement, responsive behavior is always an afterthought that gets missed.
- Fix: Added "Responsive design (non-negotiable)" section to `scripts/dogfood-scaffold.mjs`. Mandates: (1) design for 375px first, (2) use auto-fit grids not fixed columns, (3) use responsive stacks, (4) test at 375/768/1280 before submitting. Also added "Pre-submission audit (mandatory)" section requiring visual audit at all three breakpoints before writing SHOWCASE.md. This ensures ALL future agents for ANY showcase topic build mobile-first.
- Commit: iteration-6

### Gap #20
- Type: L1
- Symptom: Activity log tab renders as a plain white card with text rows. Does not meet the cinematic design standard specified in the design language. Looks generic and low-effort compared to the InstrumentViewport-based KPI panel.
- Root cause: Iteration 5 moved the activity log from InstrumentViewport back to a glass-surface card based on a two-environment audit recommendation. However, the design language Part I describes a live diagnostic feed as an instrument: it belongs on the dark synthetic surface. The user's aesthetic standard requires the cinematic terminal feel that only InstrumentViewport provides.
- Fix: Activity log restored to InstrumentViewport with `strand-scanline--ambient` overlay. Log entries render on the dark surface with tight spacing (gap={1}). The dark terminal aesthetic matches the cinematic standard.
- Commit: iteration-6

### Gap #21
- Type: L1
- Symptom: Gap analysis iterations repeatedly miss issues that should have been caught proactively. The pattern: fix specific reported problems → miss related problems in other views/viewports/states → user reports again → repeat. This "outcome theater" pattern wastes reviewer time and signals shallow quality discipline.
- Root cause: No pre-submission self-audit step existed in the dogfood protocol. The agent builds, sees that it compiles, and ships. There is no checkpoint that forces the agent to systematically verify every view at every viewport width before declaring done.
- Fix: Added "Pre-submission audit (mandatory)" section to the scaffold template. Requires visual audit at 375px, 768px, and 1280px across every tab and every state before writing SHOWCASE.md. This converts the self-audit from optional to structurally required.
- Commit: iteration-6

## Showcase: agent-dashboard — iteration 7
Date: 2026-04-11
Verdict: FAIL

### Gap #22
- Type: L2
- Symptom: Bar chart bars are visually identical height despite having values from 280 to 720. This is the 5th+ report of this issue. Source CSS has been fixed (`height: var(--strand-space-40)`) but the published npm package `@dillingerstaffing/strand-ui@0.15.1` still ships with `height: var(--strand-space-24)` (96px). The `--sm` and `--lg` modifiers are also missing from the published dist.
- Root cause: The publish pipeline ships pre-existing `dist/` artifacts without rebuilding from source. The `dist/` directory is gitignored so commits to `src/static.css` never reach the published CSS bundle. No `prepack` script exists to ensure `npm publish` builds from source first.
- Fix: Added `"prepack": "pnpm run build"` to `package.json` for strand-ui, strand-vue, and strand-svelte. This ensures `npm publish` (triggered by the push-to-publish pipeline) always rebuilds dist from current source before packaging. The bar chart default height (160px), size modifiers, nav-offset, and all other L2 CSS fixes will now propagate to published packages.
- Commit: iteration-7

### Gap #23
- Type: L2
- Symptom: `InstrumentViewport` padding is 24px (space-6) — the same as light-surface cards. On the dark #0F192A surface, this creates a "card with empty space" feel rather than a "dense instrument panel" feel. The padding-to-text ratio (2.16x) is higher than any reference dark-mode instrument UI. Text labels like "AGENT OPERATIONS" appear to float in dead space rather than being precisely placed.
- Root cause: The viewport was given the default card padding tier (md=24px) without accounting for the perceptual difference between dark and light surfaces. Dark backgrounds amplify perceived tightness (Weber's Law), so the same padding that feels correct on white feels excessive on dark. Instrument UIs (terminals, IDE panels, mission control) use padding-to-text ratios of 1.2-1.8x, not 2.16x.
- Fix: Changed InstrumentViewport default padding from `var(--strand-space-6)` (24px) to `var(--strand-space-5)` (20px). Ratio drops to 1.80x — still generous by instrument standards but tighter than card default. Added dark-surface descendant overrides for `strand-kv__label` (gray-400) and `strand-kv__value` (gray-200) to ensure readability on #0F192A.
- Commit: iteration-7

### Gap #24
- Type: L2
- Symptom: Activity log entries look like "a child bolded some words in a word document." The description text (agent name + action) has no CSS class — it renders as an unstyled browser-default `<span>` inheriting Inter at ~16px, while the timestamp and status label use JetBrains Mono at 11.1px. This creates a jarring font mismatch, size mismatch, and baseline misalignment within the same row.
- Root cause: The `strand-log` CSS defines `__time` and `__status` children but has no class for the description text. The HTML reference documents the time and status classes but provides no guidance for the description element. Future agents writing log entries will always produce the same unstyled mismatch.
- Fix: Added `.strand-log__text` class to `static.css` (mono, text-xs, gray-300, normal leading). Added `.strand-log__text strong` (semibold, gray-100) for agent name emphasis. Added `align-items: baseline` to `.strand-log` for correct text alignment. Documented in `generated/html-reference.md`. Showcase updated to use the new class.
- Commit: iteration-7

### Gap #25
- Type: L2
- Symptom: `strand-kv__value` uses `gray-600` — nearly identical luminance to `strand-kv__label` at `gray-500`. The label-value hierarchy is visually flat: both look the same weight and brightness. On dark surfaces inside InstrumentViewport, both grays become unreadably dim.
- Root cause: The color differential between label (gray-500) and value (gray-600) is only ~0.5 contrast ratio stops. Insufficient to create the "question → answer" visual hierarchy that instrument panels require.
- Fix: Changed `strand-kv__value` color from `gray-600` to `gray-700` for wider luminance differential on light surfaces. Added `text-align: right` for explicit alignment (not just flex-inferred). Added dark-surface overrides via `.strand-instrument-viewport .strand-kv__label` (gray-400) and `.strand-instrument-viewport .strand-kv__value` (gray-200).
- Commit: iteration-7

## Production consumer: dillingerstaffing.com - Weekly Ship email lifecycle
Date: 2026-04-19
Verdict: PASS (after L2 primitive addition)

### Gap #26
- Type: L2
- Symptom: Weekly Ship page-local custom StarRating in ShipInteractive.js and a new server-rendered rate-via-token page both needed a star rating control. No Strand primitive existed, so consumers were rolling their own markup + CSS.
- Root cause: Library gap. StarRating is a common form pattern; absence of a primitive forced each consumer to re-implement the interaction, accessibility, and size tokens.
- Fix: Added L2 StarRating primitive across every framework (Preact/React, Svelte, Vue) + vanilla runtime hydration for `[data-strand-component="star-rating"]`. Added to parity-manifest.json so every consumer type must ship it in lockstep. Three sizes (sm/md/lg), readOnly prop, aria-label required, keyboard + click + hover parity with the old JSX version. Version bumped 0.15.2 to 0.16.0.
- Commit: feat/strand-star-rating

## Production consumer: dillingerstaffing.com - Weekly Ship post-RSVP commitment chip
Date: 2026-04-19
Verdict: PASS (after L2 variant addition)

### Gap #27
- Type: L2
- Symptom: Weekly Ship's featured event card has no visual confirmation that a signed-in user has already RSVP'd. The card always shows the "Next Ship" overline whether the user is committed or not. A post-RSVP affirmation block renders elsewhere on the page, but the focal card itself never reflects the commitment. Reason: Weekly Ship post-RSVP commitment chip. The existing `strand-status-chip` variants (`--live`, `--neutral`, `--accent`, `--caution`) do not express an earned-state commitment inside a dark instrument viewport.
- Root cause: StatusChip lacked a "committed" variant tuned for the dark instrument viewport. Teal-tint (the existing `--live` fill) is designed for light surfaces: on a near-black background it loses contrast ratio because both fill and text tokens assume a light card. A post-RSVP chip needs saturated teal text on a translucent teal fill so it reads clearly on dark without overpowering the event title (Principle 2, Biosynthetic Restraint). No primitive existed for this role.
- Fix: Added `.strand-status-chip--committed` variant to `static.css`. Uses `--strand-teal-vital` for text, `color-mix(in srgb, var(--strand-teal-vital) 16%, transparent)` for fill, and `color-mix(in srgb, var(--strand-teal-vital) 30%, transparent)` for border. Translucent composition keeps the chip readable on both dark instrument viewports and light surfaces. Documented in `generated/html-reference.md` and `scripts/data/class-docs.json`. All 8 consumer types inherit via the existing utility-class pipeline (same static.css bundle, same tokens package).
- Commit: feat/strand-status-chip-committed

## Production consumer: dillingerstaffing.com — Weekly Ship event-link share field
Date: 2026-06-07
Verdict: PASS (after L2 primitive addition)

### Gap #28
- Type: L2
- Symptom: The Weekly Ship event-link control (`ShareButton`, rendered in three places: the featured event card, every archive entry, and the post-RSVP affirmation) shows the share URL in a readonly mono input at `--strand-text-base` (16px). A real production URL (`https://dillingerstaffing.com/labs/weekly-ship/event/<slug>`, ~60-67 chars) overflows the field next to the trailing copy button, so the link is visually cut off in all three locations.
- Root cause: Library gap. To shrink the value with a Strand primitive, the only sub-base sizes were `.strand-text-secondary` (size `text-sm` but ALSO forces `gray-500`) and `.strand-text-secondary--xs` (a compound modifier of secondary). There was no pure, color-agnostic size utility, so a consumer could only shrink the URL by also demoting it to muted "secondary/metadata" gray — semantically wrong for a primary, selectable link, and a workaround rather than a correct composition. The type-scale tokens (`--strand-text-sm`, `--strand-text-xs`) already existed in `docs/design-language.md` Part IV, so no spec change was required (L2, not L3).
- Fix: Added pure single-property size utilities `.strand-text-sm` and `.strand-text-xs` to `packages/strand-ui/src/static.css`, mapping 1:1 onto the existing scale tokens and carrying no color (the distinction from `.strand-text-secondary`). All 8 consumer types inherit via the existing utility-class pipeline (same static.css bundle, same tokens package); `pnpm test:parity` passes with no manifest change. Documented in `scripts/data/class-docs.json` and regenerated into `generated/html-reference.md`. Unit coverage added in `static.test.tsx`. DS `ShareButton` field now composes `strand-input__field strand-font-mono strand-text-sm` so the full URL reads beside the copy button.
- Commit: feat/strand-text-size-utilities

### Gap #29
- Type: L2
- Symptom: Follow-up to #28. With the pure size utility applied, live measurement on prod showed the event-link field still truncated the URL: the readonly `<input>` collapses to its intrinsic ~20-character width (~198px) regardless of available space and cannot wrap, and the focal Weekly Ship card is only ~480px wide while a full event URL is ~520px even at `text-sm`. No font size alone makes a ~60-character URL fully visible in that card.
- Root cause: Library gap. To show the full URL the field must wrap onto multiple lines, which requires breaking a long unbreakable string (a URL has no spaces and does not break at `/` or `.`). No Strand utility exposed `overflow-wrap: anywhere`; the only instance lived as page-local glue in the DS lab CSS for code blocks (acknowledged there as pending upstream). A consumer could not wrap a URL / token / hash field with a Strand primitive.
- Fix: Added `.strand-break-anywhere` (`overflow-wrap: anywhere`) to `packages/strand-ui/src/static.css`. Reusable for any long unbreakable string in a constrained box; also lets a flex item shrink below the string's intrinsic width so it wraps instead of overflowing. All 8 consumer types inherit via the shared static.css bundle; parity passes with no manifest change. Unit coverage in `static.test.tsx`; description in `class-docs.json`. DS `ShareButton` now renders the URL in a full-width readonly block using `strand-input__field strand-font-mono strand-text-sm strand-break-anywhere`, so the whole link wraps and reads with the copy button beside it.
- Commit: feat/strand-break-anywhere

## API audit: width utilities and the Stack header-row fill recipe
Date: 2026-06-09
Verdict: PASS (after L1 docs recipe + L2 utility dedupe)

### Gap #30
- Type: L1
- Symptom: The Stack docs show only a vertical usage example. The most common composition, a horizontal stack used as a header row with `strand-stack--justify-between`, silently shrink-wraps when placed inside a flex or grid parent: the title and actions huddle together instead of distributing across the row. Consumers reach for inline `style="width:100%"` even though `.strand-full-width` exists.
- Root cause: Usage gap. A stack is a flex container, but as a flex or grid child it sizes to its content, so `justify-between` has no free space to distribute. The fix (`strand-full-width` on the stack) was never documented in the Stack section where the pattern lives, so consumers could not discover it at the point of need.
- Fix: Added a second usage snippet to the Stack section showing the header-row recipe: a horizontal stack with `strand-stack--justify-between` plus `strand-full-width`, with a comment explaining why the width utility is required inside flex or grid parents. Source of truth updated in `scripts/data/class-docs.json` and regenerated into `generated/html-reference.md` and the package HTML_REFERENCE.md mirrors.
- Commit: feat/stack-fill-devex

### Gap #31
- Type: L2
- Symptom: The global utilities table documented two identical width utilities: `strand-full-width` and `strand-w-full` marked "(alias)". Two names for one property creates doubt for new users about which is canonical, and doubles the surface to search when reading unfamiliar markup.
- Root cause: Library duplication. `.strand-w-full` shipped as an alias of `.strand-full-width` and never picked up any usage: zero references in packages/, docs/, examples/, generated/, or any known consumer.
- Fix: Removed `.strand-w-full` from `packages/strand-ui/src/static.css` and from `scripts/data/class-docs.json`; `.strand-full-width` is now the single width utility and is taught in the Stack header-row recipe (Gap #30). Breaking under 0.x semver: any consumer using `strand-w-full` renames it to `strand-full-width`. Version bumped 0.17.7 to 0.18.0 across all publishable packages. Guard added in `static.test.tsx` asserting the build output contains `.strand-full-width` and not `.strand-w-full`.
- Commit: feat/stack-fill-devex

## Migrated: production-consumer entries from the former root DOGFOOD_GAPS.md

A second gap log existed at the repository root with its own numbering (#1 to #10). It diverged from this canonical file, which `docs/dogfood-protocol.md` designates as the single log. The root entries are preserved verbatim below, renumbered into this sequence with their original numbers noted. The root file is now a pointer to this one.

## Production consumer: dillingerstaffing.com - Firefox Android breakage
Date: 2026-04-13
Verdict: FAIL (6 L2 gaps discovered)

### Gap #32 (root log #1)
- Type: L2
- Symptom: Nav overlays all page content on Firefox <121 (all 5 pages with glass nav)
- Root cause: `body:has(.strand-nav--glass)` in base.css uses `:has()` which Firefox <121 does not support. No class-based fallback existed.
- Fix: Added `body.strand-glass-nav-active` CSS rules in base.css. Nav component (Preact/Vue/Svelte) adds class on mount. Vanilla runtime adds class when `:has()` not supported.
- Commit: 18eb4fa

### Gap #33 (root log #2)
- Type: L2
- Symptom: Full-bleed instrument viewport height miscalculated when banner present on Firefox <121
- Root cause: `body:has(.strand-banner)` in Banner.css uses `:has()`. No class-based fallback.
- Fix: Added `body.strand-banner-active` CSS rule in Banner.css. Vanilla runtime adds class when `:has()` not supported.
- Commit: 18eb4fa

### Gap #34 (root log #3)
- Type: L2
- Symptom: Search bar focus ring missing on Firefox <121
- Root cause: `.strand-search-bar__inner:has(.strand-search-bar__input:focus)` uses `:has()`. `:focus-within` is universally supported and semantically equivalent.
- Fix: Replaced `:has()` with `:focus-within` in InstrumentViewport.css.
- Commit: 18eb4fa

### Gap #35 (root log #4)
- Type: L2
- Symptom: Vanilla HTML consumer type has zero JS behavior (no copy buttons, no mobile nav, no :has() fallback)
- Root cause: No vanilla JS runtime existed in Strand. DS maintained behavior in a DS-authored file outside Strand.
- Fix: Created vanilla runtime at `dist/vanilla/strand-ui.js` with CodeBlock copy, Nav hamburger, :has() fallbacks, Tabs enhancement.
- Commit: 18eb4fa

### Gap #36 (root log #5)
- Type: L2
- Symptom: Tabs have no vanilla HTML switching (CSS-only consumer using :has() radio pattern breaks on Firefox <121)
- Root cause: No JS tab enhancement for vanilla consumers.
- Fix: Vanilla runtime wires `[role="tablist"]` with click-to-switch, hidden toggle, active class, arrow/Home/End keyboard nav.
- Commit: 18eb4fa

### Gap #37 (root log #6)
- Type: L2
- Symptom: `min-height: 100dvh` in reset.css has no `100vh` fallback
- Root cause: Inconsistency with strand-ui.css which correctly provides vh before dvh.
- Fix: Added `min-height: 100vh` before the `dvh` line in reset.css.
- Commit: 18eb4fa

## Production consumer: dillingerstaffing.com - Weekly Ship email lifecycle
Date: 2026-04-19
Verdict: PASS (after L2 primitive addition)

### Gap #38 (root log #7)
- Type: L2
- Symptom: Weekly Ship page-local custom StarRating in ShipInteractive.js and a new server-rendered rate-via-token page both needed a star rating control. No Strand primitive existed, so consumers were rolling their own markup + CSS.
- Root cause: Library gap. StarRating is a common form pattern; absence of a primitive forced each consumer to re-implement the interaction, accessibility, and size tokens.
- Fix: Added L2 StarRating primitive across every framework (Preact/React, Svelte, Vue) + vanilla runtime hydration for `[data-strand-component="star-rating"]`. Added to parity-manifest.json so every consumer type must ship it in lockstep. Three sizes (sm/md/lg), readOnly prop, aria-label required, keyboard + click + hover parity with the old JSX version. Version bumped 0.15.2 to 0.16.0.
- Commit: feat/strand-star-rating

## Production consumer: dillingerstaffing.com - Weekly Ship post-RSVP commitment chip
Date: 2026-04-19
Verdict: PASS (after L2 variant addition)

### Gap #39 (root log #8)
- Type: L2
- Symptom: Weekly Ship's featured event card has no visual confirmation that a signed-in user has already RSVP'd. The card always shows the "Next Ship" overline whether the user is committed or not. A post-RSVP affirmation block renders elsewhere on the page, but the focal card itself never reflects the commitment. Reason: Weekly Ship post-RSVP commitment chip. The existing `strand-status-chip` variants (`--live`, `--neutral`, `--accent`, `--caution`) do not express an earned-state commitment inside a dark instrument viewport.
- Root cause: StatusChip lacked a "committed" variant tuned for the dark instrument viewport. Teal-tint (the existing `--live` fill) is designed for light surfaces: on a near-black background it loses contrast ratio because both fill and text tokens assume a light card. A post-RSVP chip needs saturated teal text on a translucent teal fill so it reads clearly on dark without overpowering the event title (Principle 2, Biosynthetic Restraint). No primitive existed for this role.
- Fix: Added `.strand-status-chip--committed` variant to `static.css`. Uses `--strand-teal-vital` for text, `color-mix(in srgb, var(--strand-teal-vital) 16%, transparent)` for fill, and `color-mix(in srgb, var(--strand-teal-vital) 30%, transparent)` for border. Translucent composition keeps the chip readable on both dark instrument viewports and light surfaces. Documented in `generated/html-reference.md` and `scripts/data/class-docs.json`. All 8 consumer types inherit via the existing utility-class pipeline (same static.css bundle, same tokens package).
- Commit: feat/strand-status-chip-committed

## Production consumer: dillingerstaffing.com - Strand lab reference shell (mobile)
Date: 2026-06-03
Verdict: PASS (after L2 grid-track fix)

### Gap #40 (root log #9)
- Type: L2
- Symptom: On narrow viewports the LabShell (`.strand-ref-shell`) reference/docs layout clipped its main content on the right. The left gutter rendered correctly while the heading, lead, and metrics row were cut off past the right edge, asymmetric. Reproduced at 320 / 360 / 375 / 390 / 414px.
- Root cause: `.strand-ref-shell` is a CSS grid (`256px 1fr`; a single column on mobile) with `overflow-x: clip`. A bare `1fr` track keeps an implicit min-content floor, so the main column refused to shrink below its widest child (a roughly 471px min-content) even at a 320px viewport. The shell's `overflow-x: clip` then hid the surplus as a hard right-edge cut instead of letting it scroll. This violated Strand's own Boundary Integrity principle, which the rev-14 grid track never applied to itself.
- Fix: The track is now `256px minmax(0, 1fr)` (and `minmax(0, 1fr)` on the mobile single column) plus `min-width: 0` on `.strand-ref-shell__main`, so the column shrinks to the viewport and content reflows within symmetric left/right gutters. Pure CSS in `packages/strand-ui/src/components/LabShell/LabShell.css`; all 8 consumer types inherit it through the shared CSS bundle (parity check green at 156 assertions). A CSS source guard was added to `LabShell.test.tsx`. Version bumped 0.17.4 to 0.17.5.
- Commit: fix/strand-lab-shell-mobile-gutters

## Production consumer: dillingerstaffing.com - Strand lab reveal specimen (manual replay)
Date: 2026-06-03
Verdict: PASS (after L2 cascade fix)

### Gap #41 (root log #10)
- Type: L2
- Symptom: The `.strand-reveal-group--manual` staggered-entry specimen never appeared (lines stuck invisible) and the "Replay reveal" button did nothing. Confirmed in any browser supporting `animation-timeline: view()`: a manual reveal element carrying `.strand-reveal--visible` still computed `opacity: 0`.
- Root cause: In `ScrollReveal.css` the `@supports (animation-timeline: view())` block re-declares `.strand-reveal { opacity: 0 }` after `.strand-reveal--visible { opacity: 1 }`, at equal specificity (0,1,0). For the default scroll reveal that is harmless because `animation: strand-reveal-up both` drives opacity. But `--manual` sets `animation: none` to opt out of the view-timeline and never restored opacity control to `--visible`, so the later-source-order base rule pinned the element at opacity 0. Toggling `--visible` (what Replay does) had no visual effect.
- Fix: Added a compound, higher-specificity (0,2,0) rule so a manual reveal toggled visible wins: `.strand-reveal--manual.strand-reveal--visible, .strand-reveal-group--manual > .strand-reveal--visible { opacity: 1; transform: translateY(0); }`. Pure CSS in `packages/strand-ui/src/components/ScrollReveal/ScrollReveal.css`; all 8 consumer types inherit it. CSS source guard added to `ScrollReveal.test.tsx`. Version bumped 0.17.5 to 0.17.6.
- Commit: fix/strand-reveal-manual-visible

## Production consumer: dillingerstaffing.com - Strand lab reference example (source panel on mobile)
Date: 2026-06-10
Verdict: PASS (after L2 grid fix)

### Gap #42
- Type: L2
- Symptom: Composing a code block inside a `.strand-ref-example` (a per-specimen source panel under the demo) blew the example column out to ~421px at a 375px viewport. The shell's `overflow-x: clip` hid the surplus as a hard right cut, leaving the code block's copy button entirely outside the viewport and unreachable by scrolling.
- Root cause: `.strand-ref-example` used bare `1fr` tracks (`200px 1fr` base, `1fr` at the responsive breakpoint). A bare track keeps an implicit min-content floor, so the demo column refused to shrink below the widest unwrappable line of the composed code block. Same Boundary Integrity regression class as Gap #40 (`.strand-ref-shell` main track), one level deeper.
- Fix: Tracks are now `200px minmax(0, 1fr)` (and `minmax(0, 1fr)` at the breakpoint) plus a universal `min-width: 0` on direct children, which releases the grid items' own `min-width: auto` floor for meta, demo, and any consumer-composed wrapper. Wide content inside an example now scrolls within its own box (`overflow-x: auto` on code block pre) instead of escaping the viewport. Pure CSS in `packages/strand-ui/src/components/LabShell/LabShell.css`; all 8 consumer types inherit it through the shared bundle. CSS source guards added to `LabShell.test.tsx`. Version bumped 0.18.0 to 0.18.1.
- Commit: fix/strand-ref-example-minmax

## Production consumer: dillingerstaffing.com - MONEY lab (transactions and accounts tables)
Date: 2026-07-01
Verdict: PASS (after L2 utility fix)

### Gap #43
- Type: L2
- Symptom: In a squeezed `strand-table`, the Date ("2026-06-27") and Amount ("- $1,234.56") cells wrapped mid-figure while the prose Description column stayed wide. A date or money figure broken across lines is illegible; the wrapping belongs in the prose column.
- Root cause: No Strand utility pins a cell to one line, so the browser's table layout distributes wrapping by content width and the consumer has no primitive to steer it. An inline style or page-local CSS would violate the consumer's strand-first rule.
- Fix: Added `.strand-nowrap` (`white-space: nowrap`) beside `.strand-break-anywhere` in `packages/strand-ui/src/static.css` as its inverse: nowrap pins the data atoms, break-anywhere marks the column that absorbs the wrapping. Table overflow stays safe because `.strand-table-wrapper` scrolls on overflow-x. All 8 consumer types inherit via the shared static.css bundle; parity passes with no manifest change. Unit coverage in `static.test.tsx`; description in `class-docs.json`. The MONEY dashboard now composes `strand-nowrap` onto Date/Amount/Balance cells.
- Commit: feat/strand-nowrap

## Production consumer: dillingerstaffing.com - MONEY lab (Plan vs reality rows)
Date: 2026-07-02
Verdict: PASS (after L2 cascade fix)

### Gap #44
- Type: L2
- Symptom: kv rows composing the value tone utility (`strand-kv__value strand-value strand-value--negative`) rendered in the component's midnight blue, not red. The MONEY "Plan vs reality" card emitted the tone classes on "Actually spent" and the under/over delta, yet no color appeared; DataReadout values on the same page colored correctly.
- Root cause: The tone utility's contract ("compose onto any text node and the tone color wins") was implemented as a bare single-class rule (0,1,0) early in static.css. `.strand-kv__value` (0,1,0, later source order) and `.strand-kv--editorial .strand-kv__value` (0,2,0) both re-declare color and beat it in the cascade. The set of competing component color rules is open-ended, so per-component compound overrides (the Gap #41 approach) cannot close it.
- Fix: The two tone color declarations now carry `!important`, the standard pattern for a single-purpose utility whose whole job is one declaration that must win wherever composed. `.strand-value` itself (tabular numerals) stays unmarked. Pure CSS in `packages/strand-ui/src/static.css`; all 8 consumer types inherit via the shared bundle. Source guards added to `static.test.tsx`; `strand-value` / `--positive` / `--negative` were also missing from `class-docs.json` and are now documented.
- Commit: fix/strand-value-tone-cascade

## Production consumer: shipthisgroup.com - Weekly Ship frontend (Path-A purity migration)
Date: 2026-08-09
Verdict: PASS (after L2 utility pack)

### Gap #45
- Type: L2
- Symptom: The graduated Weekly Ship frontend (now shipthisgroup.com) carried ~97 inline `style=""` tweaks across its components and server-rendered pages to apply Strand tokens the library had no utility for: repeated `list-style:none;margin:0;padding:0` list resets, one-off `padding: var(--strand-space-N)` bands (no padding scale existed, only margins), `color:inherit;background-image:none` on card-title links, `display:inline-flex` clusters, `opacity;pointer-events:none` disabled states, `font-style:italic` runs, a `position:relative;aspect-ratio:16/9` + absolute-fill iframe wrapper, and a full-viewport flex-centered layout on the rate-via-email/unsubscribe token pages. Converting to Path A (real Strand Preact components with zero page-local CSS) is impossible until these have primitives.
- Root cause: Strand shipped margin utilities (`strand-mt/mb-*`) but no padding scale; and no primitives for list-reset, inline-flex, italic, disabled-state, inherit-color links, responsive 16:9 media, or a centered token-page layout. Each gap forced an inline style, which the consumer's strand-first rule forbids.
- Fix: Added a utility pack to `packages/strand-ui/src/static.css`: `strand-pt/pb/py-{1..8}` (padding scale mirroring margins), `strand-inline-flex`, `strand-italic`, `strand-list-reset`, `strand-is-disabled`, `strand-link--inherit`, `strand-embed-16x9` (+ absolute-fill child), and `strand-page--centered`. Pure CSS; all 8 consumer types inherit via the shared static.css bundle, so parity passes with no manifest change. Source guards in `static.test.tsx`; all classes documented in `scripts/data/class-docs.json`.
- Commit: feat/strand-ws-utility-pack

## Production consumer: shipthisgroup.com - Weekly Ship instrument viewport + purity finish
Date: 2026-08-09
Verdict: PASS (after L2 cascade + utilities)

### Gap #46
- Type: L2
- Symptom: Finishing the Weekly Ship (shipthisgroup.com) Path-A purity migration surfaced the last inline styles the earlier utility pack (#45) did not cover. Every text primitive placed on the dark focal instrument viewport (headline, secondary/caption text, overline, accent overline, data-readout label, title link) had to be hand-tinted with an inline `color:` because the viewport was not a self-sufficient dark context: only kv / status-chip / ghost buttons had on-dark cascades. Two more layout inline styles remained: a `margin:0` reset on a paragraph inside a stack that already owns its gap, and a `flex-direction:column;align-items:stretch;gap:...` override on the post-RSVP confirmation alert.
- Root cause: Library gap against DL 9.3, which defines the instrument viewport as a self-contained dark island where all text switches to on-dark colors. The cascade existed for a few molecules but not for the generic text primitives, so consumers hand-tinted. And no `margin:0` utility (the zero endpoint of the margin scale) nor a stacked-alert layout variant existed.
- Fix (net-new upstream):
  1. Extended the dark-context cascade in `InstrumentViewport.css` (dual-scoped to `.strand-body--instrument` and `.strand-instrument-viewport`) for `strand-headline` (on-blue-primary), `strand-text-secondary` (gray-200), `strand-text-secondary--xs` (gray-300), `strand-overline` (gray-400), `strand-overline--accent` (blue-indicator on dark; blue-deep stays on light via the static.css rule), `strand-data-readout__label` (gray-400) plus `strand-data-readout__value` (on-blue-primary, since its default blue-midnight is near-invisible on the abyss and DL 9.3 pairs an on-dark label with an on-dark value), and `strand-link` (inherit color, no gradient underline). Added a **light-island restore** (DL 9.6): the `.strand-detail-panel` is a light surface nested in the dark cabinet, so the cascade would otherwise tint its text (a consumer renders a `strand-overline` inside it); the restore re-asserts the light-surface base colors there so the on-dark cascade cannot leak into the light panel. Interrogated against DL 9.3/9.6 before implementing; the DL sanctions both the dark island and the nested light panel, so the additions realize the spec rather than contradict it.
  2. Added `strand-m-0` (`margin: 0`) to `static.css`.
  3. Added `strand-alert--stack` to `Alert.css` (flex-direction:column; align-items:stretch; space-3 gap). Only the axis/cross-alignment change; the neutral background and prefix-only status color (DL 11.6) are untouched.
- Decisions recorded (no code):
  - **`strand-btn--copied`:** DELETE from consumers rather than promote to a primitive. The copied-state feedback is already carried by the icon swap on the copy control (checkmark), so a dedicated background/color feedback token would duplicate the signal and add chrome DL 11.6 does not call for. Consumers drop the class token (Weekly Ship items 65/69).
  - **Skeleton dimensions:** documented as an inline-dimension exemption, not an upstream modifier. Skeleton width/height are content-specific placeholders (they mirror the shape of the not-yet-loaded datum), which is exactly the migration article's "unavoidable dynamic values" clause. A `strand-skeleton--w-N`/`--h-N` scale would be an unbounded set of one-off sizes with no reuse across consumers, so the dimensions stay inline on the skeleton element.
  - **Naming reconciliation (MECE, one name per primitive):** the "quiet title link" and the "responsive 16:9 embed" the Weekly Ship consumer needs already shipped in gap #45 as `strand-link--inherit` and `strand-embed-16x9`. No `strand-link--quiet` / `strand-aspect--16-9` aliases are added; consumers use the existing names. Likewise `strand-list-reset` (gap #45) already covers the semantic-list resets, so no new list utility.
- Propagation: pure CSS in `strand-ui/src` (InstrumentViewport.css, static.css, Alert.css); all 8 consumer types inherit via the shared component-CSS + static.css bundle (the strand-vue / strand-svelte builds read strand-ui/src at build time), so `pnpm test:parity` passes with no manifest change. Version bumped 0.20.0 to 0.21.0 across all publishable packages. Source guards in `static.test.tsx`; `strand-m-0` and `strand-alert--stack` documented in `scripts/data/class-docs.json`; reference specimens added to the Strand lab reference page (instrument dark-context cascade, margin-zero, stacked alert) with `@strand-lab-ref-*` e2e coverage.
- Commit: feat/strand-instrument-dark-context

## Production consumer: shipthisgroup.com - Weekly Ship event card (rating confirmation)
Date: 2026-08-09
Verdict: PASS (after L2 cascade fix)

### Gap #47
- Type: L2
- Symptom: The post-rating confirmation on the Weekly Ship event card rendered as white on white and was effectively unreadable. The card composes `strand-alert strand-alert--success` inside the dark focal `strand-instrument-viewport`; the alert panel stayed near-white while its message text was near-white too, so only the teal status glyph was visible.
- Root cause: `Alert.css` sets an opaque light-surface panel (`background: var(--strand-surface-recessed)`) and deliberately sets no `color` of its own, so the content inherits from context. That pairing is correct on the white lab surface and inverts on the dark viewport, where `.strand-instrument-viewport` sets `color: var(--strand-gray-100)`. Gap #46 built the dark-context cascade for the generic TEXT primitives and even added `strand-alert--stack` to `Alert.css`, but never gave the alert MOLECULE an on-dark treatment, so the one primitive that carries its own background was the one the cascade missed. Consumers had no way to fix it without an inline color override, which the strand-first rule forbids.
- Fix (net-new upstream): extended the dark-context cascade in `InstrumentViewport.css`, dual-scoped to `.strand-body--instrument` and `.strand-instrument-viewport`, for:
  1. `.strand-alert` itself: the translucent wash already used by the neutral status chip on dark (`color-mix(in srgb, var(--strand-gray-400) 12%, transparent)`) plus an explicit `color: var(--strand-on-blue-primary)` rather than leaving the content to inherit.
  2. `.strand-alert--info .strand-alert__status`: `blue-primary` is tuned for the white surface and goes muddy on the abyss, exactly as `blue-deep` does for the accent overline, so `blue-indicator` carries the info prefix on dark. The teal, amber, and red prefixes stay as-is (DL 11.6 prefix-only status color is preserved).
  3. `.strand-alert__dismiss`: `gray-500` on the abyss is below contrast, so the control moves to `gray-300` with a translucent hover wash.
  A light-island restore (DL 9.6) was added alongside: `.strand-detail-panel .strand-alert` re-asserts the light-surface panel and text, so an alert composed inside the nested light panel does not pick up the on-dark wash.
- Propagation: pure CSS in `strand-ui/src` (InstrumentViewport.css only). All 8 consumer types inherit via the shared component-CSS bundle, so `pnpm test:parity` passes with no manifest change. No new class names, so `class-docs.json` is unchanged. Version bumped 0.22.0 to 0.22.1 across all publishable packages (lockstep is enforced by the parity check). Source guards added to `InstrumentViewport.test.tsx` covering both the on-dark cascade (background AND color must both be declared) and the light-island restore.
- Commit: fix/strand-alert-on-dark

## Production consumer: shipthisgroup.com - Weekly Ship layout stability (measured CLS)
Date: 2026-08-09
Verdict: FAIL (two L2 gaps; both closed upstream)

Context: the consumer reported visible content shifting on first load, on sign-in, and on sign-out, across the list page and the event page, on both desktop and mobile. Measured against live production with a `layout-shift` PerformanceObserver capturing source nodes: list 0.019 desktop / 0.039 mobile, event 0.061 to 0.079 desktop and up to 0.092 mobile, against a 0.05 budget. Two of the recurring sources were Strand's to own; the rest are consumer-side and tracked in the consumer's own spec.

### Gap #48
- Type: L2
- Symptom: Every text node on every consumer surface reflowed roughly 1.3s into load. Captured directly: the nav's actions block measured 132px wide, then 139px, with no DOM change between the two samples.
- Root cause: Strand ships no font binaries and expects consumers to load Inter and JetBrains Mono themselves, in practice from a font CDN with `font-display: swap`. Strand then names those families first in `--strand-font-sans` / `--strand-font-mono` with an unadjusted system stack behind them. The fallback and the real face have different advance widths and different vertical metrics, so the swap resizes every glyph run on the page. Strand defined the stack that produces the reflow but shipped nothing to absorb it, and a consumer cannot fix it without either abandoning the webfont or hand-authoring `@font-face` overrides per surface.
- Fix (net-new upstream): two metric-matched fallback faces in `tokens/css/base.css` (`Inter Fallback`, `JetBrains Mono Fallback`), each `src: local()` only so nothing is downloaded, inserted directly behind the real face in both stacks in `tokens/css/tokens.css`. Values are measured rather than copied from a generator: `size-adjust` is the advance-width ratio of a representative sample string rendered in both faces, and the vertical overrides are the real face's ascent and descent as a fraction of em, each divided by `size-adjust` to compensate for the fact that `size-adjust` scales the fallback's metrics too. Inter/Arial resolves to 105.59% / 91.86% / 22.73%; JetBrains Mono/Courier New resolves to 99.98% / 102.02% / 30.00%, which is exactly JetBrains Mono's published 1020/1000 ascender and 300/1000 descender and confirms the derivation.
- Propagation: pure CSS in `tokens/css`, which every consumer type loads, so `pnpm test:parity` passes with no manifest change. No new class names. Degrades safely: where the named system font is absent the face fails to load and the stack falls through unadjusted, which is the behavior consumers had before.

### Gap #49
- Type: L2
- Symptom: The nav visibly jumped on load, on sign-in, and on sign-out. Measured: `.strand-nav__actions` moved from x=735 to x=692 when signed out and to x=624 when signed in, and the slot itself moved from (1251, 85px wide) to (1114, 222px wide). The slot's own box was attributed as a shift source, so anchoring it right was not sufficient.
- Root cause: `.strand-nav__slot` is documented as a home for an account affordance, which is precisely the content whose identity changes at runtime: one short button signed out, an avatar plus a sign-out button plus a profile link signed in. `.strand-nav__slot` carries `margin-left: auto` and so does `.strand-nav__actions`, so a nav composing both has two auto margins splitting the free space. Any width change in the slot therefore moves the slot AND redistributes space to every auto-margined sibling. Strand offered no way to reserve the space, and the consumer could not add one without a page-local width override, which the strand-first rule forbids.
- Fix (net-new upstream): `.strand-nav__slot--reserve` in `Nav.css` pins the slot's inline size via `min-width: var(--strand-nav-slot-reserve, 14rem)` and sets `justify-content: flex-end` so the affordance stays pinned to the nav's right edge in every state. A tighter default (`--strand-nav-slot-reserve-sm`, 11.75rem) applies at the existing mobile breakpoint, where the nav hides `.strand-nav__actions` and has far less room. Opt-in modifier, so no existing consumer's nav changes.
- Propagation: pure CSS in `strand-ui/src` (Nav.css only); all 8 consumer types inherit via the shared component-CSS bundle. One new class name, registered in `scripts/data/class-docs.json`.
- Commit: fix/strand-layout-stability

## Production consumer: dillingerstaffing.com - every page loading the tokens (first contentful paint)
Date: 2026-08-09
Verdict: FAIL (regression introduced by Gap #48; closed)

### Gap #50
- Type: L2
- Symptom: After Gap #48 shipped, first contentful paint on the JOBINT lab went from roughly 0.4s to 2.9s against a 1.2s budget, and the same class of failure appeared intermittently on the Readback and Strand lab surfaces. The regression was invisible in review because nothing about the markup or the JS changed; only two `@font-face` rules had been added.
- Root cause: Gap #48's fallback faces set no `font-display`. The property defaults to `auto`, which Chrome treats as `block`: text using the face is held INVISIBLE for up to 3s while the face resolves. A `local()` source normally resolves instantly, so this is silent wherever the named system font exists, but when it is absent the face FAILS and the full block period elapses before the stack falls through. The measured 2.9s is that block period. Every page loading the tokens was affected, which is every consumer.
- Fix: `font-display: swap` on both fallback faces. That makes the fallback purely additive: text paints immediately in whatever the system offers, and the metric-matched face takes over the instant it resolves, which is what Gap #48 intended in the first place. A source guard in `tokens.test.ts` now fails if either face can block paint again, with the measured numbers in the assertion message so the next reader knows why the property is load-bearing rather than cosmetic.
- Lesson: a metric-matched fallback is a performance optimization that silently becomes a performance regression without `font-display`. The two belong together and should never be reviewed separately.
- Propagation: pure CSS in `tokens/css`, inherited by all 8 consumer types; parity unchanged, no new class names. Version 0.25.0 to 0.26.0.
- Commit: fix/strand-font-display-swap

## Production consumer: shipthisgroup.com - base palette contrast (axe, 414px)
Date: 2026-08-10
Verdict: FAIL (one L3 gap; the two reported symptoms were not it)

Context: a consumer audit reported two base-palette values missing WCAG AA on white at 414px: `.strand-overline` measured `#728496` on white at 3.84:1, and `.strand-status-chip--live` measured `#248084` on `#d0fbf2` at 4.17:1. Neither value appears anywhere in Strand. Reproducing before fixing turned up a different defect than the one reported, and the reported one turned out not to be a palette defect at all.

### Gap #51
- Type: L3
- Symptom, as reported: two rendered colors below 4.5:1, both just under, "which is why nobody ever saw them as broken".
- What the reported symptom actually was: an opacity artifact, not a palette value. All three reported colors are the declared Strand colors composited at alpha 0.905 over white -- including the chip's BACKGROUND, which moved from `#CCFBF1` to `#d0fbf2`, and a palette bug cannot change a background it does not set. Reproduced exactly: a ladder of `.strand-reveal` sections at 414px, sampled at scrollY=0, puts one rung at opacity 0.912, rendering the overline as `#728395` at 3.89:1 and the chip as `#227f83` on `#d0fbf2` at 4.23:1. `.strand-reveal` is scroll-driven (`animation-timeline: view()`, `animation-range: entry 0% entry 100%`), so an element parked partway through its entry range holds a partial opacity as a STABLE state, and one below the fold holds opacity 0. A contrast checker scanning a full page samples both. Darkening the palette cannot fix this: at opacity 0 nothing passes, at any weight.
- The real defect, found while reproducing: `--strand-gray-500` (#64778B) genuinely failed AA, but on the page background rather than on white, and the spec said so in writing. Part XIV.2 recorded "`--strand-gray-500` on `--strand-surface-primary` = **4.49:1** (passes AA)". 4.49 is not 4.5. The value was quoted against the friendliest surface and still missed, and was labelled a pass anyway. Measured across every light surface the language sanctions under secondary text: surface-primary 4.487, surface-recessed 4.199, gray-50 4.403, gray-100 4.236. Only surface-elevated (pure white) passed, at 4.612. gray-500 is the secondary-text role (Part III.8) and carries the overline at text-xs (11.1px), which is unambiguously normal text needing the full 4.5:1.
- Root cause: L3. Part III.7 rule 6 promises "every color pairing has a minimum 4.5:1 contrast ratio, enforced by automated test, not by manual review", and Part XIV.1 calls violations structural failures. No such test existed for gray-500, so a value derived by eye survived in the spec, propagated to every consumer's DESIGN_LANGUAGE.md mirror, and was quoted as evidence of compliance. The failure was the missing enforcement, not the hex digit.
- Fix: re-derived `--strand-gray-500` at fixed hue and saturation, lowering only lightness until the WORST sanctioned surface clears 4.5:1 with real margin. #64778B (H 210.8, S 16.3%, L 46.9%) becomes **#5D6E81** (H 211.7, S 16.2%, L 43.5%): hue and saturation are preserved to within rounding, so the ladder stays blue-shifted per Part III.4, and only the luminance moves. Resulting ratios: elevated 5.23, primary 5.09, gray-50 5.00, gray-100 4.81, recessed 4.77. White text on gray-500 (`strand-badge--default`) improves 4.61 to 5.23, so the one place the token is a background gets better too.
- Judgment call recorded: **the ladder's perceptual evenness was spent to buy the contrast.** gray-400/500/600 sat at L 65.1 / 46.9 / 34.5; they now sit at 65.1 / 43.5 / 34.5, so the 400-to-500 step is larger than the 500-to-600 step. Part III.7 rule 6 and Part XIV.1 make accessibility the binding constraint and evenness the negotiable one, so the compression is the correct trade rather than a regrettable one. The alternative -- keeping the value and restricting gray-500 to pure white surfaces -- was rejected because it makes the secondary-text role conditional on its background, which no consumer could be expected to track.
- Enforcement added, which is the actual fix: `tokens.test.ts` now asserts gray-500 against every sanctioned light surface with a **4.75 floor**, not 4.5. A pairing that clears the threshold by 0.01 is indistinguishable from one that fails it, and rounding in a consumer's pipeline decides which side it lands on; the margin is the difference between a value that was calculated and one that was eyeballed. Companion tests hold the hue blue-shifted and keep gray-500 between its neighbours, so a future contrast fix cannot warm the gray or collapse the ladder.
- `.strand-status-chip--live` needs no change. Its declared pairing (`--strand-on-teal-tint` #0D7377 on `--strand-teal-tint` #CCFBF1) measures **4.99:1** and always passed; the reported 4.17 was entirely the reveal artifact.
- **Second consumer audit, mid-fix, widened this considerably.** A parallel session stripped `color-contrast` from 10 axe suites and measured 9 failures over 274 tests across six distinct pairs, of which gray-500-on-recessed was one and the reveal artifact two. That prompted a static audit of the whole built bundle rather than of the reported values, and it found the reported six were the visible edge of something systematic: **129 failing pairings**, `--strand-blue-primary` as small text in 84 of them and `--strand-gray-400` in 45.
- The systematic finding, and the second half of this gap: **a hue needs two values, because WCAG applies two thresholds to the same colour depending on what it paints.** Fills, borders, focus rings and display type answer to 3:1; small text answers to 4.5:1. Strand carried one value per hue and the library spent it on both, so `.strand-link` (body text) and a focused input's border (non-text) both drew `--strand-blue-primary` at 3.29:1, correct for one and failing for the other.
- Judgment call recorded, and it is the important one: **the fill-tier values do not move.** Darkening `--strand-blue-primary` would fix 84 pairings in one edit and was rejected, because Part 3.1 rejects a darker brand blue in as many words ("Not corporate blue (too dark, too safe)") and because the value is *correct* everywhere it is a fill. The defect was never the hex digit; it was applying a background colour to text. So the fix moved the USAGES to the text tier, which already existed and was already half-documented: `blue-deep` for blue text was prescribed in Part XIV.2 and honoured by `.strand-overline--accent` alone. Formalised as a tier table in the new Part 14.2b, with the `on-*-tint` and `*-deep` values named as each hue's text tier.
- Library changes: 36 `color:` declarations retinted from fill tier to text tier across 16 component stylesheets, anchored on the start of the declaration so `border-bottom-color` and `outline-color` keep the brand value. Then eight rules fixed individually because a blanket retint would have been wrong for them: `.strand-log__text` (gray-300, **1.47:1**) and its `strong` runs (gray-100, **1.09:1**, effectively invisible on a light surface) moved to the secondary and heading tiers; `.strand-bar-chart__amount` likewise; `.strand-form-field__error` to `red-alert-deep`, since validation copy is the one message a user cannot afford to miss; `.strand-kv__value--status` and `.strand-code-block__copy--copied` to their hues' text tier because both render a WORD rather than a glyph; and two light-island rules (`.strand-detail-panel .strand-link`, `.strand-detail-panel__source`) which sit on a light panel nested in the dark cabinet and had inherited the cabinet's on-dark values.
- Two hover states were **deleted rather than recoloured**. `.strand-link--cta:hover` and `.strand-text-secondary a:hover` brightened to `blue-vivid`, which is 4.45:1 on the page background. A hover state carries the same contrast obligation as a resting one, and the hue has nowhere accessible to brighten to, so the affordance moved to the underline that `.strand-link:hover` already grows. The colour shift was redundant on top of it as well as unsafe.
- Deliberately NOT changed, and recorded as reviewed exclusions in the checker rather than silently skipped: status prefix glyphs (`__status`, Part 11.6 — a coloured tick beside a word that says "Complete" is a graphical object at 3:1, and darkening it to `on-teal-tint` reads as a different state rather than a clearer one), `.strand-star-rating__star--active` (a filled star communicates through shape against its unfilled neighbours; recolouring gold to dark brown would make the control worse), and token specimens and swatch cells, which exist to display a palette value and would be defeated by distorting it. That last exclusion honours a caution raised by the auditing session.
- Enforcement, which is what stops this recurring: **`scripts/contrast-check.mjs`** (`pnpm test:contrast`, wired into `test:all`) reads the built CSS, resolves the background each rule's text will actually sit on, and fails any pairing below its applicable threshold. It has to be precise in both directions, since a false positive gets silenced and silencing is how real drift hides, so it skips rules that paint their own background, skips `--strand-on-*` tokens (verified at the token layer instead), and derives the dark-cabinet class list BY READING `InstrumentViewport.css` rather than by pattern-matching names — the dark FUI family is `search-bar`, `result-card`, `cluster-marker`, `log`, `bar-chart`, none of which say "instrument". Light islands are re-included by name so they stay auditable. 21 unit tests cover both directions.
- Documentation: Part XIV.2 now states that a ratio is quoted against the worst surface the text can land on rather than the friendliest, carries the full per-surface table, requires 0.25 of margin on every text pairing, and warns that opacity multiplies against every ratio on the page. Part VI.7 gains the audit procedure: emulate `prefers-reduced-motion: reduce` (Playwright `reducedMotion`, Puppeteer `emulateMediaFeatures`) so reveals are settled and the checker reports declared colors. Verified: at 414px with the preference emulated, 0 of 14 reveals sit below opacity 1, versus 8 of 14 without it. Disabling the `color-contrast` rule to silence the artifacts is explicitly the wrong fix, since it suppresses genuine regressions alongside them.
- Propagation: token value in `tokens/css/tokens.css`, `tokens/js/tokens.ts`, `tokens/bulma/_strand-bulma-vars.scss`, and the spec in `docs/design-language.md` plus `docs/migration/from-bulma.md`. All 8 consumer types inherit via the tokens package; the per-package DESIGN_LANGUAGE.md mirrors are copied at build. Parity unchanged, no new class names. The `.strand-section--bg-recessed .strand-overline` override in `static.css` stays, but its comment no longer claims to be a correctness patch: gray-500 now clears AA on recessed unaided, and the step to gray-600 is there to buy back margin on the busiest surface.
- Commit: fix/strand-secondary-text-contrast

## Production consumer: every consumer loading the tokens - third-party font requests
Date: 2026-08-10
Verdict: FAIL (one L2 gap; closed)

### Gap #52
- Type: L2
- Symptom: every page on every consumer surface fetched Inter and JetBrains Mono from `fonts.googleapis.com` and `fonts.gstatic.com` at runtime, adding a render-blocking third-party stylesheet plus font requests to an origin the consumer does not control, and forcing `style-src`/`font-src` CSP allowances for two external hosts.
- Root cause: Strand names Inter and JetBrains Mono FIRST in `--strand-font-sans` / `--strand-font-mono` but shipped no binaries, so every consumer had to source them independently, and the path of least resistance is a font CDN. Naming a font in a stack does not make it available; a design language that names one owes its consumers the file. Gap #48 had already built the metric-matched fallbacks for the swap these fonts cause, so the library was absorbing the cost of a dependency it never actually shipped.
- Fix (net-new upstream): `packages/tokens/fonts/` now vendors both families as **variable** woff2, and `packages/tokens/css/fonts.css` declares them. Generated by `scripts/vendor-fonts.mjs` (`pnpm vendor-fonts`, `pnpm vendor-fonts:check` for staleness), so refreshing a font is a command rather than a manual download.
- Decisions recorded:
  - **Variable, not static per-weight.** One file per subset spans Inter 300-600 and JetBrains Mono 400-600. Beyond byte count this closes a silent-failure mode: with static faces, using a weight nobody vendored degrades to synthesis or fallback and nothing in the build complains, so the weight hierarchy in Part IV.5 can drift out of what is actually shipped.
  - **Latin and latin-ext only.** Cyrillic and Greek would roughly triple the vendored bytes for glyphs no current consumer renders. `unicode-range` gates each subset, so a Latin page fetches only the Latin files: measured 78 KB actually transferred (inter-latin 47 KB + jetbrains-mono-latin 31 KB) out of 173 KB vendored. A consumer needing another script adds it to `SUBSETS` and re-runs.
  - **Separate opt-in stylesheet, not merged into `base.css`.** `base.css` stays free of any `url()`, so a consumer who does not vendor the binaries gets no failed requests, and the stacks simply fall through to the metric-matched fallbacks -- a supported configuration rather than a broken one.
  - **Path convention: `url('../fonts/<file>.woff2')`, relative.** `url()` cannot read a CSS variable, so the path must be literal, and the choice is between an absolute web path and a relative one. Relative wins because it serves both consumption models with one convention: a bundler rewrites and fingerprints the asset automatically, and a consumer copying files into a web root gets a working path as long as `css/` and `fonts/` stay siblings. An absolute `/fonts/` would break every bundler consumer and any consumer not served from a domain root.
  - **Licensing.** Both families are OFL-1.1, which permits redistribution with the license alongside the binary. `INTER-OFL.txt` and `JETBRAINS-MONO-OFL.txt` ship in `fonts/`, and a test fails if either goes missing.
- Verified in a layout mirroring consumer deployment (`css/` and `fonts/` as siblings under a web root): both real faces win over the fallbacks, only the latin subsets are requested, zero failed requests, zero third-party requests, and **cumulative layout shift 0.00000** across load and font swap, which confirms Gap #48's metric-matched fallbacks still hold against the self-hosted faces.
- Every face carries an explicit `font-display: swap`, and a source guard enforces it, per the lesson in Gap #50. A second guard asserts no `src` reaches a third-party origin, since a CDN url creeping back in would silently restore the dependency this gap exists to remove. `scripts/vendor-fonts.mjs` has 13 unit tests against synthetic Google Fonts responses covering url-vs-format parsing, quoted urls, variable weight ranges, missing subset comments, and the generated output.
- Propagation: new files in `tokens/` only, added to the package `exports` and `files`. All 8 consumer types depend on the tokens package, so one addition reaches every one of them. Parity unchanged, no new class names, no new tokens (the stacks already named both families).
- Consumer follow-up: consumers must drop their `fonts.googleapis.com` / `fonts.gstatic.com` link tags, copy `fonts/` next to their Strand `css/`, import `css/fonts.css`, and tighten CSP `style-src`/`font-src` back to `'self'`.
- Commit: feat/strand-self-hosted-faces

---

## Production consumer: Weekly Ship + admin + the reference showcase - three shipping components below WCAG AA
Date: 2026-08-10
Verdict: FAIL (one L3 gap, two L2 gaps; all closed)

### Gap #53
- Type: L3 (design language), with L2 consequences in Badge, Button, Alert and the committed status chip
- Symptom: `.strand-status-chip--committed` measured **2.15:1**, `.strand-badge--blue.strand-badge--count` **3.29:1**, and `.strand-badge--red.strand-badge--count` / `.strand-btn--danger` **3.76:1**. All ship. The chip renders on the Weekly Ship featured card after a member RSVPs; the danger button is the confirm control in the admin "Delete channel" dialog, so the least legible text in the library was the label on a destructive action.
- Root cause: **an on-color is a guarantee at a text size, not an unconditional one.** WCAG asks 4.5:1 of small text and 3:1 of large, so one colour can be correct as a fill behind a heading and a failure under an 11px label. The palette carried one `--strand-on-*` value per hue and components consumed them as if size-independent. `tokens.test.ts` had actually recorded the truth for years -- `it("white on blue-primary >= 3:1 (large text / interactive elements)")` -- and nothing one layer down honoured it. `.strand-badge__indicator` paints white at `--strand-text-xs` (11px) over whatever fill the variant sets.
- Fix (upstream):
  - Badge variants moved to the **deep rung** of their accent (`teal-deep`, `blue-deep`, `red-alert-deep`). This is not a new idea in the system: `.strand-btn--primary` already used `blue-deep` rather than `blue-primary` for exactly this reason, so the change brings badges in line with an existing precedent rather than inventing one.
  - `.strand-btn--danger` moved its whole ladder one rung deeper (base `red-alert-vivid` 4.83:1, hover `red-alert-deep` 6.47:1, active `red-alert-abyss` 10.02:1), mirroring how primary descends `blue-deep -> midnight -> abyss` instead of starting at the base rung.
  - Two tokens added to complete scales that were already asymmetric: `--strand-teal-deep` (green and blue had a `-deep`; teal did not) and `--strand-red-alert-abyss` (blue had an `-abyss` to support a three-state ladder; red did not).
  - The ON-COLORS block in `tokens.css` and `tokens.ts` now states the size threshold explicitly, so the next component picking one is told which sizes it is safe for.
- Scope correction: the audit reported **two** failing badge variants because those were the two the showcase happened to render. `.strand-badge--teal` fails harder (2.49:1) and was invisible for want of a specimen. Fixing only what was measured would have left the same defect shipping. Every variant is now guarded, including `--default` and `--amber`, which pass.

### Gap #54
- Type: L2
- Symptom: the committed status chip's own comment claimed "the translucent composition lets the chip sit cleanly on both dark and light surfaces". Its background does; its **text** cannot. Teal at 16% over white composites to `#D9F4F1`, where `teal-vital` is 2.15:1; over the abyss the same fill composites dark, where `teal-vital` is 5.45:1 and correct.
- Fix: the light default takes `--strand-on-teal-tint` (4.86:1) and an on-dark rule in `InstrumentViewport.css` restores `teal-vital` — exactly the value the single definition used to carry, so **dark rendering is byte-identical and only the light surface moved**. Same split, and same reasoning, as the kv status value fixed in 0.27.2.

### Gap #55
- Type: L2
- Symptom: `.strand-alert__status` had an on-dark rule for `--info` only. `--success`, `--warning` and `--error` kept colours chosen against their light tint backgrounds while the viewport washed the panel dark, measuring 1.92, 1.52 and 1.67. `--success` is the RSVP affirmation, the panel a member sees the moment they commit.
- Root cause: a rule written for the variant in front of the author rather than for the family — the same shape as the log and bar-chart readouts missed in 0.27.2. `scripts/contrast-check.mjs` cannot catch it: it only sees rules that NAME the viewport, so a variant with no rule there is invisible to it.
- Fix: all four variants now have on-dark rules, each inverting to a light value of its own hue (the tints they already use as light backgrounds), so the pairing turns over rather than picking up a new colour. Guarded by a **set** comparison rather than by values: whatever variants `Alert.css` colours individually, `InstrumentViewport.css` must answer for all of them.
- Checked and NOT changed: `.strand-toast--*` mirrors alert's per-variant colours and looks like the same bug. It is not. Toast declares an opaque `surface-elevated` background and the viewport never washes it, so it stays a light island and its light colours remain correct. Pinned by test, because a well-meaning fix here would break it.

### The decision worth carrying: certify against the worst state, not the settled one
`docs/design-language.md` Part VI.7 said to emulate `prefers-reduced-motion: reduce` when auditing contrast. That is right for **attributing** a finding to the palette rather than to the reveal, and it is wrong if read as sign-off. The alert panel resolves to `#1F2A3B` settled and composites to `#343E4E` mid-reveal, under a single `.strand-reveal` ancestor at ~0.904 (recovered by solving for the alpha per channel: 0.9041 / 0.9048 / 0.9031, spread 0.0017, so one layer and not a stack). Against those two backgrounds `--strand-teal-vital` measures 5.81:1 and **4.34:1**. Adopting it would have passed every check in this repo and been inaccessible to anyone scrolling a card into view at normal speed. The `*-tint` values were chosen because they clear both states (12.8:1 and 9.6:1). Part VI.7 now says so: **a colour with two backgrounds needs two numbers**, and settled is the state a checker finds most easily and a user sees least.
- Tooling corollary, added to VI.7 after three separate checkers reported clean while being wrong on the same day: **fail loudly on anything unrecognised.** A prototype compositing script silently skipped a `color(srgb ... / 0.12)` layer it could not parse and produced a confident, wrong `#0F192A` at 3.13:1. Not adopted here — it hardcodes one fragment and has no tests, which `scripts/` requires — but the reusable idea (walk the ancestor chain, composite in paint order, report against every state) is worth building properly, with an unparsed colour throwing rather than being skipped.

### Also closed: CSS/JS token parity
`tokens.css` and `tokens.ts` are two hand-maintained copies of one palette and had drifted — **17 colour tokens existed in the CSS with no JS export**, including every tint background and most on-colors. "Tokens Only" is one of the eight supported consumer types, so those consumers could not reach a third of the palette and nothing said so. All 19 (17 pre-existing plus the 2 added here) are now exported, and a test pins the two files together by value in both directions.

- Propagation: token additions and CSS-only changes, so all 8 consumer types inherit them with no API change. No new class names, no removed class names, parity manifest unchanged at 47 components.
- Every guard added here was mutation-checked rather than trusted for being green: reverting each badge fill, dropping an alert variant's on-dark rule, and both drifting and deleting a token export all fail their suites.
- Version: 0.28.0 (minor, not patch: two new tokens are additive API).

### Gap #56
- Type: L2 (accessibility defect + measurement invariant)
- Date: 2026-08-10
- Symptom: **grouped reveals ignored `prefers-reduced-motion` entirely.** Verified in a browser, before: a plain `.strand-reveal` under `reducedMotion: "reduce"` resolved to `opacity: 1, animation: none`, while `.strand-reveal-group > .strand-reveal` resolved to `opacity: 0` with `animation-timeline: view()` still live. A user who asked for reduced motion still got the scroll-driven animation on every grouped reveal, against Part XIII's "every animation reduces to instant state change. No exceptions."
- Root cause: the `@media (prefers-reduced-motion: reduce)` block listed `.strand-reveal` (specificity 0,1,0) and lost to `.strand-reveal-group > .strand-reveal` (0,2,0). A reset has to out-specify the rules it undoes, and this one silently did not for the grouped case. `.strand-reveal--manual` (0,2,0) beat the `transition: none` reset the same way.
- Second-order cost, which is why this outranks a normal motion bug: a scroll-driven reveal parks an element at partial opacity as a STABLE state, so any contrast audit run under emulated reduced motion on a page using reveal groups measures composited colours belonging to no token. It returns plausible numbers rather than failing. That is the same silent-non-handling shape as the `color(srgb ...)` parser in Gap #53's notes, and it means a contrast measurement in this system implicitly depends on a CSS opt-in three layers away that nothing surfaces to the reader.
- Fix: the reduced-motion block now covers `.strand-reveal`, `.strand-reveal-group > .strand-reveal`, `.strand-reveal--manual` and `.strand-reveal-group--manual > .strand-reveal`, and resets `animation-timeline: auto` as well as `animation: none`. Manual reveals deliberately keep their state -- only the motion is removed -- because forcing `opacity: 1` there would make an un-toggled reveal visible and break the toggle API that `--manual` exists to provide.
- Verified in a browser after: grouped goes `opacity 1 / animation none / timeline auto`; manual-hidden stays `opacity 0` with `transition 0s`; manual-visible stays `opacity 1`; and with no preference set, all scroll-driven behaviour is unchanged.
- **The guard needed a second pass, and mutation testing is the only reason that was caught.** The first version asserted the group selector appeared somewhere in the reduced-motion block. A mutation that removed it from the rule killing the animation, while leaving it on the rule setting opacity, reintroduced the bug and the test still passed. The invariant is not "the selector is present", it is "the selector is attached to the declaration that undoes the motion", so the test now parses the block into rules and checks declaration coverage. Three mutations fail it: dropping the group selector from the animation rule, dropping the `animation-timeline` reset, and forcing manual reveals visible.
- Propagation: CSS-only, no new classes or tokens; all 8 consumer types inherit it. Part XIII of the design language now records that reduced-motion support is a CSS opt-in rather than a browser behaviour, and that the reset must out-specify what it undoes.
- Version: 0.28.1

---

## Production consumer: shipthisgroup.com + the reference showcase - a spec that contradicted itself, and the only uncapped text in the language
Date: 2026-08-10
Verdict: FAIL (one L3, one L2; both closed)

### Gap #57
- Type: L3 (design language)
- Symptom: **DL 5.1 and DL 5.4 could not both hold.** 5.1 mandates that every spacing value be a multiple of 4px; 5.4 mandates `clamp(4rem, 8vw, 8rem)` for section padding, and `8vw` at a 1440px viewport is **115.2px**. Measured on production at both the standard and compact tiers. No consumer error and no primitive could satisfy both.
- Decision: **5.1 now exempts fluid macro-spacing, explicitly and exhaustively.** The exemption is principled rather than a carve-out. 5.1's own justification is that the eye detects regularity by comparing ADJACENT values -- stack gaps, card padding, the step between one component and the next -- and those stay on the grid without exception. A fluid section pad has no adjacent comparator; it is one interval between major regions and is read as proportion to the viewport, not as a rhythm unit. Snapping it changes nothing perceivable and costs the proportional scaling it exists to provide. Note also that the clamp's declared bounds are already on-grid (64px and 128px), so the rule holds at every value an author writes and only the continuous interpolation between two on-grid endpoints leaves it.
- Rejected: **snapping the clamp** with `clamp(4rem, round(8vw, 4px), 8rem)`. It resolves the contradiction and `round()` is adequately supported now, but it buys a property nobody can perceive at the cost of making every fluid value harder to read, and consistency would force the same treatment on fluid type. Stating the rule accurately was the better fix, because the exemption was already what everyone was doing.
- Exempt list is closed: fluid section and hero padding, the fluid section-header margin, and fluid type sizes. Everything else stays on 4px.

### Gap #58
- Type: L2
- Symptom: `.strand-banner__text` had no measure constraint. The banner is the only full-bleed text in the language, so its line length was whatever the viewport happened to be -- measured at ~1408px / ~211 characters at 1440, against DL 4.6's "60-75 characters per line. Non-negotiable." It is also the first text above the fold on any page carrying one.
- Root cause: a consumer cannot cap it without a page-local override, so the missing constraint was a library gap rather than a misuse.
- Fix: `max-width: 65ch` with auto side margins, which keeps it centred under the banner's existing `text-align: center` and stays inert on the short strings a banner usually carries. 65ch is DL 4.6's own worked example and the value `.strand-prose` already uses, so the number keeps one owner instead of two.
- Guarded in `Banner.test.tsx`, which is a new file: Banner ships as CSS only, so the guard reads the stylesheet. Mutation-checked -- removing the cap, moving it outside the 60-75 band, and dropping the centering all fail it.

### Also recorded: DL 4.6's floor is unreachable on phones
Measured on production: body text renders at ~10.09px per character, so the 55ch floor needs ~555px of text width and, with the language's own side padding, a viewport near 600px. At 390px the full bleed is 39ch; at 320px it is 32ch -- before any container, so no tier choice and no override reaches it. 4.6 now says the floor applies where the viewport affords it and the **ceiling always does**, since 75ch is reachable at every width. An audit finding 34ch at 390px has found a phone, not a defect, and this is written down so it stops being re-reported.

- Propagation: one CSS declaration plus documentation; no new classes, no new tokens, parity unchanged. All 8 consumer types inherit it.
- Version: 0.29.0

---

## Production consumer: Weekly Ship - no bypass for keyboard users, and a focus indicator that isn't one
Date: 2026-08-10
Verdict: FAIL (two L2 gaps; both closed)

### Gap #59
- Type: L2
- Symptom: **no skip-link primitive existed.** `.strand-sr-only` is the only visually-hidden utility in the library and it has no focus reveal, so a skip link composed from it stays invisible when focused -- defeating it for precisely the sighted keyboard-only users it exists for. A consumer could not build one correctly, which makes it a library gap rather than a misuse.
- Measured need: on the Weekly Ship list at 250 events (about five years at a weekly cadence) the page carries **1,260 tab stops and 46 phone screens** between the top and the footer, with no bypass. Landmarks are present and are a sufficient technique for SC 2.4.1, so this was never a Level A failure -- but landmarks only serve assistive tech. Rendering holds up fine at that volume (TBT 0ms at 250 events), so the fix is a bypass, not virtualisation. One primitive collapses 1,260 tab stops to 2.
- Fix: `.strand-skip-link`, self-contained so a consumer writes one class rather than composing two and getting the reveal wrong. Parked off-screen with a transform rather than clipped, so the control keeps its real size and stays in both the tab order and the accessibility tree throughout. `position: fixed` rather than `absolute`, so it lands in the VIEWPORT wherever the reader has scrolled to -- absolute would scroll away and focus a control the reader cannot see. `z-index: 200` clears the banner (101) and both nav layers (99/100).
- **Deliberately not animated.** A transition would need a matching reduced-motion reset at matching specificity, which Gap #56 documents as a live way to get subtly wrong. No animation, nothing to suppress, no second rule to keep in sync.
- Verified in a real browser with a genuine Tab press, not a programmatic `.focus()`: before, `top: -54` and outside the viewport; after, `top: 16`, inside the viewport, `:focus-visible` matching, 2px outline present.

### Gap #60
- Type: L2 (WCAG 2.2 AA)
- Symptom: `.strand-star-rating__star:focus-visible` set `outline: none` and substituted `--strand-focus-ring`, which is `rgba(59,130,246,0.1)` and paints `rgb(235,243,254)` over white. Measured **1.12:1** between focused and unfocused pixels against SC 2.4.11's **3:1**. The same shape on `.strand-slider__field`'s `::-webkit-slider-thumb` and `::-moz-range-thumb`. This ships in the product: `ShipInteractive` composes the star-rating primitives for the rating flow, so a keyboard user could not see which star they were on.
- **No axe rule covers 2.4.11.** Focus appearance is not automatable that way, so all eight consumer suites were blind to it, including the contrast passes re-enabled the same day. Worth knowing as the boundary of what those suites prove.
- Fix, deliberately surgical: **the shared token is not the bug and was not touched.** Classified all nine usages by reading each rule body -- six pair the ring with `border-color: var(--strand-blue-primary)`, where the border is the real indicator and the ring is supplementary glow, correctly subtle. Raising the token to fix three cases would make six correct components look heavy. Only the three that used it as the SOLE indicator changed: the star takes the `outline: 2px solid var(--strand-blue-primary)` treatment the rest of the library already uses (Button.css:211), and the two slider thumbs take a solid two-stop ring, since outline support on those pseudo-elements is uneven. blue-primary on white is 3.28:1, which clears 2.4.11's 3:1 -- it is NOT held to 4.5:1, which is the small-text threshold and a different criterion.
- Verified in a real browser: the focused star reports `outline: 2px solid rgb(59,142,246)` and `box-shadow: none`, with `:focus-visible` genuinely matching.

- Both guards were mutation-checked rather than trusted for being green: making the skip link never reveal, switching it to `absolute`, and reverting the star to the weak ring all fail their suites.
- Propagation: one new class (registered in `class-docs.json`, docs regenerated) and three changed rules. All 8 consumer types inherit them.
- Version: 0.30.0

---

## Production consumer: shipthisgroup.com - interactive primitives that do not answer the pointer
Date: 2026-08-10
Verdict: FAIL (one L2 gap; closed)

### Gap #61
- Type: L2
- Scope note: audited only the interactive primitives shipthisgroup.com actually renders, enumerated from the live DOM across the home, event and channel pages rather than from the library index: `strand-btn` (+ primary/secondary/ghost/icon-only), `strand-link` (+ inherit/mono), `strand-nav__logo`, `strand-skip-link`, `strand-tabs__tab`.
- Symptom: **the nav wordmark had no hover and no pressed state.** Measured on production with `:hover` asserted as actually matching, and not one computed property changed -- not colour, opacity, transform, decoration, background or background-size, on either the home page or an event page. On the graduated domain the wordmark is the ONLY way home, so the primary navigation affordance gave no feedback at all and read as decoration. Separately, `.strand-tabs__tab` had hover and focus but no `:active`, so a click on the channel filter registered only once the filter had already changed: the interface answered the result rather than the press.
- Fix: colour-only states on both. The wordmark rests at blue-midnight, hovers to blue-deep and presses to blue-abyss; the tab presses to gray-700 against its gray-600 hover. Contrast measured at every state on the page background -- 10.70:1, 5.83:1, 17.13:1 for the wordmark and 7.21:1 to 9.85:1 for the tab -- so no state trades legibility for feedback, and both press DARKER than they rest, which is the direction `.strand-btn--primary` already takes into blue-abyss.
- Colour only, deliberately: the wordmark's size, weight and tracking are specified by the design language, and a metric change on hover would also reflow the nav.
- The transition added to the wordmark carries a reduced-motion reset **at matching specificity**, both `(0,1,0)`, per Gap #56. `.strand-tabs__tab` already had one.
- Checked and NOT changed: `.strand-link` has no `:active` and should not get one. Link.css records a deliberate decision that hover must not shift colour, because a hover state has to meet contrast too and blue-vivid reaches only 4.45:1; the growing underline already carries the affordance. Adding a pressed colour would reopen a question that was closed on evidence.
- Two audit-method notes, both cases where the first measurement was wrong:
  - The source scan initially reported `strand-btn` as having no loading state. It has one; the regex isolating the base class excluded modifiers, so `.strand-btn--loading` never matched.
  - The browser scan initially reported `.strand-link--mono` as having no hover. It has one, and works. The probe had hovered an element that never received hover. Asserting the precondition (`el.matches(":hover")`) is what distinguished a real gap from a failed probe, and it is the same discipline as asserting `matchMedia("(prefers-reduced-motion: reduce)").matches` before trusting a reduced-motion measurement.
- Propagation: two CSS rules plus a transition and its reset. No new classes, no new tokens, parity unchanged. All 8 consumer types inherit them.
- Guards mutation-checked: removing the hover rule, making the press lighter than rest, and dropping the reduced-motion reset each fail.
- Version: 0.31.0

---

## Production consumer: shipthisgroup.com - loading regions that reserve nothing, and a language that never asked them to
Date: 2026-08-10
Verdict: FAIL (one L3 gap; closed)

### Gap #62
- Type: **L3** (design language, not library). Recorded as L3 deliberately, because the L2 reading is tempting and wrong: a `Reserve` class could have been added without touching the spec, and it would have been the third private answer to the same question. `docs/design-language.md` 6.6 Loading States specified what a placeholder LOOKS like (shimmer keyframes, spinner) and said nothing about the space it occupies or how it hands over to content. Every consumer that hit this had to invent both, so the spec was the thing that was incomplete.
- Symptom, measured not read: `make measure-cls URL=https://shipthisgroup.com/event/ship-002` reports desktop 0.0070 and mobile 0.0204, while the home page and the channel page both report 0.0000. Attribution names `div#evt-interactive`, `div#evt-channel-affordance` and `div.strand-mt-4`, each Δy=42. Cause: the event page ships `<div id="evt-reveal">` EMPTY and fills it from a later POST, so it reserves zero height and everything beneath it drops 42px when the data lands.
- Why the score understates it: the harness holds `/api/` back 1200ms on purpose. Without that hold the same URL reports a genuine 0.0000 whenever the response beats first paint, on a page that visibly jumps. A reservation bug is invisible to any measurement that races it.
- The second consumer symptom, which is what makes this a language gap rather than one page's bug: the home page reaches 0.0000 by hand-mirroring. Its focal skeleton has to track `FeaturedEvent`'s box model row for row, kept honest by a bespoke unit test that exists only to catch the two markup trees drifting apart. That is a consumer maintaining a dimensional invariant the library should own. Two consumers, two different workarounds, same missing idea.
- Spec fix (first, per the protocol): new 6.6.1 The space contract and 6.6.2 Placeholder to content. 6.6.1 states the obligation and gives a mechanical test that needs no judgement -- delay the response arbitrarily and measure; if the reservation is honest the score does not move. 6.6.2 makes the handover a cross-fade rather than a replace, opacity only, and states that **reduced motion removes the fade and never the reservation**, because dropping the space contract along with the animation makes the reduced-motion experience jumpier than the default and inverts the preference.
- Library fix: `.strand-reserve` with `__placeholder` and `__content` elements. Both layers occupy ONE grid cell, so the region self-sizes to the taller of the two and the swap is structurally incapable of moving layout -- the fix is the geometry, not a number someone has to keep up to date. `min-block-size` supplies an optional floor from `--strand-reserve-h` / `-md` / `-lg`, each falling back to the one below, so a reservation can differ per breakpoint (a box sized for a one-line title under-reserves when it wraps to three on a phone). No default floor: defaulting to a number would invent a reservation nobody asked for.
- Degradation was designed, not left to chance: with no `data-strand-reserve` attribute at all the placeholder is `display:none` and the content shows, so a server-rendered consumer that never flips an attribute gets a plain wrapper rather than a blank region.
- `visibility` rides the opacity transition so the faded layer leaves the accessibility tree and stops taking pointer events, rather than sitting invisible over the layer the user is reading. The placeholder is `aria-hidden`; the content never is.
- Propagation: Preact/React (`Reserve.tsx`), Svelte (`Reserve.svelte`), Vue (`Reserve.vue`), and the standalone CSS bundle, which picks the stylesheet up automatically because `vite.config.ts` globs `components/<Dir>/<Dir>.css`. Bootstrap and Bulma inherit through the class layer with no mapping change. Tokens-only consumers set the three custom properties directly. The class layer is the primitive and the components are thin wrappers over exactly those classes, so a vanilla-HTML consumer flipping the attribute by hand gets identical behaviour -- this is deliberately not Preact-first.
- Parity: `Reserve` added to `parity-manifest.json#/components` (48 total).
- Version: 0.32.0 (spec, primitive, framework mirrors, standalone CSS). Completed in 0.32.1: the first release shipped the CSS to the vanilla-HTML and Bootstrap consumers but not the DOCS, so two of the eight had the primitive and no way to learn its markup contract. `scripts/data/class-docs.json` is the source for those tables and it was missed. Caught by asking what each consumer type actually receives rather than by a gate; the parity check verifies classes are present in the bundle, not that they are documented.

### Gap #63
- Type: L2 (library). Follow-on to #62, found by the first consumer of the primitive #62 shipped.
- Symptom: a `Reserve` region whose content resolves to NOTHING never collapses. Measured against the built CSS at 896px, real signed-out reveal content: pending 42px, ready-with-content 42px, **ready-with-empty-content 42px**, and only taking the placeholder out of flow gives 0px.
- Cause, and the thing I had wrong: the ready state sets the placeholder to `opacity:0; visibility:hidden`, and `visibility:hidden` PRESERVES LAYOUT. Both layers share `grid-area: 1/1`, so the invisible placeholder still occupies its cell and sizes the region. I proposed a fix to the consumer that removed `--strand-reserve-h` instead; the floor was never what held the space open, so that fix does nothing. The consumer measured it, said so, and was right.
- Consumer impact: they shipped `ph.style.display = "none"` from page JavaScript. The workaround was correct and its location was wrong. `check-governance` could not catch it because the style is set at runtime rather than authored in markup, so the Strand-purity gate never saw it. Worth knowing that the gate has that blind spot.
- Fix: a third state, `data-strand-reserve="empty"`, which sets the placeholder `display:none` and shows the content. Plus an `empty` prop on all three framework wrappers, winning over `ready`.
- Deliberately NOT automatic. Collapsing when the fade ends would also fire whenever content is merely SHORTER than its placeholder, silently converting a mis-sized reservation into a late shift, which is the exact defect the primitive exists to surface. "Nothing arrived" and "less arrived than I reserved" are different facts and only the consumer knows which happened.
- The DL gained the general rule rather than just the mechanism: a region must be resolved on every path INCLUDING FAILURE. The consumer's second finding was that a `!res.ok` return and a `catch` both left the region waiting forever, because the resolve sat in the success branch. A region that shimmers forever is worse than the shift it replaced, and no layout-shift score will ever show it because nothing moves.
- **Testing gap, recorded because it is why this shipped:** every Strand test runs in jsdom, which does not lay out, so no test in this repo can distinguish `visibility:hidden` from `display:none` by height. The unit tests assert the state attribute; the only real layout assertion lives downstream in the consumer's `make measure-cls`. A browser-based layout harness would have caught this before publish. Not added here, because adding Playwright to a published library is a bigger decision than this fix.
- Version: 0.33.0

### Gap #64
- Type: **outside the L1/L2/L3 hierarchy, deliberately.** That hierarchy classifies gaps in the PRODUCT: docs, primitive, or specification. This is a gap in the repository's ability to detect gaps in the product, which is a different axis. Recorded with the mismatch named so a future session does not force-fit it to a layer and then argue about which one.
- Symptom: gap #63's own postmortem records it. "Every Strand test runs in jsdom, which does not lay out, so no test in this repo can distinguish `visibility:hidden` from `display:none` by height. A browser-based layout harness would have caught this before publish. Not added here, because adding Playwright to a published library is a bigger decision than this fix." So a fully published primitive shipped a collapse bug and the library learned about it from a consumer.
- Measured, not read. Probed against the `Reserve` primitive under the existing jsdom tier, comparing the correct 0.33.0 stylesheet with the 0.32.0 stylesheet that carried the bug:
  - `offsetHeight` of a region with a declared 42px floor: **0**
  - `getBoundingClientRect().height` of the same region: **0**
  - `offsetHeight` of an element with a literal `min-block-size: 42px`: **0**
  - computed `min-block-size` where the value is `var(--strand-reserve-h, auto)`: the literal string **`"var(--strand-reserve-h, auto)"`**, unresolved
  - `window.matchMedia`: **not a function**
  - correct empty state vs broken empty state, by height: **0 and 0**, indistinguishable
- Four independent blindnesses, and they compound: no layout, no `var()` resolution, no media queries, and (the trap) a WORKING cascade for literal properties. Computed `display` did come back `none` against the correct sheet and `block` against the broken one, so a proxy assertion was technically available. It is still the wrong test: it asserts the mechanism rather than the outcome, locks the implementation, and goes green for the wrong reason the moment the implementation legitimately changes. The claim worth making is "the region has no height", not "the placeholder is display none".
- Fix: `scripts/layout-check.mjs`, run as `pnpm test:layout`, wired into `test:all` and into CI. Renders the CLASS LAYER against the built stylesheet in real Chromium and measures the boxes. Sibling to `test:contrast`, which is the same species of check (a promise the design language makes, mechanised) and whose own header already documents the boundary this tier fills: "this is a static check over the CSS ... runtime effects are out of reach of any static check".
- Subject is the class layer, not the components, and that is what makes it affordable. The class layer is the primitive and every framework wrapper is a thin wrapper over exactly those classes, which `pnpm test:parity` enforces independently. One browser boot therefore covers all eight consumer types. Testing the Preact component instead would buy one consumer's coverage for the same cost, and would test Preact rather than Strand.
- NOT visual regression. No baselines, no pixel diffs, no approval step. Each case states a numeric contract and a failure prints the measured number beside the expected one, so it reads as "expected block-size 0, measured 42" rather than as an image that differs somewhere.
- Never skips. If Chromium is absent it exits non-zero with the install command rather than no-opping. Same lesson as the staleness rot already recorded in `ci.yml`: a check that quietly passes when it cannot run is worse than no check, because the green tick then asserts that geometry was verified.
- **Acceptance evidence, the whole thesis in one command.** The 0.32.0 defect was reintroduced into `Reserve.css` and the CSS rebuilt. Against that identical broken library: the jsdom tier ran its 15 `Reserve` tests and **exited 0, all passing**; the layout tier **exited 1** and named the defect, `Reserve/empty state collapses to nothing: "region" expected block-size 0, measured 42`. Reverted and both are green.
- Found while building it, and now guarded: `dist/` is gitignored, so the local built stylesheet can lag the source. On this tier's first run the local copy predated the 0.33.0 fix by a week and the tier faithfully measured a library nobody was running. It failed, so it was obvious. The dangerous direction is the opposite one, a stale build still CONTAINING a fix while the source has regressed, which reports green. `checkBuildFreshness` compares the newest hand-authored stylesheet against the built bundle and refuses to run when the build is behind.
- Cost: one browser launch, one page, cases grouped so the viewport is resized once per width rather than once per case. **9 cases, 9 assertions, 0.2s** including browser boot. Wired into `test:all` and deliberately NOT into `pnpm test`, so the inner development loop stays jsdom-fast.
- Scope discipline, which is what keeps it fast enough to actually get run: a primitive earns a case only when its reason for existing is a statement about space. Most do not. `Badge` has padding; that is a value, not a promise, and the static tier already reads it. `Reserve` promises that a swap cannot move the page, which is a claim about rendered geometry.
- Coverage at landing, all `Reserve`, the primitive that motivated the tier: empty collapses to zero; pending holds the box; the pending-to-ready swap measures identically (the no-shift invariant, which is the entire reason the primitive exists); a declared floor is honoured; no floor invents no reservation; the base floor holds below 768; the md floor takes over at 768; md keeps holding at 1024 when no lg floor is set; and no state attribute at all degrades to a plain wrapper. The three breakpoint cases are ones jsdom cannot evaluate at all.
- Design recorded in `docs/testing-tiers.md`, including the tier boundary table and the rule the whole document exists for: know which tier owns your claim before you write the assertion, because an assertion placed in a tier that cannot evaluate it does not fail, it passes.

## Production consumer: shipthisgroup.com - every state change is a hard cut, and the language never said it should not be
Date: 2026-08-11
Verdict: FAIL (one L3 gap)

- **Correction, added 2026-08-11 at this gap owner's request: #64 shipped with a defect, and #65's publish was its first casualty.** Adding the layout tier gave `pnpm test:all` an ENVIRONMENT PRECONDITION rather than just another dependency: two of its tiers now drive real Chromium. `.github/workflows/ci.yml` gained the install step. `.github/workflows/publish.yml`, the other caller of `test:all`, did not. One grep for callers would have found it.
- Consequence, measured rather than inferred: EVERY Publish run failed from that commit onward, while CI stayed green on the same shas. `npm view @dillingerstaffing/strand-ui version` returned **0.33.0** while main sat at 0.34.0. A downstream consumer's sync pulls from npm, so the #65 primitive was built, tested, documented, reviewed and pushed, and could not be consumed by anyone.
- The tier's FAILURE MODE was correct and is the only reason this surfaced: it refused to certify itself, named the cause, and printed the fix command, per the rule in docs/testing-tiers.md. But it surfaced at publish time rather than at review time. A correct failure mode is not a substitute for tracing blast radius.
- Durable fix in #65 rather than another comment: `scripts/browser-preflight.mjs` runs FIRST in `test:all` and fails with the install command. A comment in workflow A cannot protect workflow B, which is exactly how this happened.

### Gap #65
- Type: **L3** (design language, not library). Same reasoning as #62 and the
  same temptation to get it wrong: a `.strand-settle` class could be added
  without touching the spec, and it would be the next private answer to a
  question the language has never asked. `docs/design-language.md` Part VI
  specified motion for an element ENTERING the viewport (6.4), for the POINTER
  touching a control (6.5), and for DATA arriving after a wait (6.6, plus
  6.6.1/6.6.2 added by #62). It specified nothing for the moment the MODEL
  changes under a stable layout, which is the most common motion in an
  application. There was no rule to implement, so the spec was the incomplete
  thing.
- Symptom, measured rather than read. New instrument in the consumer repo,
  `make measure-state-motion URL=https://shipthisgroup.com/event/ship-020`,
  which mutates each region the way the client mutates it and asks
  `document.getAnimations()` what ran:

  | probe | desktop | mobile |
  |---|---|---|
  | rsvp count (a seat is taken or released) | NOTHING | NOTHING |
  | rsvp control swaps to confirmation | NOTHING | NOTHING |
  | channel join control flips to joined | NOTHING | NOTHING |

  6 of 6. Every state change on the product is a hard cut.
- **Why nothing has ever caught this, and why it needed an instrument.** A hard
  cut throws no error, moves no layout, fails no axe rule, breaks no keyboard
  path, and renders the correct final value. It is invisible to every gate in
  either repo. The only detector in service today is a human saying the product
  feels like a form, which is not a regression test and does not run on a
  branch. The same scan that found nothing also confirmed `.strand-reserve` IS
  present in the loaded stylesheets, which is what makes the finding specific
  rather than a broken probe: the platform has a LOAD primitive and no STATE
  primitive.
- Spec fix, first per the protocol: new 6.9 State change and 6.9.1 Identity is
  what triggers it. 6.9 derives every parameter from one fact -- the user
  initiated it, so the motion CONFIRMS rather than introduces. That gives fast
  (`--strand-duration-fast`, because a slow confirmation reads as a slow page),
  opacity only (a translate would claim the content arrived from somewhere; it
  did not arrive, it BECAME), and a mechanical test that needs no judgement.
- Library fix: `.strand-settle`, one class and one keyframe, plus a `Settle`
  wrapper in each framework package. No JavaScript in the primitive: a keyframe
  animation runs when an element enters the DOM, so the trigger is the framework
  replacing a node, which every framework already does.
- **The boundary against Reserve is the design decision worth recording.**
  Settle is motion-ONLY and deliberately cannot touch layout. Reserve owns the
  BOX; Settle owns the MOMENT. If two states differ in size that is a
  space-contract problem (6.6.1) and belongs to Reserve or to the surrounding
  layout. A motion primitive asked to absorb a size change ends up animating
  height, which 6.8 bans and which is a layout shift wearing an easing curve.
  Keeping this primitive structurally incapable of sizing anything is what makes
  that misuse impossible rather than merely discouraged.
- **The trap the framework wrappers exist to close.** A class alone animates an
  INSERTION. The most common state change in an application -- a count going
  from 6 to 7 -- patches a text node and inserts nothing, so a consumer who
  reads only the class contract gets a primitive that appears installed and
  animates nothing. Hence 6.9.1 and the `on` prop, which derives the key so the
  correct behaviour is the default rather than a thing to remember (Principle 8).
- Both load-bearing mechanisms verified in a REAL browser against the consumer's
  production bundle before any of this was written, because jsdom can answer
  neither: it runs no animations at all, which is the same blind spot that let
  #63's collapse bug reach a consumer.
  - changed key -> the DOM node is REPLACED: true
  - unchanged key -> the same node is reused, nothing re-announces: true
  - unkeyed control -> the node is reused, which is precisely today's hard cut: true
  - a bare keyframe fires on insertion with no JS: `animationstart` observed
  - the reduced-motion reset leaves the element at opacity **1**, not parked at
    the `from` frame. This one was worth checking rather than assuming: the
    house style of zeroing a duration would, with `animation-fill-mode: both`,
    still apply the `from` frame and could leave an element permanently
    invisible for exactly the users who asked for less motion. `animation: none`
    is correct and a zeroed duration is not.
- Reduced-motion reset sits at MATCHING specificity (0,1,0) and later in the
  file, per #56. There is deliberately no `--modifier` and no descendant form of
  this class, so there is nothing that could later out-specify the reset -- the
  bug #56 documents is structurally unavailable here rather than merely avoided.
- **Testing gap, unchanged from #63 and now more acute -- and the layout tier
  does NOT close it.** Every Strand test runs in jsdom, which runs no
  animations, so a `Settle` that animates nothing passes every jsdom test that
  can be written. The browser-layout tier landed alongside this gap measures BOX
  GEOMETRY, which is a different measurement: it would confirm that a Settle
  region does not change size and say nothing at all about whether it animated.
  An earlier draft of this entry credited it with closing the gap and that was
  wrong. Geometry and motion are separate instruments and each is only competent
  at its own question.
  - jsdom CAN test the real contract underneath, and those are the guards
    shipped here: a changed `on` replaces the node, an unchanged `on` does not.
    That is what makes the animation fire, so it is the invariant that matters
    even though the animation itself is out of reach.
  - The animation is closed by a third tier, `scripts/motion-check.mjs` +
    `pnpm test:motion`, probing `document.getAnimations()` in real Chromium.
    Ported from the consumer's `make measure-state-motion`, where it was built
    first and where it produced the six-way baseline above.
  - All three tiers share one rule, arrived at independently in each: an
    instrument that cannot run must FAIL rather than skip, and an empty run is a
    failure rather than a vacuous pass. "0 of 0 rules broken" is how a
    measurement aimed slightly wrong announces success.

---

## Production consumer: shipthisgroup.com - a target you cannot reach, and a language that only specified how big it was
Date: 2026-08-11
Verdict: FAIL (one L3 gap; closed)

### Gap #66
- Type: **L3** (design language, not library). The L2 reading is available and wrong for the same reason as #62: a dock class could have been added without touching the spec, and it would have been the second private answer to a question the language never asked. `docs/design-language.md` 14.7 Touch Targets specified how BIG a target must be (44x44, WCAG 2.5.8) and said nothing about WHERE on the screen it can be touched. Size without position is half the constraint.
- Symptom, measured not read, with a purpose-built instrument in the consumer repo (`make measure-thumb-reach URL=https://shipthisgroup.com`): 2 of 27 controls can NEVER reach the bottom third of the viewport however the user scrolls. The pinned nav "Sign in" is in the hard band permanently, and it gates every capability on the site for a signed-out visitor. "Sign in to RSVP", the single conversion action, sat 40px short of the band.
- **The library had already hit this itself, which is what settled the classification.** `strand-ui.css` `.strand-ref-mobile-trigger` is a bottom-anchored FAB carrying `bottom: calc(env(safe-area-inset-bottom, 0px) + 16px)`. Strand needed "put this where a thumb can reach it", solved it, and scoped the solution to its own documentation shell where no consumer can land on it. That is `.strand-detail-panel` in gap #92 repeated, and it is #62's "two consumers, two different workarounds, same missing idea" with the library itself as one of the two.
- **The measurement that makes this tractable, and the reason the obvious audit is wrong:** scrolling moves content UP, so a control sits at its lowest viewport position at scroll offset 0 and every scroll only raises it. A control whose document centre is above two thirds of the viewport height therefore can never reach the thumb zone, and that is a permanent property of the layout rather than of where the user happens to be. The corollary is that a control BELOW THE FOLD is not a reach defect at all: the user carries it into the thumb zone on the way past. The consumer's queue had filed this as "12 of 16 actions below the fold", and 25 of 27 of those turn out to be trivially reachable. Reach and discovery are different constraints with different fixes.
- Spec fix (first, per the protocol): new 14.8 Target Position, with a mechanical test that needs no judgement, an explicit statement of what it rules OUT as a finding, and the corollary that the top nav is the worst place in the layout for a primary action.
- Library fix: `.strand-actiondock`. Fixed rather than sticky, because sticky stops at its scroll container's end, which is exactly where a reader is most likely to act. Hidden by default and translated fully out of the viewport rather than faded, so a dock a consumer never drives occludes nothing and an absent attribute is the safe state. `visibility` rides the transition so a hidden dock leaves the accessibility tree instead of sitting invisible over the content. Reduced motion removes the ANIMATION and never the positioning, the #62 lesson restated: dropping the transform with the transition would strand the control off-screen for someone who asked only for less movement.
- The safe-area inset is the reason this is a primitive rather than four lines each consumer writes. On a notched phone the home indicator overlaps the bottom of the viewport, and headless browsers resolve `env(safe-area-inset-bottom)` to 0, so a consumer testing locally never sees the bug they shipped.
- **Guidance shipped with it, because the failure mode is overuse:** it carries the ONE action a view exists to produce, and it shows only while the in-flow control it stands in for is off screen. A dock competing with the real control is two live buttons for one action. Two docked actions is a bottom toolbar, a different pattern.
- Accessibility is a recorded JUDGEMENT rather than a derivation: the docked control usually duplicates one already in the accessibility tree, so the copy takes `aria-hidden` and `tabindex="-1"` to avoid a duplicate announcement and tab stop. This assumes reach is a thumb problem, which is true for the thumb and worth re-examining if a dock ever carries an action with no in-flow equivalent. That exception is stated in the component doc rather than left implicit.
- Verified in the layout tier, which is the only tier that can evaluate any of it: 4 cases, and every one positional. **A negative control was run rather than assumed, and it found a defect in my own first case.** With `position: absolute` the dock still satisfied "block-start at least 562.67" while sitting at document y=3000, completely off screen: "below the thumb zone's start" and "in the thumb zone" are different claims and only a PAIR of bounds expresses the second. Both bounds are now asserted. With `position: static` the corrected case fails at block-end 3019, and with `absolute` the scroll case fails at block-start -1175. At scroll offset 0 `absolute` and `fixed` are genuinely indistinguishable, so the scroll case is the discriminator and the tier's `scroll: { y }` field is what makes the primitive testable at all.
- Inset clearance on a notched device is NOT covered and is marked pending rather than approximated: it needs a browser context from a device descriptor, which is a second grouping dimension in the layout runner. Incomplete and visible beats silently wrong.
- Propagation: Preact/React (`ActionDock.tsx`), Svelte (`ActionDock.svelte`), Vue (`ActionDock.vue`), and the standalone CSS bundle via the vite glob. Bootstrap and Bulma inherit through the class layer. Tokens-only consumers use the class directly. `scripts/data/class-docs.json` updated in the SAME change rather than a follow-up release, which is the one thing #62 got wrong at 0.32.0.
- Parity: `ActionDock` added to `parity-manifest.json#/components` (50 total).
- Version: 0.35.0

### Gap #67
- Type: **L2** (library), but the defect is not a missing primitive. The primitive existed and was good. What was missing was any connection between the two pipelines that decide whether a component reaches a consumer.
- **The mechanism, which is the whole finding:** CSS is GLOB-INCLUDED, and JavaScript is EXPORT-GATED. `packages/strand-ui/vite.config.ts` walks `components/<Dir>/` and concatenates `<Dir>.css` into the bundle with no reference to exports at all, while `src/index.ts` decides what enters the JS bundle. So a component that is written but not exported ships its stylesheet to every consumer on every page while its component is absent, and nothing anywhere notices.
- Symptom, measured on a live consumer site rather than argued: the served stylesheet contained 13 `strand-command-palette` rules while the served JS contained zero occurrences of `CommandPalette`. About 3.2 KB raw, 1.2 KB gzipped, of rules that cannot match an element, downloaded by every visitor. Roughly 2.2% of the CSS the site loads.
- **Nobody made a mistake, and that is why a guard was needed rather than a lesson.** Four ordinary steps: the component was committed unexported to clear a machine-wide build break; the glob shipped its CSS regardless; a downstream `sync` carried it into that repo's main inside a commit about something else entirely; and it reached production. Every step was locally reasonable.
- Library fix, half one: export `CommandPalette` as a real L2 across every consumer type per the protocol. Preact was already written and is now exported; Vue and Svelte are real implementations (16 and 15 tests), not stubs to satisfy a checker. Parity goes 50 to 51 canonical components.
- Library fix, half two: `scripts/css-export-parity.mjs`, wired into `test:all` BEFORE `test:parity` so a structural problem surfaces ahead of the slow browser tiers. **Both halves in one commit, deliberately.** The export alone leaves the hole open for the next component; the guard alone fails on the very thing it was written for. Together they read as one statement.
- **The guard is NOT "every stylesheet needs an export", and that distinction is what makes it correct.** `Banner` ships `Banner.css` with no component ON PURPOSE: its consumer injects the markup server-side and never mounts anything, and for the CSS-only and Bulma/Bootstrap consumer types the classes ARE the API. A naive check condemns Banner, and whoever ran it would either delete a working primitive or switch the check off, both worse than the orphan. So the invariant is: every component stylesheet is EITHER backed by an export OR declared in `parity-manifest.json#/cssOnlyComponents` with a reason.
- It separately fails a STALE declaration, a component declared css-only that later gains an export. Left alone that is not untidy, it is a hole: it would keep a future orphan of the same name invisible.
- An empty scan is a FAILURE rather than a pass. If the glob or the path ever moves, the check would otherwise report success having inspected nothing, which is precisely the failure mode it exists to catch in others.
- **Two defects found while porting, both fixed in all three consumers, and the first is the more instructive.** `scrollIntoView` is absent in jsdom and in any non-browser renderer, and the bare call rejected on every selection change. It surfaced as TEN unhandled rejections sitting behind SIXTEEN passing tests, with the summary line reporting PASS and not lying about the assertions. Reading past a green summary is the only thing that finds that. Second: `tabindex="-1"` on the options, correct for the ARIA combobox pattern (programmatically addressable, never a tab stop). Only the click-without-keydown warning carries a scoped ignore, because the keyboard path is Enter on the combobox acting through `aria-activedescendant`, so per-option key handlers would be unreachable code.
- Bundle: 63 to 66 KB gzipped. Three of that is the palette existing in three consumers rather than haunting one. No budget is recorded anywhere, so no gate was crossed; the figure is noted here so the jump is explainable later rather than mysterious.
- Propagation: Preact/React (`CommandPalette.tsx`), Vue (`CommandPalette.vue`), Svelte (`CommandPalette.svelte`), and the standalone CSS bundle via the vite glob. Bootstrap and Bulma inherit through the class layer. `scripts/data/class-docs.json` updated in the SAME change (11 classes), per #62's lesson.
- Parity: `CommandPalette` added to `parity-manifest.json#/components` (51 total).
- Version: 0.36.0

### Gap #68
- Type: **L2** (library). Sibling of #67 and the same shape: two things that should imply each other, with nothing checking. There it was stylesheet and export; here it is export and test.
- **What it cost, rather than what it risks.** `CommandPalette` was published to npm across every consumer type with ZERO tests on its canonical Preact implementation, while every other component in that package carried one. The result was a live, user-facing defect: a keyboard user could not type into the command palette, because Dialog focuses the first focusable element in its panel and that is its own close button, so a visitor opened a search overlay and typed into a button. Two reviewers looked at that release. Both checked parity, docs, bundle size and the tests that DID exist. Neither noticed the absence of a file, because an absence is the hardest thing to see in a diff.
- Fix: `scripts/component-test-parity.mjs`, wired into `test:all`. Every component a consumer can import has a test, in every package that ships it. `strand-ui`'s exports are the source of truth for "shipping"; a directory in a port is itself the signal.
- **The escape hatch is the important half, and it was immediately misusable.** Some components have no behaviour jsdom can evaluate, so a rule demanding a jsdom test would force worthless tests, and a rule that forces worthless tests gets deleted. A component may instead declare the tier that covers it in `parity-manifest.json#/browserTierOnlyComponents`, naming the tier so a reader can go and check. It also fails a STALE declaration, for the #67 reason: a declaration outliving its need would hide a future untested port of the same component.
- **I nearly used that hatch on its first candidate and was wrong to.** The guard's first run reported `ActionDock` untested in Vue and Svelte, and ActionDock is a positioning primitive whose contract is geometry, so the exemption looked obviously correct. Checking the CANONICAL implementation settled it the other way: `ActionDock.test.tsx` asserts six things that are not geometry at all (the hidden default, the visibility attribute, the control staying mounted while hidden, class merging, attribute pass-through, no structural wrapper). The behaviour was testable; only the tests were missing. **The existence of a test on the canonical implementation is the evidence that decides whether an exemption is honest.**
- **Writing the missing tests found a real cross-consumer defect, which is the whole argument for the guard.** Svelte's `ActionDock` spread `$$restProps` AFTER its `class` attribute, so a consumer passing `class="my-dock"` REPLACED `strand-actiondock` rather than adding to it. The dock lost its positioning entirely and rendered as an ordinary in-flow div: exactly the failure the primitive exists to prevent, and invisible, because the element and its content were still on the page. Preact and Vue both merged; only this port did not. `class` is now an explicit prop, merged.
- Result: 153 component implementations tested, 0 declared. The hatch exists and is currently unused, which is the right state for it.
- Version: 0.36.4

---

## Production consumer: a search control the library drew but never shipped
Date: 2026-08-12
Verdict: FAIL (three L2 gaps; all closed)

### Gap #69
- Type: **L2** (library). A primitive that a consumer could only reach by hand-writing class strings.
- Symptom, measured rather than argued: `.strand-search-bar` and its five elements are fully styled in the bundle, and there is no `SearchBar` in any of the eight consumer types. `ls packages/strand-ui/src/components | grep -i search` is empty, `grep -i search packages/strand-ui/src/index.ts` is empty, and the same holds in Vue and Svelte. A consumer wanting a search control had exactly one route: copy five class names out of the stylesheet into their own markup. That is the CSS-only consumer type's contract being imposed on the Preact one, and a design system whose first control is class-strings-only has no framework story at all.
- **Root cause, and it is the more interesting half: the classes are not in a stylesheet of their own.** They are defined inside `InstrumentViewport/InstrumentViewport.css`. `InstrumentViewport` IS exported, so gap #67's guard paired that file with an export and passed it. The guard reasons about stylesheet FILES; nothing in the repo reasoned about their CONTENTS. See #70, which closes that.
- **Not fixed by exporting a component over the existing classes, and the reason is the whole design decision.** `.strand-search-bar` is the overlay that floats ON a map: `position: absolute`, a dark translucent gradient, `backdrop-filter`, an instrument shadow, and a `--shifted` modifier sized against a results panel beside it. What the new consumer needs is ordinary page furniture in the document flow on a light surface. The two share `display: flex` and an input reset, and nothing else. Making one class serve both would mean a base carrying the overlay's positioning and a modifier spending half its declarations undoing it, which is exactly the reset-then-restyle shape Principle 8 rejects. And the overlay has a live consumer whose markup carries no modifier class, so a re-based class would have broken it silently.
- Fix: **`SearchField`**, a new primitive with its own block, across all eight consumer types. `variant="field"` is the fixed-width presentation, `variant="full"` spans its container, and they differ in exactly one property, which is why it is a prop rather than a second component. The overlay is untouched and keeps its name.
- **The box is reserved from first paint**, which is the requirement that shaped the implementation: every dimension is declared, none derives from content, and nothing about the resting state waits on JavaScript. 6.6.1's space contract applied to a control rather than to a loading region. The first consumer puts this in a fixed header, the one place in a layout where a late-appearing box moves every pixel below it.
- **Three deliberate divergences from the visual target, all of them accessibility, and all in the same direction.** (1) The target's 36px control height is correct under a mouse and fails SC 2.5.8 under a thumb, so the floor rises to 44px at `pointer: coarse` rather than at a width breakpoint: a narrow desktop window is still a mouse and a wide tablet is still a thumb. (2) The icon and placeholder are specified `gray-400`, which 14.2b puts in the FILL tier at 2.52:1: below the 4.5:1 the placeholder owes as text and below even the 3:1 SC 1.4.11 asks of the icon as a graphical object. Both take `gray-500`, which clears both thresholds on the recessed surface the field sits on (4.77:1). (3) `::placeholder` sets `opacity: 1`, because some engines apply a UA opacity that would composite the chosen token back toward the surface and undo the ratio it was chosen for; 14.2b's note that opacity multiplies against every ratio is not only about reveals.
- **A real cross-consumer defect, found by the parity tests rather than by review, and it is the Vue mirror of #68's Svelte finding.** Vue puts unrecognised attributes on the ROOT element by default, so once `$attrs` was bound to the input explicitly, a consumer's `id` landed on the wrapper AND the input: a duplicate id in the document, and the wrapper holding the handle the consumer meant for the control, which would make `getElementById(...).focus()` a silent no-op. `inheritAttrs: false` fixes it. Preact and Svelte were both correct. The port that gets attribute forwarding wrong is a different one each time, which is the argument for asserting it in all three rather than reasoning about it once.
- Also corrected while porting: the Svelte implementation was written with `createEventDispatcher`, and Svelte 5 removed `component.$on`, so a dispatched event has no supported instance-side listener. The house convention here is already a callback prop (`Alert` ships `ondismiss`), and the port now matches it. Its `class` is an explicit merged prop from birth rather than left to `$$restProps`, per #68.
- Tests: 13 Preact, 12 Vue, 12 Svelte. Geometry is deliberately NOT asserted in jsdom, which neither lays out nor resolves media queries; the reservation and the coarse-pointer floor belong to the layout tier.
- Propagation: Preact/React, Vue, Svelte, and the standalone CSS bundle via the vite glob. Bootstrap and Bulma inherit through the class layer. Tokens-only consumers use the classes directly. `scripts/data/class-docs.json` updated in the SAME change, per #62's lesson.
- Parity: `SearchField` added to `parity-manifest.json#/components` (52 total).

### Gap #70
- Type: **L2** (library). Sibling of #67 and #68, and the third of the same shape: two things that should imply each other with nothing checking. #67 paired a stylesheet with an export; #68 paired an export with a test; this pairs a stylesheet's FILENAME with its CONTENTS.
- **The blind spot, stated exactly:** #67's guard walks `components/<Dir>/<Dir>.css` and asks whether `<Dir>` is exported. It can only see a component that has a file of its own. A class defined inside a NEIGHBOUR's stylesheet is invisible to it, and therefore invisible to every guard in the repo, because the parity manifest, the component count and the test-parity check are all keyed on component directories.
- **What the sweep found, which is why this is a discovery and not a tidy-up:** 39 foreign block definitions across 15 stylesheets. Three kinds, and they are not equally benign. (1) Cosmetic, where a component's class name differs from its directory name: `Button`/`strand-btn`, `Tag`/`strand-chip`, `ScrollReveal`/`strand-reveal`. (2) A helper that plainly belongs to its component, like `Table`/`strand-table-wrapper`. (3) **Independent primitives hiding in a neighbour.** `InstrumentViewport.css` defines thirteen foreign blocks, among them the search overlay, the results panel, the result card, the detail panel, the map pins, the cluster marker and the map legend: seven primitives with no component in any consumer type, no parity entry and no test. `Card.css` defines five `strand-channel-*` blocks, which is one consumer's domain markup sitting in a general-purpose library.
- **The distinction that makes the check correct, and without which it would be turned off within a day:** contextual styling is legitimate and pervasive. `.strand-instrument-viewport .strand-progress--bar` is the dark cascade doing its job, and reading that as InstrumentViewport DEFINING Progress would report ten false positives in that file alone. So the rule is structural rather than a name list: a selector whose whole body is one compound is defining the block it names; a foreign block reached through any combinator is being scoped. Comments are stripped first so a class named in prose does not count.
- **Recorded as a ratchet rather than enforced clean, and stated plainly because a silent allowlist is worse than no allowlist.** Failing on all 39 would have meant either renaming published classes across every consumer in one change, or somebody switching the check off; both are worse than the debt. `parity-manifest.json#/foreignBlocks` records every one, with a note naming the three kinds and saying which are real work. A NEW foreign block fails. A STALE entry also fails, for #67's reason: a record outliving its need would hide a future foreign block of the same name.
- **A negative control was run rather than assumed.** Appending `.strand-totally-new-thing` to `Card.css` exits 1 and names the file, the class and both remedies; removing it exits 0; the file is byte-identical afterwards. Without that, "the guard passes" would be evidence of nothing.
- Tests: 21 added to `scripts/__tests__/css-export-parity.test.mjs` (35 total), covering block extraction through pseudo-classes and attributes, selector lists, self-qualifying compounds, the descendant case in both directions, ActionDock's concatenated class form, and both ratchet directions.

### Gap #71
- Type: **L2** (library). An omission from an existing cascade rather than a new principle, which is what keeps it out of L3: DL 9.3 already establishes the dark island and this repo already implements a nine-rule cascade for it.
- Symptom: `.strand-progress--bar` sets its track to `gray-200`, correct on a light card and INVERTED on the cabinet. A near-white bar on the abyss reads as FULL, with the blue fill marking the portion that is empty. A meter that states the opposite of the truth is worse than one that is merely hard to read, which is why this is a defect and not a polish item. `grep "instrument-viewport .strand-progress"` returned nothing: `strand-progress` was simply absent from a cascade that already covered nine other classes.
- Fix: the bar's background and the ring's `stroke` both take `--strand-instrument-border` inside `.strand-instrument-viewport` and `.strand-body--instrument`. Two rules because the two shapes paint their track with different properties, so the first cannot reach the second.
- **The fill is deliberately unchanged.** `blue-primary` measures 5.35:1 on the abyss and clears SC 1.4.11's 3:1 for a non-text graphical object, so the value that is right on light is right here too. The defect was the track, and changing the fill as well would have been a change nobody could point at a threshold to justify.
- An existing token rather than the `rgba(255,255,255,.15)` a mockup specifies: 16.3 forbids a raw value, and the instrument border is already this cabinet's "subtle structure on dark", which keeps the empty portion of the meter in the same blue family as the fill.

### Gap #72
- Type: **L2** (library). No responsive visibility utility existed. `grep -rn "strand-hide\|strand-show"` across the built bundles returned nothing; 48 `@media` blocks exist and none of them is a display utility. The nearest thing, `strand-stack--responsive`, changes stack DIRECTION.
- Why it is a library gap and not a consumer's problem: three separate surfaces need the same thing at once, and each would otherwise invent it. Without a utility the only route is choosing a presentation by measuring the viewport in JavaScript, which renders the control a frame late and shifts whatever region it lands in, and renders nothing at all until hydration.
- Fix: `strand-hide-below-{sm,md,lg,xl}` and `strand-hide-from-{sm,md,lg,xl}`. Exact complements, so a pair covers every viewport once with no overlap and no gap.
- **Hide-only, deliberately.** A matching show utility would have to guess an element's natural display and would flatten a flex or grid container into a block the moment it became visible. An element is shown by not being hidden.
- The breakpoints are written as literals, which is the one sanctioned place in the library for that: a media query is evaluated before custom properties resolve, so `@media (min-width: var(--strand-breakpoint-md))` never matches. The values restate the tokens and the reason is recorded beside them.
- Documented alongside 6 pre-existing utilities that had been shipping undocumented (`strand-truncate`, `strand-flex-none`, `strand-nav-offset`, `strand-hero-grid`, `strand-bar-chart--sm`, `strand-bar-chart--lg`): they were in `static.css` and absent from `class-docs.json`, so `generated/html-reference.md` rendered each as a row with an empty description. `class-docs.json` global classes go 126 to 140.

### Observation, recorded because it is evidence rather than a gap
Every divergence in #69 ran in the same direction: the visual target failed WCAG and a Strand token fixed it. Three separate failures in one design, and a fourth and fifth reported independently by another consumer audit of the same artefact. A design system dogfooded against a visual target is usually described as the target improving the system. Here the system improved the target, and the mechanism was that the tokens carry their thresholds and the mockup's hex values do not.

---

## Production consumer: an application shell the language had no navigation for
Date: 2026-08-12
Verdict: FAIL (one L3 gap, one L2 gap; both closed)

### Gap #73
- Type: **L3** (design language, not library), and the classification is the OPPOSITE shape to #62 and #66, which is what makes it worth stating carefully. There the spec was SILENT and a private answer would have been the second or third one to an unasked question. Here **the spec is not silent, it says the other thing**: 19.1 answers "what is mobile primary navigation" with "hamburger collapse into a slide-down panel". Shipping a bottom tab bar as a pure L2 would leave the language asserting something its flagship consumer contradicts, and no amount of library code fixes a spec that disagrees with reality.
- **The tension was already inside the document, which is the real finding.** 19.1 puts mobile primary navigation in a control pinned to the top bar. 14.8, added at 0.35.0, says "the top navigation bar is the worst place in the layout for a primary action" and proves it: it is fixed, so scrolling cannot improve it, and it is in the hard band by design. Both statements shipped, in the same specification, for one release cycle. A reader following 19.1 builds the thing 14.8 forbids.
- Spec fix (first, per the protocol): **new 19.1.1, a CONDITION on the question 19.1 already answers**, not a new section describing a widget. A content surface keeps the hamburger, because its destinations are visited rarely and the cost is one stretch on the way past. An application shell does not, because its destinations are the product's top level, moved between repeatedly in a session, so the same cost is multiplied by the number of switches. That multiplication is precisely the case 14.8 was written about.
- The mechanical test needs no judgement: **count the destinations** (under three is a link, over five cannot sit in a row at 320px without truncating a label, and a truncated destination is not a destination), and **ask whether one is reached repeatedly in a session or once on the way in**. Outside three to five, or once, it is a content surface whatever else is true of it.
- What it rules OUT is stated with equal weight, per 14.8's house form: a surface has ONE primary navigation, so a bottom bar coexisting with a hamburger is two answers to one question; and this does not replace the dock, because a dock carries the one ACTION a view produces while this carries DESTINATIONS, and a viewport wanting both must decide which belongs nearer the thumb rather than stacking them into a wall.
- **11.5 was amended in the same change, deliberately.** It restated 19.1's mobile answer as a bare bullet, so amending only 19.1 would have created exactly the internal contradiction this gap is about. It now defers to 19.1.1 rather than carrying a second copy of the answer.
- Library fix: `.strand-tabbar`. Fixed rather than sticky, for 14.8's reason. The safe-area inset is why this is a primitive rather than four lines each consumer writes: headless browsers resolve `env(safe-area-inset-bottom)` to 0, so a consumer testing locally never sees the bug they ship. `strand-tabbar-offset` reserves the space on the SCROLLING CONTENT, sharing one token with the bar so a taller bar cannot outgrow its reservation; without it the last item of every list sits permanently under the navigation, which is the defect every fixed bottom bar ships with.
- **`aria-current="page"` is both the announced state and the styling hook**, so there is no way to paint the current destination without also telling a screen reader which one it is. A class plus an attribute would be two facts that can disagree.
- **An item with a href stays a link.** Rendering every destination as a button would silently remove middle-click, open-in-new-tab and the status-bar preview, and nothing would report it.
- **A real defect found by reading past a green summary.** jsdom logged "Not implemented: navigation" on every click test while all of them passed. That noise was the product bug: without `preventDefault` a consumer wiring `onNavigate` to a client-side router gets BOTH the route change and a full page load on top of it, discarding the application. Now the handler owns the click only when it will handle it, and a modified or middle click falls through untouched WITHOUT firing the callback, because the user asked for a new tab and the current view is not the one changing.
- **Four divergences from the visual target, all accessibility, continuing the run recorded at #69.** 9px labels are off the type scale entirely (4.2's smallest step is text-xs at 11.1px), and adding a rung to hold one label would be a specification change made to fit a widget, so tracking recovers the density instead. Inactive labels specified `gray-400` at 2.52:1 are words, so 14.2b makes them text at 4.5:1. The mockup carries no safe-area inset. And the active label specified `blue-primary` measures **3.29:1** as text, so it takes `blue-deep` at 5.99:1.
- **That last one was caught by `test:contrast`, not by review, and it found more than my code.** `blue-primary` as an active-item text colour is not only the mockup's choice: **DL 19.3 specifies it too**, for an active tab, in the specification's own words. So the design language currently prescribes a failing text colour in at least two places (19.3's active tab and 11.1's placeholder). Logged here; the correction is a separate L3 already assigned.
- Geometry lives in the layout tier, in real Chromium: four cases proving the bar sits in the easy band at scroll 0, holds that position at scroll 2000, ends at the viewport edge, and that a destination clears 44px in BOTH dimensions at 320px with five items, which is the tightest case 19.1.1 permits.
- Tests: 16 Preact, 13 Vue, 13 Svelte. Propagation: all eight consumer types; `class-docs.json` updated in the SAME change, per #62.

### Gap #74
- Type: **L2** (library). A missing primitive, and the gap is SEMANTIC rather than visual: the shape already existed and the meaning did not.
- Symptom: search on the target surface is palette-driven -- the visible control opens an overlay and the query is typed there. #69 shipped `SearchField`, a real `<input>`, which is the wrong primitive for that even though it is pixel-correct.
- Root cause, three separate defects if an input is used: (1) an `<input>` that opens a modal when focused is **WCAG 3.2.1 On Focus**, so a keyboard user tabbing through a header is thrown into an overlay; (2) a field the user can genuinely type into, whose text is handled somewhere else, gives one query two homes and matching two entry points; (3) **`role="search"` around a text input promises assistive technology that typing works here**, and wiring that to "your keystrokes go to an overlay" makes the promise false at the AT layer, which is worse than a plainly labelled button.
- The mockup supports the reading and was misread the first time: the regions it shows are non-interactive spans styled to look like fields, and no caret appears in either.
- Fix: **`SearchTrigger`**, a `<button>` with `aria-haspopup="dialog"`, composed on top of `strand-search-field`'s classes so the box has exactly one definition and the two controls cannot drift apart. A layout-tier case measures both at 36x300 rather than asserting that they share a class, because sharing a class is a fact about source and matching is a fact about pixels.
- **Rejected: a variant prop on SearchField.** One component carrying two root elements and two accessibility contracts is the reset-then-restyle shape Principle 8 rejects, expressed in semantics instead of CSS. Share the styles, split the semantics.
- **No `aria-label` override, and that is a decision rather than an omission.** WCAG 2.5.3 (Label in Name) requires the accessible name to contain the visible text, so a speech-input user saying the words they can see activates the control. An `aria-label` of "Search" over visible text of "Search events" breaks that. The visible label IS the name.
- `SearchField` is kept. A real search input is a reasonable thing for the library to own, and it has no consumers today, so nothing migrates either way.
- Tests: 12 Preact, 11 Vue, 11 Svelte, plus the shared-box layout case.

### Tooling, found while shipping the above
- **The layout tier could not assert width.** It measured `inlineSize` on every rect and had no assertion kind for it, so every claim about width was either smuggled in as a claim about height or left untested: **14.7 is a 44x44 rule and only one of those numbers was checkable**, so a touch target 44px tall and 12px wide passed. Added `inlineSize`, `inlineSizeAtLeast`, `inlineSizeAtMost` and `equalsInlineSize`.
- **A negative control on those kinds found a bug in my own edit**, and it is the instructive one: the cross-subject comparison's failure branch still referenced a variable the edit had removed. **Every case in the real set passes, so that branch never executes during `pnpm test:layout`** -- the suite was fully green while the code that reports a mismatch was broken. Pinned by unit tests covering all three prose branches, since a green run cannot reach them.

---

## Production consumer: a month grid, and a rule about containers that cannot resize
Date: 2026-08-12
Verdict: FAIL (one L3 gap, one L2 gap; both closed)

### Gap #75
- Type: **L3** (design language). Two additions, both stated without reference to calendars, because a calendar is a component and a design language holds principles.
- **The first gap: no rule for a fixed-size cell holding variable content.** Every remedy the language offers assumes the container can be made to fit. 10.4 shrinks children so they stop breaching their parent, 10.5 reduces nesting so there is more room, and 5.5's grids reflow their column count to suit the content. None of those exists when a cell's size is fixed by an external fact. **5.5 is the sharpest evidence** and it is what settled the classification: its only grid rule is `auto-fit` with MINIMUM child widths, which does not merely fail to cover a fixed seven-column field, it prescribes the opposite behaviour and cannot be applied to it. Part XXI covers a container with too little content; nothing covered one with too much.
- **13.2 is the precedent that proves the gap by being scoped.** "Maximum 6 series per chart. If more than 6 categories exist, group or filter" is a bounded capacity with a deterministic remedy. The language HAS stated this rule -- exactly once, for chart series, with an authorial remedy applied before rendering.
- Spec fix: **new 10.6 Bounded Cells.** A bounded cell declares a visible capacity and renders the remainder as a count, never as clipped content. Capacity is measured at the cell's SMALLEST sanctioned size, because a cell showing three items on a desktop and clipping two on a phone has a capacity of two. The remainder is stated rather than implied, because a fade or a cut-off glyph is information loss the reader cannot detect, which is worse than showing less. The overflow affordance sits INSIDE the reserved height, since a cell that grows when it overflows moves every cell beside it (6.6.1's space contract). And scrolling inside a cell is not an answer: a scroll region smaller than a thumb fails 14.7, and a field of independently scrolling cells has no reading order. Mechanical test, and a "what this rules out" clause distinguishing a bounded cell from a 5.5 auto-fit grid.
- **The second gap: Part XI-B had no production for a matrix where both axes carry meaning.** `column-array` is one-dimensional -- its columns are a sequence, the bar heights encode the data, and 11.13's own test says reordering them loses nothing the labels do not restore. A field where a cell's identity IS its row and column could not be derived from any rule in the grammar, and 11.12 says a composition that cannot derive is either a new atom or a missing production.
- Spec fix: **new `well-plate` production**, with an inverse test to `column-array`'s: shuffling rows or columns must be IMPOSSIBLE without changing meaning, and a plate that still reads correctly after a shuffle has a decorative second axis and wanted a `ranked-sequence`. Wired into 11.11's containment precedence and 11.13's test table.
- **On the metaphor, since Principle 10 requires one and a forced metaphor is worse than none.** The microplate holds up: a tray of wells indexed by lettered row and numbered column, each holding one sample, is structurally the thing being described rather than a decoration applied to it. It also names the constraint -- a well is a fixed volume, which is 10.6 -- so the two additions explain each other. Recorded as a judgement rather than presented as obvious.

### Gap #76
- Type: **L2** (library). `CalendarGrid`, the first consumer of both new rules.
- **A real defect in the date arithmetic, caught by a test and then generalised into a sweep.** The row-count loop terminated when a week ended outside the month, which is wrong for a month ending exactly on a week boundary: February 2026 is 28 days starting on the week start, so its fourth week ends on the 28th, still inside February, and the grid grew a fifth row of March. **Eleven months in twelve end mid-week**, so every example test that happened to pick one of those passed. Replaced with a comparison against day 0 of the next month, and the examples replaced with a property sweep over **168 month/week-start combinations across seven years**, asserting that every row is a full week, every day of the month appears exactly once in order, no in-month day is marked adjacent, the row count stays between four and six, and every row starts on the configured week start. The sweep asserts its own iteration count, because an empty sweep reporting success is the failure this repository keeps finding in other people's checks.
- **Dates are built from local y/m/d, never parsed from strings.** `new Date("2026-08-01")` parses as UTC midnight and renders as July 31 for anyone west of Greenwich, which turns a calendar off by one for half the world. Pinned by a test asserting the emitted `iso` key agrees with the local date it was built from.
- **`abbr` was wrong and the type checker found it.** Preact rejected `abbr` on a span, and the deeper answer is that `abbr` is only valid on `<th>` and does nothing on a div with `role="columnheader"`. Replaced with a visible abbreviation marked `aria-hidden` beside the full weekday name in `strand-sr-only`, which survives translation tools and user stylesheets that `aria-label` does not.
- **`test:contrast` caught the adjacent-day date at 2.52:1.** "Dimmed" reached for `gray-400`, which 14.2b puts in the fill tier; a date is a number the reader reads, so it is text at 4.5:1. `gray-500` still reads as quieter than an in-month date's `gray-600` (5.09 against 7.21), so the distinction survives above the line rather than below it. **That is the third component in two releases where the same fill-tier-as-text mistake was caught by the gate rather than by review**, which is the argument for the gate.
- Geometry is in the layout tier, where 10.6's mechanical test can actually be run: a well holding eight items measures identical to an empty one, and a well containing a 34-character unbroken word is the same width as its neighbour -- the reason the template is `minmax(0, 1fr)` rather than `1fr`.
- Keyboard is the full ARIA grid pattern: one tab stop with a roving tabindex, arrows by day and week, Home and End within the WEEK rather than the month, PageUp and PageDown by month, and a year boundary crossed correctly in both directions.
- Vue's `<script setup>` cannot carry exports, so the month arithmetic moved to its own module in that package. Better regardless: a pure function is worth testing without mounting anything, and all three ports now assert the same 168-combination sweep, which is the anti-drift mechanism for logic that necessarily exists three times.
- Tests: 26 Preact, 15 Vue, 15 Svelte, plus two layout-tier cases. Propagation: all eight consumer types; `class-docs.json` updated in the same change.

---

## Production consumer: a sidebar the library built three times and never shipped
Date: 2026-08-12
Verdict: FAIL (one L3 doc correction, one L2; both closed)

### Gap #77
- Type: **L2** (library). The clearest dogfood signal in the log, because the library is all three of the consumers that needed it.
- Symptom: a filter rail beside a results area cannot be built from Strand's public API. There are NO width, flex-basis or sizing utilities of any kind. `--cols-2` is two equal halves, which a rail is not. `--auto-260` is `auto-fit` and gives four columns at 1200px, because it varies the column COUNT when the requirement is one fixed track and one that absorbs the remainder. `strand-stack--horizontal` with `strand-flex-none` leaves the rail at CONTENT width, so it changes size with the longest filter label.
- **Root cause, and it is the textbook case:** Strand made this exact decision three times and published none of them. `.strand-ref-shell` is `256px minmax(0, 1fr)`, `.strand-ref-example` is `200px minmax(0, 1fr)`, `.strand-ref-taxonomy__list` is `160px 1fr`. All three are `strand-ref-*`, the reference site's own shell, where no consumer can reach them. That is gap #66's `.strand-ref-mobile-trigger` and gap #62's "two consumers, two different workarounds" repeated with the library as all three consumers.
- **Classified L2 and not L3, and the distinction is worth recording because it looks like the CalendarGrid case and is not.** CalendarGrid was L3 because the design language was SILENT on a fixed matrix while 5.5 prescribed `auto-fit` with minimum child widths, so inventing one would have changed the specification by implication. Here nothing in the language is contradicted or extended: `strand-ref-shell` IS Strand applying this pattern to itself, at a number it already chose. **L3 is "someone must decide". L2 is "someone already decided and did not publish it."**
- Fix: `.strand-grid--sidebar`, plus a `sidebar` prop on `Grid` in all three framework ports.
- **`minmax(0, 1fr)` rather than `1fr`, and the base rule does not already cover it.** A bare `1fr` floors at the track's min-content width, so one long unbroken string in the main area widens the whole grid and pushes the rail off screen. `.strand-grid > * { min-width: 0 }` handles the ITEM; this handles the TRACK. They are different things and only the second one is being fixed here. Measured in the layout tier with an 80-character unbroken token.
- **The preset is a class, not an inline template, and the component emits no `gridTemplateColumns` when it is on.** The column definition changes at a breakpoint, an inline style cannot carry a media query, and an inline declaration would out-specify the class at every width. Pinned by a test in each port asserting the inline property is empty, including when a stale `columns` or `minColWidth` is also passed.
- **Below md the rail stops being a rail.** 264px beside anything at 390px leaves the main track unusable, so the grid becomes one column and the two regions stack in source order. That is why the guidance says put the rail FIRST: a filter the reader meets after the results it filters is one they have already scrolled past.
- Geometry in the layout tier, which is the only place the number means anything: the rail measures 264 at 1280, holds 264 with an 80-character token in main, and equals the main track's width at 390.
- Tests: 4 per port. Propagation: all eight consumer types; `class-docs.json` updated in the same change.

### Gap #78
- Type: **L3** (design language). A doc correction, and the sweep found **seven** failing prescriptions rather than the two that were reported.
- Symptom, computed rather than eyeballed, against the worst light surface the language sanctions: **11.1**'s form placeholder at `gray-400` (2.29:1); **11.3**'s status indicators, all NINE rules, at `teal-vital` (2.27), `blue-primary` (2.99), `amber-caution` (1.96), `gray-400` (2.29) and `red-alert` (3.43); the **Part VI link example** at `blue-primary`; **19.3**'s active tab label; **19.4**'s current page at `blue-primary` on `blue-glow` (**2.96:1**); **19.5**'s footer links and copyright at `gray-400`; and **21.2**'s empty state at `gray-400`. Every one is a fill-tier value painting text.
- **The library was corrected before the specification was.** Gap #53 moved badges and the danger button to the deep rung and gap #51 moved 36 declarations to the text tier, both enforced by `pnpm test:contrast`. The DL's own examples were never touched, so for several releases the documented values were the failing ones while the shipped values were not, and anyone reading the spec to learn the system learned the defect.
- Fix: all seven corrected to the text tier of the same hue. Two are worth stating because they are not simple substitutions. **19.3's active tab now takes DIFFERENT rungs for its border and its label** -- `blue-primary` for the 2px border, which is a graphical object at 3:1, and `blue-deep` for the word, which is text at 4.5:1. Same hue, two tiers, chosen by what each declaration paints. And **11.3 now carries a note that a status rendered as a GLYPH keeps the fill tier**, since a tick is a graphical object; only the word owes 4.5.
- **The preventive rule, which is the actual deliverable.** This correction has now been made independently at least four times, and a rule that must be rediscovered is documented badly. New **14.2c "Dimmed" Is Not a Tier** records the mechanism: the mistake is never a colour decision, it is a WORD decision. The author reaches for an English adjective first -- dimmed, muted, quiet, secondary, inactive -- and the palette obligingly contains a value that looks like the adjective. Every one of those is a fill-tier value, and the adjective says nothing about whether a reader will READ the thing. The one-second test is stated ("is a reader going to read this?"), along with two traps that catch people who already understand the tier: a tint of the same hue LOWERS the ratio it appears to raise (blue-primary is 3.29 on white and 2.96 on blue-glow), and one element can need both tiers at once. A pointer lands in Part III.7 as Rule 7, where someone picking a colour actually looks.
- Recorded in 14.2c, deliberately: every instance found so far, including this specification's own. The pattern is visible rather than anecdotal, and the closing line states the asymmetry that caused it -- `pnpm test:contrast` reads the built CSS and gates the library, and prose has no such gate.

---

## Production consumer: four primitives a consumer could only reach as class strings
Date: 2026-08-12
Verdict: FAIL (four L2 gaps, one L1; all closed)

### Gap #79
- Type: **L2** (library). `MapLegend`, `MapLoading`, `ResultCard` and `ResultsPanel` shipped as CSS with no component in any of the eight consumer types, so Path A could not be satisfied for them and the only route was hand-writing class strings. Gap #69's finding, now closed for the four that are ordinary Preact-rendered DOM.
- **`strand-map-pin` and `strand-cluster-marker` are deliberately NOT included.** maplibre's `Marker` takes an `HTMLElement` and assumes ownership of its positioning and destruction, so a component wrapper would be ceremony returning `element` anyway. Library-owned DOM is a real exemption from Path A and this is what it looks like.
- Semantic decisions worth recording, because each is a place the obvious implementation is wrong: a legend row is a **button only when it filters** (a legend that explains is not interactive, and a button role adds a tab stop per row and promises an action that does not exist); a result card is a **button only when it is selectable** (a card that pans a map owes the keyboard what it gives the mouse, one that only displays does not); the loading screen **defaults to visible** (it covers a booting instrument, so a consumer who forgets to drive it should see a loading screen rather than a half-painted map) and **hides by class rather than unmounting**, because unmounting cuts the opacity transition and reveals the map mid-paint; and the results panel has **three states, not two**, because a failed request and an empty result are different answers and the retry affordance belongs only to the one that did not run.
- Tests: 27 Preact, 25 Vue, 25 Svelte.

### Gap #80
- Type: **L2** (library). Moving those four out of `InstrumentViewport.css` broke **two guards at once**, and both breaks are the same shape: a derivation keyed on a file boundary that was only ever true by accident.
- **`css-export-parity` first.** The four had been recorded as foreign-block debt inside InstrumentViewport.css; giving each its own directory resolved four of the 39 entries. The extraction then had to be done twice, because the first pass moved top-level rules and left the `@media` blocks behind: a media block's SELECTOR is `@media (...)`, so it matched no owner and stayed put with its contents. A grouped selector spanning two primitives (`.strand-map-legend, .strand-coord-readout`) had to be split as well, since a shared rule makes each file look like it defines the other.
- **`test:contrast` second, and this one would have shipped six confident and entirely wrong findings.** Its dark-cabinet set was derived from one file's contents, on the stated reasoning that "InstrumentViewport.css IS the dark cabinet". That held only while every dark primitive lived in that file. The moment four of them moved, they left the dark set and were judged against a light surface they are never painted on: `.strand-result-card__salary` was reported at **1.71:1** for a value that is correct on the abyss. The cabinet is a FAMILY, so membership is now declared in `parity-manifest.json#/darkCabinetComponents` and every member's stylesheet is read. An empty or missing declaration is a hard failure rather than a pass, because it would silently judge every dark primitive against the wrong surface.
- **The extraction was verified rather than assumed, and the first verification was not good enough.** A whole-rule diff of the built CSS reported 3 lost and 8 gained, which looked alarming and was an artefact of comparing media BLOCKS: splitting one block into two changes both. Re-run at the level that matters -- (media context, single selector, declarations) triples -- the answer is **1245 declarations before, 1245 after, zero lost, zero gained.** A diff at the wrong granularity is how a lossless refactor gets reverted and a lossy one gets shipped.

### Gap #81
- Type: **L2** (library). `CalendarGrid` had no fixed row count, so paging the month resized the page.
- Symptom, measured by a consumer: six rows for August 2026, five for September, four for February, at about **112px a row**, moving everything beneath the grid every time a member turns the month.
- **L2 and not L3, and I checked rather than assumed** because the shape resembles #75. The obligation already exists twice over: 6.6.1's space contract says a region must reserve its space so arriving content does not move the page, and 10.6 says a bounded cell must not grow its row. This is the same obligation one level up -- the grid must not grow its page -- so it needed a prop and no new rule. Had it required a NEW statement, it would have been L3; it does not.
- `fixedWeeks` pads from the adjacent months, which the grid already renders and already marks, so a padded row is the same context the first and last rows always carry rather than a blank band. **Six is the value that never truncates**, proven over seven years of months rather than asserted. Padding costs and duplicates no real day, which is pinned separately.

### Gap #82
- Type: **L1** (documentation). The generated reference contradicted the specification, in the direction of being stricter.
- `docs/design-language.md` 19.1.1 says a viewport wanting both a tab bar and a dock "must decide which belongs nearer the thumb rather than stacking them into a wall". The reference said "19.1.1 forbids stacking the two", which reads as forbidding coexistence outright. Same text in all three consumer `HTML_REFERENCE.md` mirrors, because they are copies.
- **It cost real time**: a session read the reference, concluded its item was impossible as briefed, and only found the discrepancy by going to the specification. Their framing is the one that matters: **the reference is the doc a session actually greps**, so a correct specification behind an incorrect reference is a specification nobody reads.
- Corrected at the source (`scripts/data/class-docs.json`) and in the three component doc comments carrying the same claim, then regenerated so all four reference files agree. The wording now states what 19.1.1 actually permits, including that mutually exclusive BY STATE is a legal answer -- which is the reading a consumer had already shipped against.
- **This is the second instance today of the library and the specification disagreeing**, after the seven contrast prescriptions where the DL's own examples had never been updated to match what `test:contrast` enforces. Both times the library was right and the prose was wrong. See #83.

### Gap #83
- Type: **L2** (tooling). The gate that makes 14.2c enforceable rather than prose defending prose.
- **The asymmetry, stated plainly:** `pnpm test:contrast` reads the built CSS and fails on any pairing below its threshold. Prose has no gate. That is why gap #51 and gap #53 corrected 36-plus declarations in the library while `docs/design-language.md` kept prescribing the failing values, and why a hand sweep in #78 found **seven** rather than the two that had been reported. Seven is what one hand sweep finds; a gate is what finds the eighth.
- `scripts/doc-contrast-check.mjs` parses the fenced CSS blocks in the specification, extracts `color:` declarations naming a palette token, and applies the same thresholds against the same light surfaces, with the darkest binding. Wired into `test:all` beside its sibling.
- **Deliberately narrow, twice.** Only ```css fences, because a markup example carrying a colour is not a prescription about colour. And only `color:` -- `background`, `border-color`, `stroke` and `fill` are fill-tier uses answering to 3:1, and auditing them against a text threshold would reproduce inside the check the exact mistake the check exists to catch. A test pins that, along with the boundary guard that stops `border-color` matching as `color`.
- **Verified against the defect it was built for.** Reintroducing five of #78's original prescriptions makes it exit 1 and name all five with their ratios, tokens, selectors and line numbers; restoring them makes it exit 0; the specification is byte-identical afterwards. An empty scan is a failure rather than a pass, for the reason this repository keeps rediscovering.

---

## The published budget nothing enforced
Date: 2026-08-12
Verdict: FAIL (one L3 gap; closed)

### Gap #84
- Type: **L3** (design language). The specification stated a limit AND stated that a build step enforced it. Neither half was true.
- Symptom: `docs/design-language.md` 16.1 read "Total library size | < 50KB gzipped | **Build step validation**". The artifact was **78KB**, and no build step validated anything. `measure-bundle` computed the figure on every release, wrote it into `parity-manifest.json`, and exited 0 whatever it found. **The number drifted 63 to 66 to 71 to 77 to 78 across a single day**, underneath a document asserting both a ceiling and a gate.
- **The defect is the claim of enforcement rather than the number.** A budget nothing checks is a comment; a comment that says "enforced" is worse than no comment, because it is read as evidence. Gap #67 had already recorded "no budget is recorded anywhere", which was simply wrong -- 16.1 recorded one -- and that error survived because nobody could check it against anything.
- **The number was not exceeded by carelessness, and this is what decided the shape of the fix.** Measured: the CSS bundle is **~1.11KB gzipped per component**. At the 31 components the library had when 50KB was written -- a figure Appendix A.2 still carried, itself stale -- that same efficiency yields about 47KB, under the old budget. **The library did not become wasteful, it became larger.** A 59-component library cannot be 50KB at any plausible efficiency, so the old figure had silently become a cap on how many components could exist, enforced by nothing and therefore ignored.
- Fix: 16.1 now carries **three** readings, each failing on something the others cannot. A **total ceiling** (85KB) catches unbounded growth and must be raised deliberately. A **per-component average** (1.35KB) catches systemic drift, and stays flat as the library grows. A **single-component ceiling** (12KB) catches one careless component.
- **The third number exists because I tested a claim about the second and it was false.** The average was written to catch a bloated component; the test asserting that failed. 12KB of sloppy CSS spread across 59 other components moves the average from 1.11 to 1.29 and passes a 1.35 limit. **Averages hide outliers.** The claim was wrong, so the budget gained a reading rather than the claim being softened into something true but useless.
- **Today's largest component is recorded as a symptom rather than a baseline.** `InstrumentViewport` is 11.2KB because it still contains the nine foreign block families of #80. The ceiling admits it and nothing more, is documented as expected to FALL when that debt is paid, and a unit test pins it close enough to today's value that extracting those blocks forces someone to lower it.
- **The gate imports `measure()` from `measure-bundle` rather than restating the artifact list.** Two lists of "what the library ships" is the same defect shape as everything else found today: a second derivation of one fact, correct until one of them moves. It also required guarding `measure-bundle`'s entry point, because importing it ran `main()` and REWROTE the manifest the gate was about to read -- a check that refreshes its own input can never detect a stale one.
- Also corrected: the 50KB figure appeared in three further places (A.1, A.2 and 15.4's tribal-resonance table), and A.2's component count still read 31 against an actual 59. All four now state the real figures and point at 16.1.
- Zero bytes or zero components is a hard failure rather than a very good result, for the reason this log keeps rediscovering.

---

## Production consumer: three layout primitives, and a trap in one I had just shipped
Date: 2026-08-12
Verdict: FAIL (three L2 gaps; all closed)

### Gap #85
- Type: **L2** (library). No sticky utility existed. The library's only `position: sticky` is `.strand-ref-shell__sidebar`, the reference site's own shell, where no consumer can reach it. Same shape as #77: the library decided once, privately.
- Three named consumers, all on the redesign's critical path: a filter rail, a day rail, and a commitment rail.
- The offset is a custom property rather than a family of utilities, because the value a consumer needs is whatever their fixed chrome occupies and the library cannot know it.
- **THE FINDING THAT MATTERS IS THE TRAP IT WALKED INTO, in a primitive I had shipped four releases earlier.** `.strand-grid` set `overflow: hidden` for 10.4 Boundary Integrity. `hidden` also makes an element a SCROLL CONTAINER, and a `position: sticky` descendant sticks to its nearest scroll container -- so a sticky rail inside the sidebar grid stuck to a box that never scrolls and scrolled away with the page. **This is the exact composition `--sidebar` was added for: a filter rail beside a result list.** Measured: the rail held its 24px offset for 24px and was at -1176 by scroll offset 1200.
- Fixed with `overflow: clip`, which clips identically for 10.4's purposes and creates no scroll container. Pinned by a layout-tier case using the real composition rather than a synthetic one.
- **And the harness was measuring the library without its tokens.** The first sticky case failed at -1200 with no overflow ancestor at all, which made no sense until the fixture was read: `layout-check` loaded `strand-ui.css` and NOT `tokens.css`, so every `var(--strand-*)` in a measured rule resolved to nothing. It had gone unnoticed for every case before this one, because they assert either a RELATIONSHIP (equal heights, equal widths) that survives the substitution, or a literal px value that never needed a token. It surfaced the first time a case depended on a token for a POSITION: `inset-block-start: var(--strand-space-6)` resolved to nothing, and `position: sticky` with no offset behaves like `position: relative`. **The primitive was correct and the instrument was wrong**, which is the third time today a measurement has been the thing at fault.

### Gap #86
- Type: **L2** (library). No non-wrapping scrollable row. `strand-stack--horizontal` plus `--wrap` is the obvious composition and the wrong one, because wrapping is exactly what a mobile filter strip must not do: a strip that wraps to three lines pushes the content it filters off the screen.
- **The behaviour already existed and no consumer could reach it.** `.strand-tabs [role="tablist"]` has carried it since it was written, with the reasoning in its own comment. But it is selector-scoped to a role, so reaching it from a filter strip means declaring `role="tablist"` on something that is not a tablist -- announcing "tab 3 of 7" for a filter, and promising arrow-key panel switching that does not exist. Not L1 for that reason: no correct composition exists.
- `.strand-scroll-row` **scrolls rather than clipping**, a stated divergence from any mockup specifying `overflow: hidden` with `nowrap`. A filter the reader cannot reach is not a filter, and clipping hides them with no affordance whatsoever. Accessibility over fidelity, which is the third of the three sanctioned causes.
- Two details that are the difference between working and nearly working: `overflow-y: visible` so a child's focus ring is not clipped by the scrollport (declaring only `overflow-x: auto` computes the other axis to `auto` as well), and `overscroll-behavior-x: contain` so flicking to the end does not then drag the page behind it. Children get `flex-shrink: 0` from the row, since without it they squeeze to fit and the row never scrolls.
- Recorded debt: `Tabs` predates this and still carries its own copy of the behaviour. Adopting the utility there means adding a class to the rendered markup in three ports, which would break hand-written vanilla tablist markup, so it is a separate change with its own migration note rather than a rider on this one.

### Gap #87
- Type: **L2** (library). `.strand-grid--split`: a flexible main track beside a fixed panel. `--sidebar` mirrored, with the fixed track wide and on the right.
- Measured against every preset that shipped: at 1280, `--cols-2` gives two equal columns, `--auto-lg` gives three, and `--sidebar` gives a 264px right-hand track. Nothing produced "one flexible track and one fixed wide one".
- **The second defect is the one worth stating, because it would have shipped silently.** `--cols-2` is not merely a poor fit on mobile, it is wrong on desktop: a 1fr/600px split at 1440 gives 840 and 600, where two equal columns give 720 and 720. That is a panel **20% wider** and a main track **14% narrower** than designed, and it reads as a layout choice rather than a defect. Its own author flagged it against themselves.
- The panel width is `--strand-split-panel` because the two known consumers want 600px and 380px for an identical shape. A second preset for a second number would be two names for one idea.
- The MAIN track comes first in the markup, the opposite of `--sidebar`, and for a symmetrical reason: below the breakpoint the regions stack in source order, and a map or a detail panel is what the list is ABOUT, so it follows the thing it illustrates rather than preceding it.

---

## Production consumer: the most visible card in the product, on the wrong dark
Date: 2026-08-12
Verdict: FAIL (one L3 gap; closed)

### Gap #88
- Type: **L3** (design language). The language admitted ONE dark surface role and the product needed two.
- Symptom: the design's feature card is `blue-midnight`; `InstrumentViewport` paints `blue-abyss`. Verified across every class painting midnight as a background: `.strand-btn--primary:hover` and three `strand-ref-*` reference-page internals. **A button hover state and the documentation site's own chrome.** Nothing reusable, so the flagship card was composing `InstrumentViewport` and rendering the wrong dark.
- **9.3 was titled "The Instrument Viewport (Dark Mode Island)", singular**, and `blue-midnight` was documented at III.2 as "Headlines on light backgrounds" — a text colour. Painting a card with it contradicted its own documented role, so this could not be an L2: a second dark surface role is a statement about what the language contains.
- Spec fix: **9.3 becomes "The Dark Surfaces"** and admits two roles, stated in terms of what each is FOR rather than in terms of any product's card. The instrument viewport is the abyss and exists for DENSITY, where fine marks and thin type need the darkest ground the language sanctions. The feature surface is midnight and exists for EMPHASIS, where one element is lifted out of a list. The test that separates them is stated: **is the darkness carrying data, or carrying emphasis?** Also recorded: a view with several feature surfaces has no feature, and an instrument viewport nested inside a feature card is legitimate because they do different jobs. The III.2 token entry now documents both uses and points at 9.3.
- **The argument for two ROLES rather than one role and two background colours is a contrast fact, and I found a second instance of it than the one reported.** Midnight is about 2.5x lighter than the abyss, so the instrument's text values do not survive the move. Measured against the real token file:

  | | on abyss | on midnight |
  |---|---|---|
  | `gray-400` | 6.99 | **4.36 fails** — the abyss cascade uses it for OVERLINES |
  | `teal-vital` | 7.07 | **4.42 fails** — the abyss cascade uses it for STATUS VALUES |

  The report named the first. The second was found by measuring every value in the cascade rather than the ones already suspected. **Porting the instrument cascade would have shipped two failing text colours into the most prominent element on the page**, and a bare `background: midnight` utility would have done it silently, handing a consumer the right box and the wrong contents.
- Library fix: `FeatureSurface`, whose cascade is the primitive and whose background is almost incidental. Overlines and the quiet tier take `gray-300` (7.46) where the instrument takes `gray-400`; the status value takes white rather than the accent, because a status is carried by its label and not by tinting a number below a legible ratio; the meter's fill stays `blue-primary`, correct at 3.34 as a graphical object where it would fail as a word.
- Registered in `parity-manifest.json#/darkCabinetComponents`, so `test:contrast` judges it against the dark surface rather than a light one — the derivation fixed in #80, now doing its job for a new member on the first try.
- **Fourth mockup value the sweep has caught failing AA**: `rgba(255, 255, 255, .45)` composites to `#8395a7` on midnight, **3.57:1**. Every divergence in this program has run the same direction.

---

## Production consumer: a heading that shipped at 1.23:1, and the check that could not have found it
Date: 2026-08-12
Verdict: FAIL (one L2 gap, one L2 tooling gap; both closed)

### Gap #89
- Type: **L2** (library). A shipped accessibility failure on the most prominent element in a live product.
- Symptom, measured on the live site rather than reported: the hero card's heading `"SHIP 001"` rendered `rgb(30,43,59)` (`gray-800`) on `rgb(15,25,42)` (`blue-abyss`) at **1.23:1**. Body text, meta line and chips on the same card were all correct. Only the heading disappeared.
- Root cause: the instrument viewport's dark cascade covered nine text roles, every one of them verified, and `.strand-heading` was not among them. The class kept its light-surface colour and fell through in silence. **Nothing failed; it simply was not asked.**
- **`FeatureSurface` had the identical hole**, found by checking rather than assuming, and the focal card was days from swapping onto it — which would have moved the defect into the single most prominent element in the product rather than fixing it.
- **The first fix did not work, and the check is what said so.** It targeted `.strand-heading`, which reads correctly and matches nothing: the shipped class is `.strand-heading--sm`, written without a base, and no `.strand-heading` rule exists to inherit from. The modifier IS the class. A cascade is only as correct as the selectors consumers actually ship, and reading the fix cannot tell you that — the compositional check re-measured it still at 1.23:1.
- Six roles added across both cascades: heading, title, lead, link--mono, and both semantic values.
- **The semantic values needed a conflict resolved rather than a value chosen.** `.strand-value--positive` carries `!important` deliberately (Gap #44) so the tone beats a host component's own colour. That contract did not anticipate a dark ground, and without a matching marker the light-surface tone survived onto the abyss at 2.7:1 and midnight at 1.7:1. Both rules claim "beat the component"; between them the SURFACE is the one that knows what is legible, so the surface wins. The hue family is preserved and only the rung moves.
- **And the rung on midnight is the TINT, which is the tier logic pointed the other way.** Every member of both families was measured against midnight: `teal-vital` 4.42 and `green-positive` 4.34 are just under, and every `-deep` and `-vivid` is worse because they were derived to sit on a LIGHT ground. The only members clearing 4.5 while still reading as their hue are `teal-tint` (9.76) and `red-tint` (10.05). **On a light ground a hue goes deep to gain contrast; on a dark ground it goes to its tint.** The abyss does not need this because it is dark enough for the mid-tones; midnight is the lighter dark, which is exactly why it is a separate role and not a shade.

### Gap #90
- Type: **L2** (tooling). The check that would have caught #89, and the reason the existing one could not.
- **`pnpm test:contrast` is not pointed at the wrong pairs. It cannot see this class of pair at all.** It audits DECLARATIONS: every rule against the surfaces that rule expects. `.strand-heading--sm { color: gray-800 }` is correct, and correct on every light surface the language sanctions, so a per-declaration audit passes it and is right to. **The failing pair existed in no stylesheet.** It came into being when a consumer put a heading inside a dark card. Contrast is a property of a PAIRING, and a pairing created by COMPOSITION cannot be found by reading declarations.
- `scripts/dark-composition-check.mjs` renders each composable text primitive inside each dark surface in real Chromium and measures the computed colour against the background actually painted behind it, walking up for the first non-transparent ancestor exactly as a reader's eye resolves it. An element painting its own light ground inside a dark card is a light island (9.6) and is judged against that ground, which is why the measurement has to be the painted one.
- **Its scope is declared, and the first version proves why.** Measuring every colour-setting class gave 188 classes, 376 pairings and **232 failures** — almost all compositions nobody would write, a bare `.strand-checkbox__control` floating in a viewport, a breadcrumb separator with no breadcrumb. A guard reporting 232 things reports nothing, and the real finding would have been lost inside it. Narrowed to the primitives whose job is to render text in a context they do not control: 23 classes, 46 pairings, **10 real failures**, all actionable, all now fixed.
- Verified against the defect it was built for: re-feeding the shipped pair returns 1.23:1 CAUGHT, large text uses the 3:1 threshold, a passing pair returns null, and an empty scan is a failure rather than a pass.
- **The bundle gate then caught this fix**, which is the two guards working against each other correctly. The cascade cost InstrumentViewport 0.95 KB and took it from 11.16 to 12.11, over the 12 KB single-component ceiling. Raised to 13 in the same commit with the reason, per the rule — **and the direction is still wrong.** That ceiling was documented as expected to FALL when InstrumentViewport's nine foreign class families are extracted. It has gone up instead, because every accessibility rule the cabinet needs lands on top of nine primitives that are not its own. The number is measuring nine components, not one. Extracting them is no longer a tidy-up item; it is the thing standing between that reading and meaning anything.

---

## Production consumer: the container the whole redesign sits inside
Date: 2026-08-12
Verdict: FAIL (two L2 gaps; both closed)

### Gap #91
- Type: **L2** (library). The design puts the entire application inside a card and the library could not express that container.
- Two measured gaps: the widest content tier is **1024px** against a design frame of **1440**, and there was **no clip utility at all** (`grep` across every synced sheet returned nothing). Everything else composed: `Card` already gives the radius, surface, border and elevation, and `--pad-none` lets a nav sit flush.
- **L2 rather than L3, and the distinction is the one sharpened earlier today.** 1024 is a **reading measure for CONTENT** — text stops being readable past it (10.3). An application **frame** is a different axis that happens also to have a width, bounded by how wide an app should feel. `.strand-nav`, `.strand-tabbar` and `.strand-instrument-viewport` are all application chrome rather than content measures, so a frame joins a set that already exists and the design language has no position to change. Someone already decided and did not publish it.
- **The naming was the whole risk and is handled structurally rather than by convention.** `--strand-frame-max` lives in COMPONENT SIZES beside the nav and tab-bar heights, not among the `--strand-content-*` tiers, so a consumer reaching for a reading measure does not find it and a consumer building a shell does not find 1024. A test asserts the frame carries no container class.
- **`overflow: clip`, not the `hidden` the mockup specifies, and this is the line most likely to be "corrected" later.** Both clip a child to the rounded box. `hidden` also makes the element a scroll container, and a `position: sticky` descendant sticks to its nearest scroll container — measured on `.strand-grid` this morning at -1176 by scroll offset 1200. **An app shell is the outermost container in the product, so `hidden` would have broken every sticky element beneath it at once.** A layout-tier case puts a sticky rail inside the shell and asserts it holds.
- Clipping is verified by measuring the FRAME with an oversized child inside it: a nav overhangs only at the corners, which is invisible to a width assertion on the nav and visible to a reader.

### Gap #92
- Type: **L2** (library). Four screen primitives, from a top-down decomposition of eight rendered screens: `BigMonoTime`, `StatStrip`, `PersonChip`, `ChipSet`. The finding that produced them is that **six primitives generate most of the redesign**, and the defects being patched one at a time were symptoms of their absence.
- Each is general-purpose and knows nothing about events, capacity or RSVPs, which is what makes them library rather than product.
- Decisions worth recording because the obvious implementation is wrong in each: `StatStrip` is a **description list**, since a row of divs gives a screen reader six unrelated strings instead of three pairs; `PersonChip` is **one primitive rather than Avatar + Tag**, because the pill must align the circle's optical centre with the name's baseline and a consumer composing two primitives gets that right only by accident; `ChipSet` uses **aria-pressed for multi and a radiogroup for single**, because "any of these" and "one of these" are different promises; and `BigMonoTime` renders `<time>` only when given a machine-readable value, because a `<time>` without `datetime` asserts an instant that is not there.
- **`test:dark-composition` earned its place on its second day.** The cascades for these primitives were written with them, then lost: the components were parked out of the tree during the publish-integrity diagnosis and restored, but only the untracked component directories came back — the tracked cascade edits did not. The check caught `.strand-big-mono-time` at 1.60:1 on the abyss and **1.00:1 on the feature surface**, where the readout was painting `blue-midnight` on `blue-midnight` and was literally invisible. **A restore that returns most of a change is exactly the failure a compositional check exists for**, and no declaration audit could have seen it: the class is correct on a light surface.
- The bundle ceiling moved 85 → 92 KB for five components, in the same commit with the reason. **The per-component average moved DOWN, 1.18 → 1.16 KB**, which is the reading that distinguishes growth from bloat and is why that number exists.
- Its guard test was re-anchored rather than loosened, and its hardcoded ceiling replaced with one derived from `BUDGET`: a literal goes stale the moment the budget is legitimately raised, and then the test fails for a reason unrelated to the behaviour it checks, which is how a guard gets weakened while appearing maintained.

---

## Production consumer: the top nav of an application shell
Date: 2026-08-13
Verdict: FAIL (five L2 gaps, one L3 gap, one L1 gap; all closed). One further finding was correctly NOT a gap, and saying so is part of the record.

The consumer is a real product bar: one wordmark, four destinations, a 300px search field and an account control, inside a 1440 application frame. Seven findings were prototyped as page-local overrides of design-system classes first, purely so the visual result could be confirmed before propagation, and every override carried the measurement that produced it. That file is the specification these entries are written from, and it is deleted now that they have landed.

**Six of the seven were fixed by REMOVING a rule or by not rendering an element.** That ratio is the useful number in this iteration. The bar did not need new capability; it needed the component to stop asserting things that were not its to assert.

### Gap #93
- Type: **L2** (library). Tree: could a world-class designer build this with the current public API? No, the cap is unconditional and the only exit is overriding a design-system class. Does the fix need `docs/design-language.md` changed? No, the spec already assigns this measure elsewhere. Therefore L2.
- Symptom, measured: the wordmark sat **104px** in from the frame edge at >=1280 viewport and **24px** below it. An inset that is a function of the VIEWPORT rather than of the design is why narrowing the window appeared to "fix" it.
- Root cause: `.strand-nav__inner` carried `max-width: 1280px; margin: 0 auto`. Inside a 1440 frame that is 80px of dead space either side, plus the 24px padding.
- **1280 is a CONTENT measure and 10.2 already assigns it to `.container`.** A bar is not content: it spans its parent and insets by its own padding. A bar that wants a reading measure is a bar placed inside a Container, which is the consumer's composition to make. The component was doing a container's job and leaving the consumer no way to decline it.
- Fix: both declarations deleted; padding raised 24 to 32 because the bar now spans the frame and its own padding is the only thing setting the brand's inset. Breaking for any consumer relying on the implicit measure, so it is called out in the Bootstrap migration guide, where `navbar` maps to `strand-nav` and Bootstrap navbars conventionally wrap their contents in `.container`.

### Gap #94
- Type: **L2** (library). Tree: no primitive expresses "fit or hand over", and no spec change is needed to add it.
- Symptom, measured: between roughly 770 and 850 the labels shrank rather than the row giving up. "My groups" went **68px, then 58, then 45**, and then broke onto two lines mid-label.
- Root cause: `.strand-nav__items` was an ordinary flex item at `0 1 auto` and shrank; the links had no `white-space` rule to stop the reflow that followed.
- **A destination's label is a name, and half a name is not a shorter name.** A bar either fits its destinations or hands them to the mobile menu. There is no correct intermediate state, so the component should not have one. `flex: none` plus `white-space: nowrap`.
- The failure mode is the reason this was worth a gap rather than a patch: crunched labels read as a RENDERING fault, so nobody reports it as a layout problem and it survives review.

### Gap #95
- Type: **L2** (library). Tree: 10.4 Boundary Integrity already says a child may not breach its parent and that this is "enforced at the component level, not by the consumer", so the spec demands the behaviour and the component failed to deliver it. No spec change; L2.
- Symptom, measured: `.strand-nav__actions` resolved to **299px while holding 384px of children**, so the account control hung **85px outside its own parent**, ending at 1503 inside a 1438 box. The application shell clips, so the Sign in button was cut off. It presented as "the button disappears when I open DevTools", because the overhang varied with viewport.
- Two independent causes, and the second is the one worth carrying forward:
  1. `margin-left: auto` takes the free space and the box then shrink-to-fits. As an ordinary flex item it could also shrink below its contents. `flex: none` makes it size to what it holds, which is what a right-anchored action group is for.
  2. **A PERCENTAGE contributes nothing to a parent's intrinsic size.** `SearchField` is `inline-size: min(300px, 100%)`, which is correct and deliberate (10.4: a fixed width is a promise about the field, not about every container it is put in). But it offered the shrink-to-fit calculation nothing, so the parent measured itself from the remaining children alone. `min-inline-size: max-content` restores the floor the percentage removed.
- **Every child was individually correct and the parent still measured short.** No per-component review finds this, because there is no component to look at: the defect exists only in the composition.

### Gap #96
- Type: **L2** (library). Tree: the hamburger was unconditional, so the only compliant route was a consumer override of `.strand-nav__hamburger`, which the strand-first gate forbids. **19.1.1 already specifies the answer**, so no spec change; L2.
- Symptom: on a phone the bar showed a hamburger AND the account control, and the hamburger opened a menu duplicating the bottom tab bar the product already ships. Two navigation affordances in the corner where one belongs, and the menu was a second door to the same room.
- **The spec already ruled this out and the library could not express it.** 19.1.1: "A surface has ONE primary navigation, and a bottom bar coexisting with a hamburger is two answers to one question, leaving the reader to learn which holds what." The consumer qualifies as an application shell on the mechanical test (four destinations, inside the three-to-five band, moved between repeatedly in one session).
- Fix: a `mobileMenu` prop, defaulting to **true** so no existing consumer changes behaviour. False omits the hamburger and its panel.
- **Not rendered rather than hidden.** A `display: none` control is out of the accessibility tree but still in the DOM and still a thing to reason about; a surface that has declared it has no mobile menu should not ship the button that opens one. For the CSS-only consumer type the markup IS the API, so the equivalent is omitting the two elements, and `attachNav` already returns early when either is absent, which makes omission supported rather than merely tolerated.

### Gap #97
- Type: **L2** (library). Tree: no primitive, no spec change.
- Symptom, measured: **32px of clearance down to 320, then 15px at 300, then -5px at 280**, the account control pushing through the gutter and out of the bar.
- Arithmetic rather than mystery: a 136px wordmark and an 85px control need 285px of row when each side spends 32, so below that the gutter is the only thing left to give and it gave.
- **A 32px gutter is a desktop measure.** Phones conventionally use 16, and at 16 the same row needs 253, comfortable at 280. Nothing truncates and nothing is hidden; the bar stops spending desktop padding on a phone.

### Gap #98
- Type: **L3** (design language). Tree: no primitive exists, AND the primitive cannot be added without changing `docs/design-language.md`, because 14.7 said "minimum 44x44px on all interactive elements" with no modality qualification. Shipping a 34px control would have made the library contradict its own spec. Therefore L3, and the spec moved first.
- Symptom, measured: signed-out **85x44**, signed-in **34x34**. Two consequences, one visual and one structural. Visually 44px reads heavy in a 64px bar, especially on a phone where it is the only thing beside the wordmark. Structurally **the two states are the SAME SLOT**, so a 10px height difference is a layout shift the moment auth resolves, on every page load, for every member.
- **The spec was not merely incomplete, it was wrong on a citation.** 14.7 attributed 44px to WCAG 2.2 SC 2.5.8. 2.5.8 is the AA criterion and its threshold is **24x24 CSS px**; 44px belongs to SC 2.5.5 Target Size (Enhanced), which is AAA. The error was not academic: it made every compact desktop control a spec violation, so the only way to build a bar at the density this language calls for was to contradict the language.
- Fix, in order: 14.7 rewritten to state that the floor is a property of the INPUT MODALITY (44 under `coarse`, 24 under `fine`), with the mis-citation corrected in place so it cannot be reintroduced by someone reading the old sentence. Then one nav-scoped rule inside `@media (pointer: fine)`.
- **`--strand-touch-target` was deliberately NOT touched and stays 44px.** It feeds Button, Radio, Checkbox, Switch, Slider, Link, StarRating and CodeBlock, so a modality branch on the token would have resized every control in every consumer to fix a nav bar. The spec now permits a lower fine-pointer floor; nothing except the nav takes it.
- The guarantee this clause is most likely to be misread into breaking is the coarse one, so it is protected by construction rather than by care: the rule lives inside a fine-pointer query, and a test asserts both that no `pointer: coarse` branch exists and that 34px never appears outside the fine-pointer block.

### Gap #99
- Type: **L1** (usage). Tree: could a world-class designer build this correctly with the current API? Yes, by adding a size modifier. So the fix is documentation, not library code.
- Symptom: the consumer's avatar control shipped `class="strand-btn strand-btn--ghost strand-btn--icon-only"` with **no size modifier**. `.strand-btn` carries no padding and no min-height on its own, and `.strand-btn--icon-only` sets nothing by itself: every dimension comes from `--sm` / `--md` / `--lg`, and the icon-only padding rules are compound selectors requiring both classes. The control therefore had no touch-target floor at all.
- **This silently defeated Gap #98's stated intent.** #98 exists so the two auth states match and the slot does not shift, and its rule was written expecting "the avatar gets the same treatment from the same rule". The avatar could not get that treatment on the coarse side, because it had no 44px floor to be held to in the first place. A fix and the defect it was meant to close were shipped in the same bar.
- Fix at the L1 layer: the composition trap is now stated where a consumer meets it (`icon-only` is a shape modifier, not a size, and carries no dimensions without a size modifier beside it).
- **Recorded because the tooling that should have caught it could not see the file.** The consumer's audit globbed `**/*.js` while the surface is authored in `.jsx`, so 57 of its 90 files were unaudited. That is the consumer's gap to close and it has closed it, but it belongs in this log too: an L1 gap is only cheap when something finds it, and here nothing did.

### Not a gap: the search field's 950px threshold
- The seventh finding was where the search field stops being shown. It was hidden below `lg` (1024), which is a viewport breakpoint rather than an answer about this bar, and about 75px too early. Lowering it to where the row merely stops OVERFLOWING was too late in the other direction: the field slid left until it sat flush against the last destination.
- **Fitting is not the test.** The bar has one spacing rhythm and the field has to keep it. Measured with the field forced visible, brand to destinations held 32 at every width while destinations to field went 116 at 1024, 67 at 975, 42 at 950, 17 at 925 and 0 at 900. So 32 is the bar's spacing, and the field survives exactly while it can hold it.
- **This stayed in the consumer, and that is the correct layer rather than a deferral.** 950 is a property of THIS bar's contents: one wordmark, four destinations, a 300px field and an account control. Strand cannot know how many destinations a product has, and a design system shipping 950px here would be encoding someone else's nav. The general capability the consumer needed already exists; only the number is local.

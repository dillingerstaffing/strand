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

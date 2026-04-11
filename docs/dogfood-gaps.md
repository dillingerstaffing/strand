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

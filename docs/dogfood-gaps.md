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

# Showcase: Agent Dashboard

## Iteration 3

Fixes from iteration 2 review (4 gaps: 1x L2, 3x L1):

1. L2 — `strand-nav-offset` class added to library for glass nav content offset
2. L1 — Cards redesigned: removed avatars, sm padding, glass-surface, KV-driven metrics, diagnostic error detail
3. L1 — CSS loading switched from CDN to JS imports (standard Vite pattern)
4. L1 — Product redesign: InstrumentViewport for KPI strip, glass-surface agent cards, warm-shadow diagnostics, realistic fleet telemetry data

## What was built

Agent fleet operations dashboard. Two-environment composition per the design language: dark InstrumentViewport with grid overlay for the KPI readout strip (synthetic instrument surface), frosted glass agent panels in the light facility section.

Operators see: fleet status, throughput, P95 latency, cost. Error agents show schema-level diagnostics with timestamps, context, failure counts, and recovery actions.

## Strand primitives used

**Surfaces:** InstrumentViewport (grid), strand-glass-surface, strand-card--warm
**Layout:** Section (compact, standard), Container (full), Grid (2/3-col), Stack, Divider
**Display:** Card (elevated, outlined), DataReadout (sm, lg), Table, Badge (dot), Tag, Progress (bar)
**Input:** Button (secondary, ghost), Switch
**Feedback:** Alert (warning, error), Tooltip
**Navigation:** Nav (glass), Tabs
**Typography:** strand-overline (accent, pulse), strand-heading--sm, strand-text-secondary, strand-text-secondary--xs
**Molecules:** strand-status-chip, strand-log, strand-kv, strand-bar-chart (md), strand-footer
**Utilities:** strand-nav-offset, strand-block

## Gaps found

No new gaps in iteration 3. All gaps from iterations 1-2 resolved. See `docs/dogfood-gaps.md`.

## Publish dependency

The L2 fixes (strand-bar-chart--sm/md/lg, strand-nav-offset) require 0.15.1 to be published to npm. The showcase depends on 0.15.1.

# Showcase: Agent Dashboard

## Iteration 5

All gaps from iterations 1-4 resolved. Comprehensive redesign based on:
- Deep CSS audit of bar chart pixel budget, viewport padding, molecule padding
- Value stream analysis synthesized from leading agent observability platforms
- Two-environment composition per design language Part I
- Single-section layout eliminating all dead space

## Value stream

Five operator decisions drive every visible element:

1. **Is the fleet healthy?** → KPI strip in InstrumentViewport (fleet count, error rate, throughput, cost)
2. **What broke and why?** → Error panel with schema-level diagnostic, trace context, consecutive failures, last success time, recovery actions
3. **Is this worth the money?** → Per-agent cost, total cost in KPI strip
4. **Is quality holding?** → Success rates, throughput per agent
5. **What happened recently?** → Activity log with status-coded entries

## Composition

**Single Section layout** — all content in one `Section variant="compact"` with `strand-nav-offset`. Zero dead space between elements. Stack gap={4} controls all vertical rhythm.

**Two environments:**
- Dark synthetic: `InstrumentViewport grid` for KPI readouts (the instrument panel)
- Light facility: Glass-surface agent cards, warm-shadow system diagnostics, glass-surface activity log

**Density:** Agent cards use `padding="sm"`, `gap={2}`, KV rows for all metrics. Error panel uses `padding="sm"`, `gap={2}`, includes actual error message + diagnostic context + recovery actions.

## Strand primitives used

InstrumentViewport (grid), strand-glass-surface, strand-card--warm, Nav (glass), Section (compact), Container (full), Grid, Stack, Card, DataReadout, Table, Badge, Tag, Progress, Divider, Alert, Tabs, Switch, Tooltip, Button, Avatar, strand-overline (accent, pulse), strand-heading--sm, strand-text-secondary--xs, strand-status-chip, strand-log, strand-kv, strand-bar-chart, strand-footer, strand-nav-offset

## Gaps found

No new gaps. All 17 gaps from iterations 1-4 resolved. See `docs/dogfood-gaps.md`.

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

No iterations have been run yet. The dogfood chamber infrastructure was built in version 0.14.0. The first showcase iteration will appear here once it runs.

/*! Strand | MIT License | dillingerstaffing.com */

// The spacing ladder, mirrored from strand-ui/src/spacing.ts.
//
// A copy rather than an import because these packages publish independently
// and neither depends on the other; the parity test is what keeps the three in
// step. See gap #122 for why this exists at all: `gap={7}` is not on the
// ladder, and an off-ladder value rendered NO gap rather than a smaller one,
// because an undefined custom property invalidates the whole declaration.

/** DL Part V 5.1, in order. `0` is included: no gap is a real request. */
export const SPACING_STEPS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48] as const

export type SpacingStep = (typeof SPACING_STEPS)[number]

export const DEFAULT_GAP: SpacingStep = 4

/** The rung closest to a value. TIES GO DOWN: a smaller gap cannot overflow. */
export function nearestStep(value: number): SpacingStep {
  let best: SpacingStep = SPACING_STEPS[0]
  let bestDistance = Number.POSITIVE_INFINITY
  for (const step of SPACING_STEPS) {
    const distance = Math.abs(step - value)
    if (distance < bestDistance) {
      bestDistance = distance
      best = step
    }
  }
  return best
}

/** Resolve a caller gap to a rung on the ladder. Never returns an off-ladder value. */
export function resolveGapStep(value: number | undefined): SpacingStep {
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_GAP
  return nearestStep(value)
}

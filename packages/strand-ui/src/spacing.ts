/*! Strand UI | MIT License | dillingerstaffing.com */

/**
 * The spacing ladder, and the single owner of what a `gap` prop may be.
 *
 * WHY THIS EXISTS. `Stack` and `Grid` both take `gap: number` and both
 * rendered NO GAP for a value the ladder does not have, by two different
 * routes: Stack emits `strand-stack--gap-{n}`, which for an off-ladder n is a
 * class with no rule, so `row-gap` computes to `normal`; Grid writes
 * `gap: var(--strand-space-{n})` inline, and an undefined custom property
 * makes the whole declaration invalid.
 *
 * Neither degrades to a smaller value. Both degrade to nothing. That is the
 * property that made it dangerous: the page renders, the HTML exists, every
 * gate stays green, and the defect is visible only to a human looking at the
 * screen. Measured on a consumer with five `gap={7}` call sites, two of which
 * had already been worked around in page-local stylesheets by earlier
 * sessions who hit it and fixed only their own screen.
 *
 * THE FIX IS TO HONOUR THE SCALE, NOT TO EXTEND IT. DL Part V 5.1 enumerates
 * the ladder and it is sparse on purpose: 7, 9, 11 and so on are absent
 * because it is a curated set, not every multiple of 4. Adding a rung would be
 * a design-language change; making the components respect the rungs that exist
 * is a library one.
 */

/** DL Part V 5.1, in order. `0` is included: no gap is a real request. */
export const SPACING_STEPS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48] as const;

/** The rungs, as a type, so a TypeScript consumer cannot write `gap={7}`. */
export type SpacingStep = (typeof SPACING_STEPS)[number];

/** What a layout primitive uses when the caller says nothing. */
export const DEFAULT_GAP: SpacingStep = 4;

/**
 * The rung closest to a value.
 *
 * TIES GO DOWN. 7 sits exactly between 6 and 8, and 7 is the value consumers
 * actually wrote. A smaller gap can never cause an overflow; a larger one can,
 * so the conservative side is the one where the clamp itself cannot break a
 * layout that was fitting.
 */
export function nearestStep(value: number): SpacingStep {
  let best: SpacingStep = SPACING_STEPS[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const step of SPACING_STEPS) {
    const distance = Math.abs(step - value);
    // Strictly less than, so an equal distance keeps the EARLIER (smaller)
    // rung. That is the downward tie, expressed by the comparison rather than
    // by a special case.
    if (distance < bestDistance) {
      bestDistance = distance;
      best = step;
    }
  }
  return best;
}

/**
 * Resolve a caller's `gap` to a rung, and say whether it had to move.
 *
 * Returns the flag rather than clamping silently: trading an invisible zero
 * for an invisible clamp would fix the rendering and keep the lesson hidden.
 * The components use it to warn in development.
 */
export function resolveGap(value: number | undefined): { step: SpacingStep; exact: boolean } {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return { step: DEFAULT_GAP, exact: true };
  }
  const step = nearestStep(value);
  return { step, exact: step === value };
}

/**
 * Say it once, in development only.
 *
 * Deduped per value, because a list of forty rows would otherwise print forty
 * identical lines and bury it.
 */
const warned = new Set<string>();

export function warnOffLadderGap(component: string, requested: number, step: SpacingStep): void {
  if (typeof process !== "undefined" && process.env?.NODE_ENV === "production") return;
  const key = `${component}:${requested}`;
  if (warned.has(key)) return;
  warned.add(key);
  // eslint-disable-next-line no-console
  console.warn(
    `[strand] ${component} gap={${requested}} is not on the spacing ladder ` +
      `(${SPACING_STEPS.join(", ")}), so it rendered as gap={${step}}. ` +
      "The ladder is DL Part V 5.1 and is sparse on purpose. Before this clamp " +
      "existed an off-ladder gap rendered as NO gap at all.",
  );
}

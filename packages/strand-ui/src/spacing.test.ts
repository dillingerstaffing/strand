/*! Strand UI | MIT License | dillingerstaffing.com */

// The spacing ladder is ENUMERATED and deliberately sparse, and until now the
// layout primitives accepted values that are not on it and rendered NO GAP.
//
// Measured on a consumer, five call sites deep: `Stack gap={7}` emits
// `strand-stack--gap-7`, no such rule exists, `row-gap` computes to `normal`,
// and two sections sat flush against each other. `Grid gap={7}` fails the same
// way by a different route: it writes `gap: var(--strand-space-7)` inline, the
// token is undefined, and the whole declaration is invalid.
//
// Neither degrades to a smaller value. Both degrade to nothing, which is the
// property that makes this dangerous: the page still renders, every check that
// asks whether the HTML exists still passes, and the defect is visible only to
// someone looking at the screen.
//
// Written before the module, per the rule that classification code is not
// exempt from TDD.

import { describe, expect, it } from "vitest";
import { SPACING_STEPS, nearestStep, resolveGap } from "./spacing.js";

describe("SPACING_STEPS", () => {
  it("is the design language's own ladder, in order", () => {
    // DL Part V 5.1. Sparse ON PURPOSE: it is a curated ladder, not every
    // multiple of 4. Adding a rung here is a DESIGN LANGUAGE change (L3), not
    // a library one, which is exactly why the fix is to honour this list
    // rather than to extend it.
    expect(SPACING_STEPS).toEqual([0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48]);
  });
});

describe("nearestStep", () => {
  it("leaves a value that is already on the ladder alone", () => {
    for (const step of SPACING_STEPS) expect(nearestStep(step)).toBe(step);
  });

  it("pulls an off-ladder value to the nearest rung", () => {
    // Genuine nearest cases, not ties: 13 is 1 from 12 and 3 from 16; 30 is 2
    // from 32 and 6 from 24. (11 is NOT one of these: it sits exactly between
    // 10 and 12, so the tie rule below owns it.)
    expect(nearestStep(13)).toBe(12);
    expect(nearestStep(30)).toBe(32);
    expect(nearestStep(2.4)).toBe(2);
  });

  it("breaks a tie DOWNWARD, which is the conservative direction", () => {
    // 7 sits exactly between 6 and 8, and it is the value five consumers
    // actually wrote. A smaller gap can never cause overflow; a larger one
    // can. Choosing the smaller side means the clamp cannot itself break a
    // layout that was fitting.
    expect(nearestStep(7)).toBe(6);
    expect(nearestStep(9)).toBe(8);
    expect(nearestStep(11)).toBe(10);
  });

  it("clamps beyond either end rather than inventing a rung", () => {
    expect(nearestStep(-4)).toBe(0);
    expect(nearestStep(9999)).toBe(48);
  });
});

describe("resolveGap", () => {
  it("reports an on-ladder value as exact", () => {
    expect(resolveGap(4)).toEqual({ step: 4, exact: true });
    expect(resolveGap(0)).toEqual({ step: 0, exact: true });
  });

  it("reports an off-ladder value as clamped, so a caller can warn", () => {
    // The `exact` flag is the whole reason this returns an object. Silently
    // clamping would trade one invisible failure for another; the component
    // uses this to say so in development.
    expect(resolveGap(7)).toEqual({ step: 6, exact: false });
  });

  it("a gap that is not a number falls back to the default rather than to zero", () => {
    // `undefined` reaches here whenever a caller omits the prop, and zero is a
    // legitimate rung, so falling back to it would make "I said nothing" and
    // "I said none" indistinguishable.
    expect(resolveGap(undefined).step).toBe(4);
    expect(resolveGap(Number.NaN).step).toBe(4);
    expect(resolveGap("6" as unknown as number).step).toBe(4);
  });

  it("an explicit zero is honoured, because no gap is a real request", () => {
    expect(resolveGap(0)).toEqual({ step: 0, exact: true });
  });

  it("never returns a step that is off the ladder, whatever it is given", () => {
    // The property that matters: whatever a consumer passes, what comes out
    // has a token and a class behind it. That is what makes a dead class
    // impossible rather than unlikely.
    for (const input of [-1, 0, 7, 9, 13, 999, 4.5, Number.POSITIVE_INFINITY]) {
      expect(SPACING_STEPS).toContain(resolveGap(input).step);
    }
  });
});

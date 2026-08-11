# Testing tiers

Strand has four verification tiers. Each one can answer a different class of
question, and each one is blind to the classes the others own. This document
states those boundaries, because the cost of not stating them is already on the
record: a fully published primitive shipped with a collapse bug that no test in
this repository was capable of detecting, and the library learned about it from
a consumer.

The rule this document exists to enforce: **know which tier owns your claim
before you write the assertion.** An assertion placed in a tier that cannot
evaluate it does not fail. It passes, and reports that the thing works.

---

## The tiers

| Tier | Runner | Subject | Answers | Cost |
|---|---|---|---|---|
| Static CSS | `pnpm test:contrast`, `test:parity`, `purity-scan` | The built stylesheet, as text | Does the CSS declare the right things? | ~1s |
| Unit (jsdom) | `pnpm test` | Components and their DOM output | Does the right markup come out? | seconds |
| Layout (browser) | `pnpm test:layout` | The class layer, rendered and measured | Does the rendered box have the right geometry? | ~2s |
| Consumer | downstream, e.g. `make measure-cls` | A real page in production | Did it hold up in the real composition? | minutes |

`pnpm test:all` runs the first three. The fourth is not ours and never will be,
which is the point of the third existing.

---

## What jsdom cannot do, measured

The unit tier is jsdom, and jsdom does not lay out. This is not a limitation to
work around, it is a category boundary. Measured directly against the `Reserve`
primitive, comparing the correct 0.33.0 stylesheet with the 0.32.0 stylesheet
that carried the collapse bug:

| Probe | Result |
|---|---|
| `offsetHeight` of a region with a declared 42px floor | `0` |
| `getBoundingClientRect().height` of the same region | `0` |
| `offsetHeight` of an element with a literal `min-block-size: 42px` | `0` |
| Computed `min-block-size` where the value is `var(--strand-reserve-h, auto)` | the literal string `"var(--strand-reserve-h, auto)"` |
| `window.matchMedia` | not a function |
| Correct empty state vs broken empty state, by height | `0` and `0`, indistinguishable |

Four independent blindnesses, and they compound:

1. **No layout.** Every box measures zero, so no assertion about size, position,
   or overlap can be written at all.
2. **No `var()` resolution.** Computed style returns the unresolved literal, so
   even the declared value cannot be read back when it is expressed as a token.
   `Reserve`'s entire reserved-height contract is expressed in `var()`.
3. **No media queries.** `matchMedia` is absent and `innerWidth` is a fixed
   1024 that reflects nothing. Any per-breakpoint contract is unassertable.
4. **Cascade for literal properties does work.** Computed `display` did come
   back as `none` against the correct sheet and `block` against the broken one.

Point 4 is the trap. A proxy assertion on computed `display` was technically
available and would have caught this specific bug. It is still the wrong test,
because it asserts the mechanism rather than the outcome. A mechanism assertion
locks the implementation and goes green for the wrong reason the moment the
implementation legitimately changes. The claim worth making is "the region has
no height", not "the placeholder is display none".

---

## The layout tier

### Subject: the class layer, not the components

The layout tier renders raw markup against the built stylesheet
(`packages/strand-ui/dist/css/strand-ui.css`), not Preact components.

This is deliberate and it is what makes the tier affordable. Strand has eight
consumer types. The class layer is the real primitive and every framework
wrapper is documented as a thin wrapper over exactly those classes, a claim
`pnpm test:parity` already enforces independently. So a geometry assertion
against the classes holds for all eight consumers at once. Testing the Preact
component instead would buy one consumer's coverage for the same browser boot,
and would test Preact rather than Strand.

### It asserts outcomes, not screenshots

This tier is not visual regression. There are no baseline images, no pixel
diffs, and no approval step. Those carry a maintenance cost that gets paid on
every intentional change, and their failures do not say what broke.

Every case here states a numeric contract in the assertion itself and fails
with the measured number beside the expected one. A failure reads as
"empty state: expected block-size 0, measured 42" and names the primitive.
That is a sentence a maintainer can act on without opening a browser.

### Never skips silently

If Chromium is not installed the run exits non-zero with the install command.
It does not skip, and it does not pass.

This is not defensiveness, it is the lesson already written into `ci.yml`: the
migration staleness check rotted to sixteen failures because nothing ran it,
and "a check that nothing runs is not a check". A layout tier that quietly
no-ops when the browser is missing is worse than not having one, because the
green tick then actively asserts that geometry was verified.

### Cost, and staying fast enough to actually run

One browser launch, one page, reused across every case. Cases are grouped by
viewport so the page is resized once per width rather than once per case.

The tier is wired into `pnpm test:all` (so CI enforces it) and deliberately
NOT into `pnpm test` (so the inner development loop stays jsdom-fast). A
contributor iterating on a component runs `pnpm test` in under a second, as
before. The layout tier runs at the same moment the parity and contrast checks
already run.

Scope control is what keeps it there: a primitive earns a layout case only when
it makes a geometric promise. Most do not. `Badge` has padding; that is not a
promise, it is a value, and the static tier already reads it. `Reserve` promises
that a swap cannot move the page, which is a claim about rendered geometry and
belongs here.

### When to add a case

Add one when the primitive's reason for existing is a statement about space:

- it reserves, collapses, or holds a box against changing content
- it constrains a dimension so something else cannot move
- its contract differs per breakpoint
- a consumer has worked around its geometry in page code

That last trigger is the important one. A consumer patching geometry from page
JavaScript is the signature of a primitive whose spatial contract is wrong, and
it is exactly how gap #63 was found. When that happens the fix belongs in the
library, and a layout case belongs here so it cannot regress.

---

## Where this sits in the gap hierarchy

It does not. `docs/dogfood-protocol.md` classifies gaps as L1 (docs), L2
(library) or L3 (design language), and all three describe gaps in the product.
This is a gap in the repository's ability to detect gaps in the product, which
is a different axis. Recorded as gap #64 with that noted, so a future session
does not force-fit it to a layer and then argue about which one.

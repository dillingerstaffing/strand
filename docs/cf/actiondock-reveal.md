# The dock shows only while the control it stands in for is not entirely reachable

`observeOffScreen` treats the watched control as present only while it is ENTIRELY inside the viewport trimmed by the dock's own height (thresholds `[0, 1]`, deciding on `intersectionRatio < 1`, not `isIntersecting`). At threshold 0 a single visible pixel counted as on screen, and a control scrolled half off the top left 22px of a 44px target with no dock to fall back on. The dock's height is state fed by a ResizeObserver, because reading it once at observer setup reads an empty dock and leaves the margin short. A missing target means no dock: showing because the control could not be found is a second live control with nothing to reconcile against.

Where: `packages/strand-ui/src/components/ActionDock/ActionDock.tsx`

# The grabber captures the pointer, and a cancelled pointer never dismisses

Dismissing a sheet means dragging DOWN and away from a 28px strip, so without `setPointerCapture` the move events stop arriving almost at once and the sheet springs back as if the gesture were abandoned. `Sheet` captures the pointer on down and releases it on up. A `pointercancel` (the OS taking the pointer for a call or a system gesture) is an abandoned gesture, not a completed one, so it resets the drag and never closes. The decision itself is `dragOutcome`, a pure function, because jsdom implements no `PointerEvent` and a gesture wired straight into handlers is untestable there.

Where: `packages/strand-ui/src/components/Sheet/Sheet.tsx`

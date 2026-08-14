/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { Dialog } from "../Dialog/index.js";

export interface SheetProps
  extends Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    // Same omissions Dialog carries, and for the same reason: the rest of
    // these props are spread straight onto Dialog, and JSX.HTMLAttributes
    // types `title` as Signalish<string> where DialogProps narrows it to a
    // plain string, which makes the spread unassignable at
    // `tsc --emitDeclarationOnly` after vite has already emitted the CSS.
    "open" | "title"
  > {
  /** Whether the sheet is open */
  open: boolean;
  /** Called when the sheet should close */
  onClose: () => void;
  /** Accessible name. A sheet has no visible heading, so this is the only one. */
  label: string;
  /**
   * The committing control, pinned in a foot that never scrolls away.
   *
   * NAME THE OUTCOME, not the mechanism: "Show 6 events", not "Apply". The
   * whole reason a sheet is partial height is that the reader can see the
   * result change behind it, and a button that says "Apply" throws that away
   * by refusing to state what it will do.
   */
  action?: ComponentChildren;
  /** Optional head content, above the body and outside its scroll. */
  head?: ComponentChildren;
  /**
   * Whether the sheet can be dragged away.
   *
   * `false` removes the grabber rather than leaving one that does nothing.
   * An affordance that promises a gesture it does not have is worse than no
   * affordance at all.
   */
  draggable?: boolean;
  /** The sheet's scrolling content */
  children?: ComponentChildren;
}

/** Past this fraction of the sheet's OWN height, a drag closes it. */
export const DISMISS_FRACTION = 0.28;

/**
 * The drag's whole decision, as a pure function.
 *
 * SEPARATED FROM THE DOM DELIBERATELY. jsdom implements no `PointerEvent` at
 * all: `fireEvent.pointerDown(el, { clientY: 100 })` delivers a plain Event
 * whose `clientY` is null and whose target has no `setPointerCapture`. So a
 * gesture wired straight into handlers is not merely awkward to test in the
 * cheap tier, it is UNTESTABLE there, and the version that looked tested was
 * asserting that nothing happened. The plumbing stays thin, this holds every
 * rule, and the real gesture is proven in a browser by the consumer's e2e.
 *
 * @param startY where the press began
 * @param endY where the pointer was released
 * @param height the sheet's own height, so the same gesture means the same
 *   thing on a short phone and a tall one
 */
export function dragOutcome(
  startY: number | null,
  endY: number,
  height: number,
  fraction: number = DISMISS_FRACTION,
): { travelled: number; dismiss: boolean } {
  // A non-finite coordinate is NOT a drag of zero. Treating it as one is how
  // a gesture silently dies in an environment that reports no coordinates,
  // and it is why this returns early rather than arithmetic on null.
  if (!Number.isFinite(startY) || !Number.isFinite(endY)) {
    return { travelled: 0, dismiss: false };
  }
  // Downward only. An upward drag on a bottom sheet is a request for more
  // sheet, and this one is already at its height, so it is clamped rather
  // than allowed to lift the panel off the edge it is anchored to.
  const travelled = Math.max(0, endY - (startY as number));
  const usable = Number.isFinite(height) && height > 0 ? height : 1;
  return { travelled, dismiss: travelled > usable * fraction };
}

/**
 * Bottom-anchored modal: the pattern DL 11.6 names and 14.8 requires.
 *
 * Composes Dialog, so focus trapping, focus restoration, scroll lock, Escape
 * and the scrollbar-gutter compensation are inherited rather than
 * reimplemented. What this adds is the anatomy the pattern owns: a head that
 * does not scroll, a body that does, a foot holding the committing control in
 * the thumb's reach, and a grabber that both states and implements
 * drag-to-dismiss.
 *
 * WHY THE DRAG LIVES HERE AND NOT IN THE CONSUMER. The gesture has one
 * non-obvious requirement and every hand-rolled version gets it wrong the same
 * way: dismissing means dragging DOWN and away from a 28px strip, so without
 * `setPointerCapture` the moves stop arriving almost immediately and the sheet
 * springs back as though the gesture had been abandoned. Shipping the grabber
 * without the gesture guarantees the next consumer reproduces that bug.
 *
 * @example
 * ```tsx
 * import { Sheet, Button } from '@dillingerstaffing/strand-ui';
 *
 * <Sheet
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   label="Filters"
 *   action={<Button variant="primary" onClick={() => setOpen(false)}>Show 6 events</Button>}
 * >
 *   <FilterControls />
 * </Sheet>
 * ```
 */
export const Sheet = forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      open,
      onClose,
      label,
      action,
      head,
      draggable = true,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const [drag, setDrag] = useState(0);
    const startY = useRef<number | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Reopening must not resume a half-finished drag from last time.
    useEffect(() => {
      if (open) setDrag(0);
    }, [open]);

    const onPointerDown = useCallback((e: PointerEvent) => {
      // A press with no usable coordinate starts no drag. Storing a null here
      // would make every later handler's "has a drag begun" check answer yes
      // to a gesture that can never be measured.
      if (!Number.isFinite(e.clientY)) return;
      startY.current = e.clientY;
      const target = e.currentTarget as HTMLElement | null;
      // CAPTURE, or the drag stops tracking the moment the pointer leaves the
      // grabber, which is immediately: dismissing means dragging the sheet
      // DOWN and away from a 28px strip. Measured on a consumer before this
      // existed: a 400px drag delivered a handful of moves and then nothing,
      // and the sheet sprang back as though the gesture were abandoned.
      target?.setPointerCapture?.(e.pointerId);
    }, []);

    const onPointerMove = useCallback((e: PointerEvent) => {
      if (startY.current === null) return;
      setDrag(dragOutcome(startY.current, e.clientY, 1).travelled);
    }, []);

    const onPointerUp = useCallback(
      (e: PointerEvent) => {
        if (startY.current === null) return;
        const target = e.currentTarget as HTMLElement | null;
        target?.releasePointerCapture?.(e.pointerId);
        const height = panelRef.current?.getBoundingClientRect().height || 1;
        const { dismiss } = dragOutcome(startY.current, e.clientY, height);
        startY.current = null;
        setDrag(0);
        if (dismiss) onClose();
      },
      [onClose],
    );

    // A cancelled pointer is an ABANDONED gesture, not a completed one. Routing
    // it through onPointerUp would let the OS taking the pointer away (a call
    // arriving, a system gesture) dismiss the sheet on the reader's behalf.
    const onPointerCancel = useCallback(() => {
      startY.current = null;
      setDrag(0);
    }, []);

    return (
      <Dialog
        open={open}
        onClose={onClose}
        align="end"
        padding="none"
        dismissible={false}
        aria-label={label}
        className={className}
        ref={ref}
        {...rest}
      >
        <div
          ref={panelRef}
          className="strand-sheet__panel"
          // Transform only, so a drag composites on the GPU and never reflows
          // the content behind the sheet.
          style={drag ? `transform: translateY(${drag}px)` : undefined}
        >
          {draggable && (
            <div
              className="strand-sheet__grab"
              data-testid="sheet-grab"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
            >
              <span className="strand-sheet__grabber" aria-hidden="true" />
            </div>
          )}

          {head && (
            <div className="strand-sheet__head" data-testid="sheet-head">
              {head}
            </div>
          )}

          <div className="strand-sheet__body">{children}</div>

          {action && (
            <div className="strand-sheet__foot" data-testid="sheet-foot">
              {action}
            </div>
          )}
        </div>
      </Dialog>
    );
  },
);

Sheet.displayName = "Sheet";

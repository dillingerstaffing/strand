/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useRef, useState } from "preact/hooks";
import { Dialog } from "../Dialog/index.js";

export interface SheetProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "open" | "title"> {
  open: boolean;
  onClose: () => void;
  /** Accessible name; a sheet has no visible heading. */
  label: string;
  /** The committing control, pinned in a foot that never scrolls; name the outcome ("Show 6 events"), not the mechanism. */
  action?: ComponentChildren;
  /** Content above the body, outside its scroll. */
  head?: ComponentChildren;
  /** Drag to dismiss; `false` removes the grabber too. */
  draggable?: boolean;
  children?: ComponentChildren;
}

/** Past this fraction of the sheet's own height, a drag closes it. */
export const DISMISS_FRACTION = 0.28;

/** The drag's decision, pure so it is testable where PointerEvent is not (cf: sheet-pointer-capture). */
export function dragOutcome(startY: number | null, endY: number, height: number, fraction: number = DISMISS_FRACTION): { travelled: number; dismiss: boolean } {
  if (!Number.isFinite(startY) || !Number.isFinite(endY)) return { travelled: 0, dismiss: false };
  const travelled = Math.max(0, endY - (startY as number));
  const usable = Number.isFinite(height) && height > 0 ? height : 1;
  return { travelled, dismiss: travelled > usable * fraction };
}

/**
 * Bottom-anchored modal (DL 11.6, 14.8): a head that stays, a body that scrolls, a foot in the thumb's reach, and a grabber that drags to dismiss. Composes `Dialog`.
 *
 * @example
 * <Sheet open={open} onClose={close} label="Filters" action={<Button variant="primary" onClick={close}>Show 6 events</Button>}><FilterControls /></Sheet>
 */
export const Sheet = forwardRef<HTMLDivElement, SheetProps>(({ open, onClose, label, action, head, draggable = true, className = "", children, ...rest }, ref) => {
  const [drag, setDrag] = useState(0);
  const startY = useRef<number | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) setDrag(0);
  }, [open]);
  const onPointerDown = (e: PointerEvent) => {
    if (!Number.isFinite(e.clientY)) return;
    startY.current = e.clientY;
    (e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent) => {
    if (startY.current !== null) setDrag(dragOutcome(startY.current, e.clientY, 1).travelled);
  };
  const onPointerUp = (e: PointerEvent) => {
    if (startY.current === null) return;
    (e.currentTarget as HTMLElement | null)?.releasePointerCapture?.(e.pointerId);
    const { dismiss } = dragOutcome(startY.current, e.clientY, panel.current?.getBoundingClientRect().height || 1);
    startY.current = null;
    setDrag(0);
    if (dismiss) onClose();
  };
  const onPointerCancel = () => {
    startY.current = null;
    setDrag(0);
  };
  return (
    <Dialog open={open} onClose={onClose} align="end" padding="none" dismissible={false} aria-label={label} className={className} ref={ref} {...rest}>
      <div ref={panel} className="strand-sheet__panel" style={drag ? `transform: translateY(${drag}px)` : undefined}>
        {draggable && (
          <div className="strand-sheet__grab" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel}>
            <span className="strand-sheet__grabber" aria-hidden="true" />
          </div>
        )}
        {head && <div className="strand-sheet__head">{head}</div>}
        <div className="strand-sheet__body">{children}</div>
        {action && <div className="strand-sheet__foot">{action}</div>}
      </div>
    </Dialog>
  );
});
Sheet.displayName = "Sheet";

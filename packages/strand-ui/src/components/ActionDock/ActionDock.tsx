/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX, RefObject } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { cx, mergeRefs } from "../../internal/index.js";

export interface ActionDockProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Showing; ignored when `watch` is set. */
  visible?: boolean;
  /** The in-flow control this dock stands in for; the dock shows itself while that control is off screen (a selector string is deprecated; pass a ref). */
  watch?: RefObject<Element | null> | string;
  /** When to show while watching; only `"hidden"` today. */
  revealWhen?: "hidden";
}

/** Whether `el` is outside the viewport trimmed by `inset` px at the bottom; entirely visible counts as present (cf: actiondock-reveal). */
export function observeOffScreen(el: Element, onChange: (offScreen: boolean) => void, inset = 0): () => void {
  if (typeof IntersectionObserver !== "function") return () => {};
  const io = new IntersectionObserver(([entry]) => onChange(entry.intersectionRatio < 1), {
    rootMargin: `0px 0px -${Math.max(0, Math.round(inset))}px 0px`,
    threshold: [0, 1],
  });
  io.observe(el);
  return () => io.disconnect();
}

let warnedSelector = false;

/**
 * A bottom-anchored region carrying the one primary action of a view (DL 14.8); a thin wrapper over `.strand-actiondock`. Give a docked copy of an in-flow control `aria-hidden` and `tabIndex={-1}`.
 *
 * @example
 * const rsvp = useRef(null);
 * <Button ref={rsvp}>RSVP</Button>
 * <ActionDock watch={rsvp} aria-hidden="true"><Button tabIndex={-1} onClick={onRsvp}>RSVP</Button></ActionDock>
 */
export const ActionDock = forwardRef<HTMLDivElement, ActionDockProps>(({ visible = false, watch, revealWhen = "hidden", className = "", children, ...rest }, ref) => {
  const self = useRef<HTMLDivElement | null>(null);
  const [selfDriven, setSelfDriven] = useState(false);
  // The dock's own height trims the observed viewport, and it is state because it lays out after the observer effect.
  const [inset, setInset] = useState(0);

  useLayoutEffect(() => {
    const el = self.current;
    if (!el || typeof ResizeObserver !== "function") return undefined;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;
      setInset((prev) => (Math.abs(prev - h) > 1 ? h : prev));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!watch || revealWhen !== "hidden") return undefined;
    if (typeof watch === "string" && !warnedSelector && typeof console !== "undefined") {
      warnedSelector = true;
      console.warn("[strand] ActionDock: `watch` as a selector string is deprecated; pass a ref to the control.");
    }
    const target = typeof watch === "string" ? (typeof document === "undefined" ? null : document.querySelector(watch)) : watch.current;
    if (!target) return undefined;
    return observeOffScreen(target, setSelfDriven, inset);
  }, [watch, revealWhen, inset]);

  return (
    <div ref={mergeRefs(self, ref)} className={cx("strand-actiondock", className)} data-strand-actiondock={(watch ? selfDriven : visible) ? "visible" : "hidden"} {...rest}>
      {children}
    </div>
  );
});
ActionDock.displayName = "ActionDock";

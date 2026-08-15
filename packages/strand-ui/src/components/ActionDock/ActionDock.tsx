/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX, RefObject } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";

export interface ActionDockProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the dock is showing. Default false, so a dock that is never
   * driven occludes nothing rather than welding itself across the content.
   *
   * Ignored when `watch` is set: the dock drives itself then.
   */
  visible?: boolean;

  /**
   * The in-flow control this dock stands in for, as a ref or a selector.
   *
   * Supplying it makes the dock OWN its own reveal, which is the behaviour
   * this component has always documented and never implemented. See
   * `revealWhen`.
   */
  watch?: RefObject<Element | null> | string;

  /**
   * When to show, while `watch` is set. Only `"hidden"` today: show the dock
   * while the watched control is off screen, hide it while the control is
   * reachable. Named rather than boolean so a later rule ("visible", "past")
   * is an added value instead of a second prop.
   */
  revealWhen?: "hidden";
}

/**
 * Whether `el` is outside the viewport, minus a bottom strip of `inset` px.
 *
 * Exported for the test tier and for a vanilla consumer driving
 * `data-strand-actiondock` by hand: the reveal RULE is the part worth sharing,
 * and it is the part every consumer was getting subtly wrong.
 *
 * `inset` trims the viewport by the dock's own height so the dock never
 * appears while the control it replaces is still visible UNDERNEATH it, which
 * is the two-live-buttons state this component's contract forbids.
 *
 * THRESHOLD 1, NOT 0, AND THE DIFFERENCE IS A CONTROL YOU CANNOT PRESS.
 * At 0 a single intersecting pixel counts as "on screen", so a control scrolled
 * half off the TOP kept the dock hidden while only a sliver of the real button
 * remained. Measured in a consumer: the button at top -22 / bottom 22, leaving
 * 22px of a 44px target, under SC 2.5.8's 24px floor, with no dock to fall back
 * on. The contract is that the dock stands in while the control is not
 * REACHABLE, and a fraction of a target is not reachable.
 *
 * The control counts as present only while it is ENTIRELY inside the trimmed
 * viewport, so the dock covers every partial state at both edges.
 */
export function observeOffScreen(
  el: Element,
  onChange: (offScreen: boolean) => void,
  inset = 0,
): () => void {
  if (typeof IntersectionObserver !== "function") return () => {};
  const io = new IntersectionObserver(
    // THE RATIO, NOT `isIntersecting`. With a threshold of 1 the callback fires
    // when the ratio CROSSES 1.0, but `isIntersecting` still means "intersects
    // at all", so reading it leaves the dock stale between crossings: measured
    // showing while the control sat fully visible above it, which is the
    // two-live-buttons state. Two thresholds so the callback fires at both
    // boundaries, and the ratio decides.
    ([entry]) => onChange(entry.intersectionRatio < 1),
    { rootMargin: `0px 0px -${Math.max(0, Math.round(inset))}px 0px`, threshold: [0, 1] },
  );
  io.observe(el);
  return () => io.disconnect();
}

/**
 * A bottom-anchored region carrying the primary action of a view, placed
 * where a thumb rests.
 *
 * Implements design-language.md 14.8 (target position). 14.7 makes a target
 * hittable; this makes it reachable. This is a thin wrapper over the
 * `.strand-actiondock` classes; the CSS is the primitive, and a
 * vanilla-HTML consumer flipping `data-strand-actiondock` by hand gets
 * identical behaviour.
 *
 * Use it for the ONE action a view exists to produce. Two docked actions is
 * a bottom toolbar, which is a different pattern; a view with no single
 * primary action does not want a dock.
 *
 * Show it only while the in-flow control it stands in for is off screen.
 * A dock competing with the real control is two live buttons for one
 * action, and it costs the reader a decision they should not have to make.
 *
 * Accessibility: the docked control usually duplicates one that is already
 * in the accessibility tree, so give the copy `aria-hidden` and a
 * `tabIndex={-1}` control to avoid a duplicate announcement and a duplicate
 * tab stop. Reach is a thumb problem; a keyboard user reaches the in-flow
 * control by tabbing and gains nothing from the copy. If a dock ever
 * carries an action with NO in-flow equivalent, that reasoning does not
 * apply and it must be exposed.
 *
 * THE DOCK CAN DRIVE ITSELF. Pass `watch` and it owns the rule above:
 * every consumer that hand-rolled it got the same two details wrong, so the
 * details now live here once. Watch the ACTIONABLE element, not the card
 * containing it, or the dock leaves while the button is still below the fold
 * and the reader can press neither. `visible` remains for a consumer driving
 * it from state it already has.
 *
 * @example
 * ```tsx
 * import { ActionDock, Button } from '@dillingerstaffing/strand-ui';
 *
 * // The dock drives itself from the control it stands in for
 * const rsvp = useRef(null);
 * <>
 *   <Button ref={rsvp} variant="primary" onClick={onRsvp}>RSVP</Button>
 *   <ActionDock watch={rsvp} aria-hidden="true">
 *     <Button variant="primary" tabIndex={-1} onClick={onRsvp}>RSVP</Button>
 *   </ActionDock>
 * </>
 *
 * // Or driven by the consumer, unchanged
 * <ActionDock visible={!onScreen} aria-hidden="true">...</ActionDock>
 * ```
 */
export const ActionDock = forwardRef<HTMLDivElement, ActionDockProps>(
  ({ visible = false, watch, revealWhen = "hidden", className = "", children, ...rest }, ref) => {
    const classes = ["strand-actiondock", className].filter(Boolean).join(" ");
    const self = useRef<HTMLDivElement | null>(null);
    const [selfDriven, setSelfDriven] = useState(false);

    // THE DOCK'S OWN HEIGHT IS STATE, NOT A READ AT OBSERVER SETUP.
    //
    // The margin must trim the viewport by this dock's height, and reading it
    // once inside the observer effect reads an EMPTY dock: the effect runs
    // before children have laid out. A dock that later grows leaves the margin
    // short, and the watched control and the dock go live at the same time,
    // which is the exact state the contract forbids. Measured in a consumer:
    // ~90px short, both controls live at 25% scroll.
    const [inset, setInset] = useState(0);

    useLayoutEffect(() => {
      const el = self.current;
      if (!el || typeof ResizeObserver !== "function") return undefined;
      const ro = new ResizeObserver(() => {
        const h = el.offsetHeight;
        // Only on a real change: setting state from a resize the state itself
        // caused is a loop.
        setInset((prev) => (Math.abs(prev - h) > 1 ? h : prev));
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    useEffect(() => {
      if (!watch || revealWhen !== "hidden") return undefined;
      const target =
        typeof watch === "string"
          ? typeof document === "undefined"
            ? null
            : document.querySelector(watch)
          : watch.current;
      // NO TARGET MEANS NO DOCK. A dock that shows because it could not find
      // what it stands in for is a second live control with nothing to
      // reconcile against, which is worse than no dock at all.
      if (!target) return undefined;
      return observeOffScreen(target, setSelfDriven, inset);
    }, [watch, revealWhen, inset]);

    const showing = watch ? selfDriven : visible;

    return (
      <div
        ref={(node) => {
          self.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as { current: HTMLDivElement | null }).current = node;
        }}
        className={classes}
        data-strand-actiondock={showing ? "visible" : "hidden"}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ActionDock.displayName = "ActionDock";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface ActionDockProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the dock is showing. Default false, so a dock that is never
   * driven occludes nothing rather than welding itself across the content.
   */
  visible?: boolean;
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
 * @example
 * ```tsx
 * import { ActionDock, Button } from '@dillingerstaffing/strand-ui';
 *
 * // Driven by an IntersectionObserver on the real control
 * <ActionDock visible={!primaryControlOnScreen} aria-hidden="true">
 *   <Button variant="primary" tabIndex={-1} onClick={rsvp}>RSVP</Button>
 * </ActionDock>
 * ```
 */
export const ActionDock = forwardRef<HTMLDivElement, ActionDockProps>(
  ({ visible = false, className = "", children, ...rest }, ref) => {
    const classes = ["strand-actiondock", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        data-strand-actiondock={visible ? "visible" : "hidden"}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ActionDock.displayName = "ActionDock";

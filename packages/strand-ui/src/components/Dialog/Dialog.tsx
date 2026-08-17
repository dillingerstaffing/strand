/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useLayoutEffect, useRef, useCallback } from "preact/hooks";

export interface DialogProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "title" | "open"> {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when the dialog should close */
  onClose: () => void;
  /** Optional title rendered in the dialog header */
  title?: string;
  /** Close when clicking the backdrop */
  closeOnOutsideClick?: boolean;
  /** Close when pressing Escape */
  closeOnEscape?: boolean;
  /**
   * Where the panel sits in the viewport. `center` is right for a
   * confirmation. `start` drops it under the reader's gaze, which is where
   * a search or command overlay belongs: centred, a fixed-height panel
   * straddles the fold on a short viewport and its input is the last thing
   * the eye reaches.
   *
   * `end` anchors the panel to the bottom edge as a SHEET: full-bleed,
   * top-only radius, slide-up entrance. This is not a margin tweak, it is
   * the pattern DL 11.6 names, and it exists because 14.8 requires a touch
   * view's primary action to reach the bottom third of the viewport, which
   * a centred panel cannot do at any height. Prefer `Sheet`, which composes
   * this with the grabber, the scrolling body and the drag gesture the
   * pattern also owns.
   */
  align?: "center" | "start" | "end";
  /**
   * Inner padding. The same ladder `Card` carries, at the same values.
   * `none` also clips content to the panel's radius, for panels whose
   * children carry their own inset (a query row, a scrolling list).
   */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /**
   * Whether to render the close button. Set `false` for overlays whose
   * convention has no X and whose dismissal is Escape or the backdrop: a
   * palette, a command bar, a search panel. The button is absolutely
   * positioned over the panel's top band, so content otherwise has to
   * dodge a control the pattern does not use.
   *
   * Escape and backdrop dismissal are unaffected; this hides a control, it
   * does not trap the reader.
   */
  dismissible?: boolean;
  /** Dialog content */
  children?: ComponentChildren;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not(:disabled), textarea:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';

let dialogIdCounter = 0;

/**
 * Modal overlay with focus trapping, scroll lock, and backdrop click dismissal.
 *
 * @example
 * ```tsx
 * import { Dialog } from '@dillingerstaffing/strand-ui';
 *
 * <Dialog open={isOpen} onClose={() => setOpen(false)} title="Confirm">
 *   <p>Are you sure?</p>
 *   <Button onClick={() => setOpen(false)}>Close</Button>
 * </Dialog>
 * ```
 */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      onClose,
      title,
      closeOnOutsideClick = true,
      closeOnEscape = true,
      align = "center",
      padding = "lg",
      dismissible = true,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<Element | null>(null);
    const idRef = useRef(`strand-dialog-title-${++dialogIdCounter}`);
    const titleId = idRef.current;

    // Focus trap and focus restoration.
    //
    // Every focus() here passes preventScroll. focus() scrolls its target
    // into view by default, and both moments this effect focuses something
    // are moments the page must not move: on OPEN the panel is fixed in the
    // viewport, so there is nothing to scroll to; on CLOSE the restore
    // target is whatever held focus before the dialog, and when that sits
    // below the fold (a clicked card, a composer) the default yanked the
    // page down to it the instant the dialog dismissed. Focus still moves
    // for keyboard and assistive tech; only the viewport stays put.
    useEffect(() => {
      if (!open) return;

      previousFocusRef.current = document.activeElement;

      // Small delay to allow the DOM to render before querying focusable elements
      const raf = requestAnimationFrame(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length > 0) {
          focusable[0].focus({ preventScroll: true });
        } else {
          panel.focus({ preventScroll: true });
        }
      });

      return () => {
        cancelAnimationFrame(raf);
        const prev = previousFocusRef.current;
        if (prev && prev instanceof HTMLElement) {
          prev.focus({ preventScroll: true });
        }
      };
    }, [open]);

    // Scroll lock.
    //
    // Hiding overflow REMOVES the scrollbar, and on any page tall enough to
    // have one that widens the viewport by the scrollbar's width, shifting the
    // entire app sideways the instant a dialog opens. The defect is invisible
    // on overlay-scrollbar platforms, which is how it shipped: the gap
    // measures 0 there and every write below is a no-op.
    //
    // Do NOT reach for `scrollbar-gutter: stable` here. The 0.36.3 lock did,
    // and it cannot work: per css-overflow, the gutter is only reserved when
    // overflow is scroll or auto, so the same `overflow: hidden` that removes
    // the scrollbar also voids the reservation, and classic-scrollbar systems
    // shifted exactly as before. It LOOKED fixed because every headless
    // environment this ran in uses overlay scrollbars, where the gap is 0 and
    // the assertion was vacuous.
    //
    // What actually holds, all of it restored on close:
    //   1. padding-right on the body by the measured gap keeps the in-flow
    //      content exactly where it was;
    //   2. `--strand-scrollbar-gap` on the root carries the same gap to
    //      position: fixed elements, which size against the viewport and are
    //      untouchable by body padding. Strand's own fixed chrome
    //      (.strand-nav--glass) consumes it; consumers with their own fixed
    //      elements can too. Unset, it resolves to 0px and is inert.
    //   3. overflow: hidden on the BODY only. With the root's overflow left
    //      visible, body overflow propagates to the viewport, so this alone
    //      stops page scroll; the root's styles are never touched.
    //
    // A LAYOUT EFFECT, NOT AN EFFECT, and the difference is visible.
    //
    // `useEffect` runs AFTER paint, so the panel's first painted frame is
    // composed against a viewport that still has the scrollbar in it. The lock
    // then removes the scrollbar, the viewport widens by the gap, and a
    // centred panel re-centres by half that on the very next frame. Measured
    // in a consumer, classic 8px scrollbar: the panel painted at left 396 and
    // jumped to 400, one frame later, with no frames in between.
    //
    // The defect hid behind open animations. A panel that animates its width
    // in absorbs the 4px into motion already on screen, so the same jump was
    // invisible on one dialog and obvious on the small fixed-size one beside
    // it, which reads as a difference between the two dialogs rather than as
    // the shared bug it is.
    //
    // Running before paint makes the viewport width final BEFORE the panel is
    // first composed, so there is no reposition to see, animated or not. It is
    // also the correct tier for this work generally: every write here is a
    // synchronous style mutation that layout depends on, which is precisely
    // what the layout phase is for.
    useLayoutEffect(() => {
      if (!open) return;

      const root = document.documentElement;
      const body = document.body;
      // A zero clientWidth means no layout engine is running (jsdom, some
      // embeds); subtracting it would read the WHOLE viewport as scrollbar
      // and pad the body by a thousand pixels. No layout, nothing to
      // compensate.
      const gap = root.clientWidth > 0 ? window.innerWidth - root.clientWidth : 0;
      const originalBodyOverflow = body.style.overflow;
      const originalPadding = body.style.paddingRight;
      const hadGapVar = root.style.getPropertyValue("--strand-scrollbar-gap");

      if (gap > 0) {
        body.style.paddingRight = `${gap}px`;
        root.style.setProperty("--strand-scrollbar-gap", `${gap}px`);
      }
      body.style.overflow = "hidden";

      return () => {
        body.style.overflow = originalBodyOverflow;
        body.style.paddingRight = originalPadding;
        if (hadGapVar) {
          root.style.setProperty("--strand-scrollbar-gap", hadGapVar);
        } else {
          root.style.removeProperty("--strand-scrollbar-gap");
        }
      };
    }, [open]);

    // Keyboard handler
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape" && closeOnEscape) {
          e.stopPropagation();
          onClose();
          return;
        }

        if (e.key === "Tab") {
          const panel = panelRef.current;
          if (!panel) return;

          const focusable = Array.from(
            panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      },
      [closeOnEscape, onClose],
    );

    const handleBackdropClick = useCallback(
      (e: MouseEvent) => {
        if (closeOnOutsideClick && e.target === e.currentTarget) {
          onClose();
        }
      },
      [closeOnOutsideClick, onClose],
    );

    if (!open) return null;

    const classes = [
      "strand-dialog__panel",
      align === "center" ? "" : `strand-dialog__panel--align-${align}`,
      `strand-dialog__panel--pad-${padding}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className="strand-dialog__backdrop"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
      >
        <div
          ref={(el) => {
            (panelRef as { current: HTMLDivElement | null }).current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) (ref as { current: HTMLDivElement | null }).current = el;
          }}
          className={classes}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          tabIndex={-1}
          {...rest}
        >
          {title && (
            <div className="strand-dialog__header">
              <h2 id={titleId} className="strand-dialog__title">
                {title}
              </h2>
            </div>
          )}
          {dismissible && (
            <button
              type="button"
              className="strand-dialog__close"
              aria-label="Close"
              onClick={onClose}
            >
              &#215;
            </button>
          )}
          <div className="strand-dialog__body">{children}</div>
        </div>
      </div>
    );
  },
);

Dialog.displayName = "Dialog";

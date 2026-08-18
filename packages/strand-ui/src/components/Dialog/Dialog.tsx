/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX, RefObject } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useId, useLayoutEffect, useRef } from "preact/hooks";
import { cx, mergeRefs } from "../../internal/index.js";

export interface DialogProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "title" | "open"> {
  open: boolean;
  onClose: () => void;
  /** Rendered in the header and used as the accessible name. */
  title?: string;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  /** `center` for a confirmation, `start` under the reader's gaze for a search overlay, `end` anchored to the bottom as a sheet (DL 11.6); prefer `Sheet` for the last. */
  align?: "center" | "start" | "end";
  /** Inner padding, the same ladder `Card` carries; `none` also clips to the panel radius. */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** Render the close control; overlays dismissed by Escape or the backdrop pass `false`. */
  dismissible?: boolean;
  /** The element to focus on open; defaults to the first focusable child, else the panel. */
  initialFocus?: RefObject<HTMLElement | null>;
  children?: ComponentChildren;
}

const FOCUSABLE = 'a[href], button:not(:disabled), textarea:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';

/**
 * Modal overlay with a focus trap, focus restoration, scroll lock and Escape and backdrop dismissal.
 *
 * @example
 * <Dialog open={isOpen} onClose={() => setOpen(false)} title="Confirm"><p>Are you sure?</p></Dialog>
 */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ open, onClose, title, closeOnOutsideClick = true, closeOnEscape = true, align = "center", padding = "lg", dismissible = true, initialFocus, className = "", children, ...rest }, ref) => {
    const panel = useRef<HTMLDivElement>(null);
    const titleId = useId();

    // Focus trap and restoration; every focus() passes preventScroll so neither moment moves the page (cf: dialog-focus-restore).
    useEffect(() => {
      if (!open) return;
      const previous = document.activeElement;
      const target = initialFocus?.current ?? panel.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panel.current;
      target?.focus({ preventScroll: true });
      return () => {
        if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
      };
    }, [open, initialFocus]);

    // Scroll lock, before paint, compensating for the scrollbar it removes (cf: dialog-scroll-lock).
    useLayoutEffect(() => {
      if (!open) return;
      const root = document.documentElement;
      const body = document.body;
      const gap = root.clientWidth > 0 ? window.innerWidth - root.clientWidth : 0;
      const restore = { overflow: body.style.overflow, paddingRight: body.style.paddingRight, gapVar: root.style.getPropertyValue("--strand-scrollbar-gap") };
      if (gap > 0) {
        body.style.paddingRight = `${gap}px`;
        root.style.setProperty("--strand-scrollbar-gap", `${gap}px`);
      }
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = restore.overflow;
        body.style.paddingRight = restore.paddingRight;
        if (restore.gapVar) root.style.setProperty("--strand-scrollbar-gap", restore.gapVar);
        else root.style.removeProperty("--strand-scrollbar-gap");
      };
    }, [open]);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        e.stopPropagation();
        return onClose();
      }
      if (e.key !== "Tab" || !panel.current) return;
      const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    if (!open) return null;
    return (
      <div className="strand-dialog__backdrop" onClick={(e) => closeOnOutsideClick && e.target === e.currentTarget && onClose()} onKeyDown={onKeyDown}>
        <div
          ref={mergeRefs(panel, ref)}
          className={cx("strand-dialog__panel", align !== "center" && `strand-dialog__panel--align-${align}`, `strand-dialog__panel--pad-${padding}`, className)}
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
            <button type="button" className="strand-dialog__close" aria-label="Close" onClick={onClose}>
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

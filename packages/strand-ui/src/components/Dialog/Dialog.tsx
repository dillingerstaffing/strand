/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useRef, useCallback } from "preact/hooks";

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

    // Focus trap and focus restoration
    useEffect(() => {
      if (!open) return;

      previousFocusRef.current = document.activeElement;

      // Small delay to allow the DOM to render before querying focusable elements
      const raf = requestAnimationFrame(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          panel.focus();
        }
      });

      return () => {
        cancelAnimationFrame(raf);
        const prev = previousFocusRef.current;
        if (prev && prev instanceof HTMLElement) {
          prev.focus();
        }
      };
    }, [open]);

    // Scroll lock
    useEffect(() => {
      if (!open) return;

      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = original;
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

    const classes = ["strand-dialog__panel", className]
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
          <button
            type="button"
            className="strand-dialog__close"
            aria-label="Close"
            onClick={onClose}
          >
            &#215;
          </button>
          <div className="strand-dialog__body">{children}</div>
        </div>
      </div>
    );
  },
);

Dialog.displayName = "Dialog";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface AlertProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "status" | "title"> {
  /** Severity; error and warning announce assertively. */
  status?: "info" | "success" | "warning" | "error";
  /** Show the dismiss control. */
  dismissible?: boolean;
  /** Called when the dismiss control is pressed. */
  onDismiss?: () => void;
  /** Accessible name of the dismiss control. */
  dismissLabel?: string;
  /** Heading set above the message. */
  title?: ComponentChildren;
  /** A control set after the message, such as an undo button. */
  action?: ComponentChildren;
  children?: ComponentChildren;
}

/**
 * Contextual feedback banner.
 *
 * @example
 * <Alert status="success" dismissible onDismiss={close}>Saved.</Alert>
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ status = "info", dismissible = false, onDismiss, dismissLabel = "Dismiss", title, action, className = "", children, ...rest }, ref) => {
    const role = status === "error" || status === "warning" ? "alert" : "status";
    const statusLabel = status === "success" ? "COMPLETE" : status.toUpperCase();
    return (
      <div ref={ref} className={cx("strand-alert", `strand-alert--${status}`, className)} role={role} {...rest}>
        <span className="strand-alert__status">{statusLabel}</span>
        <div className="strand-alert__content">
          {title && <div className="strand-alert__title">{title}</div>}
          {children}
        </div>
        {action && <div className="strand-alert__action">{action}</div>}
        {dismissible && (
          <button type="button" className="strand-alert__dismiss" aria-label={dismissLabel} onClick={onDismiss}>
            &#215;
          </button>
        )}
      </div>
    );
  },
);
Alert.displayName = "Alert";

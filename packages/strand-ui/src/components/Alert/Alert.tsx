/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface AlertProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "status"> {
  /** Severity; error and warning announce assertively. */
  status?: "info" | "success" | "warning" | "error";
  /** Show the dismiss control. */
  dismissible?: boolean;
  /** Called when the dismiss control is pressed. */
  onDismiss?: () => void;
  children?: ComponentChildren;
}

/**
 * Contextual feedback banner.
 *
 * @example
 * <Alert status="success" dismissible onDismiss={close}>Saved.</Alert>
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ status = "info", dismissible = false, onDismiss, className = "", children, ...rest }, ref) => {
    const role = status === "error" || status === "warning" ? "alert" : "status";
    const statusLabel = status === "success" ? "COMPLETE" : status.toUpperCase();
    return (
      <div ref={ref} className={cx("strand-alert", `strand-alert--${status}`, className)} role={role} {...rest}>
        <span className="strand-alert__status">{statusLabel}</span>
        <div className="strand-alert__content">{children}</div>
        {dismissible && (
          <button type="button" className="strand-alert__dismiss" aria-label="Dismiss" onClick={onDismiss}>
            &#215;
          </button>
        )}
      </div>
    );
  },
);
Alert.displayName = "Alert";

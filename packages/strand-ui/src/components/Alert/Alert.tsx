/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface AlertProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "status"> {
  /** Visual status of the alert */
  status?: "info" | "success" | "warning" | "error";
  /** Show dismiss button */
  dismissible?: boolean;
  /** Called when dismiss button is clicked */
  onDismiss?: () => void;
  /** Alert content */
  children?: ComponentChildren;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      status = "info",
      dismissible = false,
      onDismiss,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const role =
      status === "error" || status === "warning" ? "alert" : "status";

    const classes = [
      "strand-alert",
      `strand-alert--${status}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} role={role} {...rest}>
        <div className="strand-alert__content">{children}</div>
        {dismissible && (
          <button
            type="button"
            className="strand-alert__dismiss"
            aria-label="Dismiss"
            onClick={onDismiss}
          >
            &#215;
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";

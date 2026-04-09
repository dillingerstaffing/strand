/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { createContext } from "preact";
import { forwardRef } from "preact/compat";
import { useState, useContext, useEffect, useCallback, useRef } from "preact/hooks";

export type ToastStatus = "info" | "success" | "warning" | "error";

export interface ToastOptions {
  message: string;
  status?: ToastStatus;
  duration?: number;
}

interface ToastEntry extends Required<Omit<ToastOptions, "duration">> {
  id: number;
  duration: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

let toastIdCounter = 0;

export interface ToastProviderProps {
  children?: ComponentChildren;
  className?: string;
}

/**
 * Context provider that manages toast notifications for its subtree.
 *
 * @example
 * ```tsx
 * import { ToastProvider, useToast } from '@dillingerstaffing/strand-ui';
 *
 * function App() {
 *   return (
 *     <ToastProvider>
 *       <Page />
 *     </ToastProvider>
 *   );
 * }
 *
 * function Page() {
 *   const { toast } = useToast();
 *   return <Button onClick={() => toast({ message: 'Saved', status: 'success' })}>Save</Button>;
 * }
 * ```
 */
export const ToastProvider = ({ children, className = "" }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((options: ToastOptions) => {
    const entry: ToastEntry = {
      id: ++toastIdCounter,
      message: options.message,
      status: options.status ?? "info",
      duration: options.duration ?? 5000,
    };
    setToasts((prev) => [...prev, entry]);
  }, []);

  const containerClasses = ["strand-toast__container", className]
    .filter(Boolean)
    .join(" ");

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {toasts.length > 0 && (
        <div className={containerClasses}>
          {toasts.map((entry) => (
            <ToastItem
              key={entry.id}
              entry={entry}
              onDismiss={() => removeToast(entry.id)}
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = "ToastProvider";

/* ── Individual toast item ── */

interface ToastItemProps {
  entry: ToastEntry;
  onDismiss: () => void;
}

function ToastItem({ entry, onDismiss }: ToastItemProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (entry.duration > 0) {
      timerRef.current = setTimeout(onDismiss, entry.duration);
    }
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [entry.duration, onDismiss]);

  const isUrgent = entry.status === "error" || entry.status === "warning";

  const classes = ["strand-toast", `strand-toast--${entry.status}`]
    .filter(Boolean)
    .join(" ");

  const statusLabel =
    entry.status === "success" ? "COMPLETE" : entry.status.toUpperCase();

  return (
    <div
      className={classes}
      role="status"
      aria-live={isUrgent ? "assertive" : "polite"}
    >
      <span className="strand-toast__status">{statusLabel}</span>
      <span className="strand-toast__message">{entry.message}</span>
      <button
        type="button"
        className="strand-toast__dismiss"
        aria-label="Dismiss"
        onClick={onDismiss}
      >
        &#215;
      </button>
    </div>
  );
}

/* ── Standalone Toast (for direct rendering) ── */

export interface ToastProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "status"> {
  /** Visual status */
  status?: ToastStatus;
  /** Toast message text */
  message: string;
  /** Called when dismiss button is clicked */
  onDismiss?: () => void;
}

/**
 * Standalone notification message with status indicator and optional dismiss.
 *
 * @example
 * ```tsx
 * import { Toast } from '@dillingerstaffing/strand-ui';
 *
 * <Toast status="success" message="Changes saved." onDismiss={() => {}} />
 * ```
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ status = "info", message, onDismiss, className = "", ...rest }, ref) => {
    const isUrgent = status === "error" || status === "warning";

    const classes = [
      "strand-toast",
      `strand-toast--${status}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const statusLabel =
      status === "success" ? "COMPLETE" : status.toUpperCase();

    return (
      <div
        ref={ref}
        className={classes}
        role="status"
        aria-live={isUrgent ? "assertive" : "polite"}
        {...rest}
      >
        <span className="strand-toast__status">{statusLabel}</span>
        <span className="strand-toast__message">{message}</span>
        {onDismiss && (
          <button
            type="button"
            className="strand-toast__dismiss"
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

Toast.displayName = "Toast";

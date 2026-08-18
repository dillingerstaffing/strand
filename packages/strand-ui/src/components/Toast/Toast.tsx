/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { createContext } from "preact";
import { forwardRef } from "preact/compat";
import { useCallback, useContext, useEffect, useRef, useState } from "preact/hooks";
import { cx } from "../../internal/index.js";

export type ToastStatus = "info" | "success" | "warning" | "error";

export interface ToastOptions {
  message: string;
  status?: ToastStatus;
  /** Milliseconds before auto-dismiss; 0 keeps it until dismissed. */
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

/** The `toast()` function of the nearest `ToastProvider`. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export interface ToastProviderProps {
  children?: ComponentChildren;
  className?: string;
}

/**
 * Manages the toasts of its subtree.
 *
 * @example
 * <ToastProvider><Page /></ToastProvider>
 * const { toast } = useToast(); toast({ message: "Saved", status: "success" });
 */
export const ToastProvider = ({ children, className = "" }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(0);
  const removeToast = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  const addToast = useCallback((options: ToastOptions) => {
    const entry: ToastEntry = { id: ++nextId.current, message: options.message, status: options.status ?? "info", duration: options.duration ?? 5000 };
    setToasts((prev) => [...prev, entry]);
  }, []);
  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {toasts.length > 0 && (
        <div className={cx("strand-toast__container", className)}>
          {toasts.map((entry) => (
            <ToastItem key={entry.id} entry={entry} onDismiss={() => removeToast(entry.id)} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};
ToastProvider.displayName = "ToastProvider";

function ToastItem({ entry, onDismiss }: { entry: ToastEntry; onDismiss: () => void }) {
  useEffect(() => {
    if (entry.duration <= 0) return;
    const timer = setTimeout(onDismiss, entry.duration);
    return () => clearTimeout(timer);
  }, [entry.duration, onDismiss]);
  return <Toast status={entry.status} message={entry.message} onDismiss={onDismiss} />;
}

export interface ToastProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "status"> {
  status?: ToastStatus;
  message: string;
  /** Renders the dismiss control. */
  onDismiss?: () => void;
}

/**
 * Standalone notification message.
 *
 * @example
 * <Toast status="success" message="Changes saved." onDismiss={close} />
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(({ status = "info", message, onDismiss, className = "", ...rest }, ref) => {
  const isUrgent = status === "error" || status === "warning";
  return (
    <div ref={ref} className={cx("strand-toast", `strand-toast--${status}`, className)} role="status" aria-live={isUrgent ? "assertive" : "polite"} {...rest}>
      <span className="strand-toast__status">{status === "success" ? "COMPLETE" : status.toUpperCase()}</span>
      <span className="strand-toast__message">{message}</span>
      {onDismiss && (
        <button type="button" className="strand-toast__dismiss" aria-label="Dismiss" onClick={onDismiss}>
          &#215;
        </button>
      )}
    </div>
  );
});
Toast.displayName = "Toast";

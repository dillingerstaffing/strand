/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX, VNode } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface ResultsPanelProps extends JSX.HTMLAttributes<HTMLElement> {
  /** The count line, in instrument voice. */
  count?: string;
  visible?: boolean;
  /** `results` shows children; `empty` and `error` show the state block instead. */
  state?: "results" | "empty" | "error";
  stateTitle?: string;
  stateHint?: string;
  /** Retry, offered only in the error state. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Accessible name for the region. */
  label?: string;
  children?: VNode | VNode[] | null;
  className?: string;
}

/**
 * The list an instrument returns for a query; the count is a polite live region.
 *
 * @example
 * <ResultsPanel count="12 matches detected">{results.map((r) => <ResultCard key={r.id} {...r} />)}</ResultsPanel>
 */
export const ResultsPanel = forwardRef<HTMLElement, ResultsPanelProps>(
  ({ count, visible = true, state = "results", stateTitle, stateHint, onRetry, retryLabel = "Retry", label = "Results", children, className = "", ...rest }, ref) => (
    <section ref={ref} className={cx("strand-results-panel", className)} aria-label={label} hidden={!visible} {...rest}>
      {count && (
        <div className="strand-results-panel__count" aria-live="polite">
          {count}
        </div>
      )}
      {state === "results" ? (
        <div className="strand-results-panel__items">{children}</div>
      ) : (
        <div className="strand-results-panel__state">
          {stateTitle && <div className="strand-results-panel__state-title">{stateTitle}</div>}
          {stateHint && <div className="strand-results-panel__state-hint">{stateHint}</div>}
          {state === "error" && onRetry && (
            <button type="button" className="strand-results-panel__error-link" onClick={onRetry}>
              {retryLabel}
            </button>
          )}
        </div>
      )}
    </section>
  ),
);
ResultsPanel.displayName = "ResultsPanel";

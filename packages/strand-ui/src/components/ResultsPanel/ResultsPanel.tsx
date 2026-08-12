/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX, VNode } from "preact";
import { forwardRef } from "preact/compat";

export interface ResultsPanelProps extends JSX.HTMLAttributes<HTMLElement> {
  /** The count line, in instrument voice: "12 matches detected". */
  count?: string;
  /** Whether the panel is showing. */
  visible?: boolean;
  /**
   * Which state to render. `results` shows children; `empty` and `error`
   * show the state block instead.
   *
   * These are three states and not two, deliberately. A failed request
   * and an empty result are different answers and the user is owed the
   * difference: "0 matches detected" means the instrument ran, and an
   * error means it did not.
   */
  state?: "results" | "empty" | "error";
  /** Heading for the empty or error state. */
  stateTitle?: string;
  /** Supporting line for the empty or error state. */
  stateHint?: string;
  /** Retry affordance, rendered only in the error state. */
  onRetry?: () => void;
  /** Label for the retry control. */
  retryLabel?: string;
  /** Accessible name for the region. */
  label?: string;
  children?: VNode | VNode[] | null;
  className?: string;
}

/**
 * The list an instrument returns for a query.
 *
 * Accessibility: a labelled `<section>` whose items region is a live
 * region, so a screen reader hears the count change when a query
 * re-runs rather than having to go looking for it.
 *
 * @example
 * ```tsx
 * <ResultsPanel count="12 matches detected" state="results">
 *   {results.map(r => <ResultCard key={r.id} {...r} />)}
 * </ResultsPanel>
 *
 * <ResultsPanel
 *   state="error" stateTitle="Process interrupted"
 *   stateHint="Retry sequence" onRetry={run}
 * />
 * ```
 */
export const ResultsPanel = forwardRef<HTMLElement, ResultsPanelProps>(
  (
    {
      count,
      visible = true,
      state = "results",
      stateTitle,
      stateHint,
      onRetry,
      retryLabel = "Retry",
      label = "Results",
      children,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const classes = ["strand-results-panel", className].filter(Boolean).join(" ");
    return (
      <section
        ref={ref}
        class={classes}
        aria-label={label}
        hidden={!visible}
        {...rest}
      >
        {count && (
          // Polite, not assertive: a count that re-announces on every
          // keystroke of a live search interrupts more than it informs.
          <div class="strand-results-panel__count" aria-live="polite">
            {count}
          </div>
        )}
        {state === "results" ? (
          <div class="strand-results-panel__items">{children}</div>
        ) : (
          <div class="strand-results-panel__state">
            {stateTitle && (
              <div class="strand-results-panel__state-title">{stateTitle}</div>
            )}
            {stateHint && (
              <div class="strand-results-panel__state-hint">{stateHint}</div>
            )}
            {state === "error" && onRetry && (
              <button
                type="button"
                class="strand-results-panel__error-link"
                onClick={onRetry}
              >
                {retryLabel}
              </button>
            )}
          </div>
        )}
      </section>
    );
  },
);
ResultsPanel.displayName = "ResultsPanel";

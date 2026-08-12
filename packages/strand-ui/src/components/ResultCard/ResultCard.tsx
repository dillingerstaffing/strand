/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface ResultCardProps
  extends Omit<JSX.HTMLAttributes<HTMLElement>, "title"> {
  /** Primary line. The result's name. */
  title: string;
  /** Secondary line, e.g. the organisation. */
  company?: string;
  /** Where it is. */
  location?: string;
  /** A second metadata value, e.g. a range. */
  salary?: string;
  /** Small chips. `remote` and `source` are the two defined tints. */
  badges?: { label: string; variant?: "remote" | "source" }[];
  /** Whether this is the highlighted result, e.g. the pin under the cursor. */
  active?: boolean;
  /** Called on activation. Makes the card a button. */
  onSelect?: () => void;
  className?: string;
}

/**
 * One result in an instrument's results panel.
 *
 * Renders as a `<button>` when it is selectable and an `<article>` when
 * it is not. A card that pans a map when clicked is a control and owes
 * the keyboard the same affordance as the mouse; a card that only
 * displays is not, and giving it a button role would promise otherwise.
 *
 * `active` is paired with `aria-current`, so the highlighted result is
 * announced rather than only tinted.
 *
 * @example
 * ```tsx
 * <ResultCard
 *   title="Systems Engineer" company="Acme" location="Oakland"
 *   badges={[{ label: 'Remote', variant: 'remote' }]}
 *   active={id === hovered} onSelect={() => panTo(id)}
 * />
 * ```
 */
export const ResultCard = forwardRef<HTMLElement, ResultCardProps>(
  (
    {
      title,
      company,
      location,
      salary,
      badges,
      active = false,
      onSelect,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-result-card",
      active ? "strand-result-card--active" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const body = (
      <>
        <div class="strand-result-card__title">{title}</div>
        {company && <div class="strand-result-card__company">{company}</div>}
        {(location || salary || badges?.length) && (
          <div class="strand-result-card__meta">
            {location && <span class="strand-result-card__location">{location}</span>}
            {salary && <span class="strand-result-card__salary">{salary}</span>}
            {badges?.map((b) => (
              <span
                key={b.label}
                class={[
                  "strand-result-card__badge",
                  b.variant ? `strand-result-card__badge--${b.variant}` : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}
      </>
    );

    const shared = {
      class: classes,
      "aria-current": active ? ("true" as const) : undefined,
    };

    // The ref is cast at each branch rather than the prop being narrowed,
    // because the element type genuinely differs by branch: a selectable
    // card is a <button> and a display card is an <article>. Typing the
    // prop as HTMLElement is the honest surface for a consumer who does
    // not control which branch renders.
    return onSelect ? (
      <button
        ref={ref as unknown as JSX.HTMLAttributes<HTMLButtonElement>["ref"]}
        type="button"
        {...shared}
        onClick={onSelect}
        {...(rest as JSX.HTMLAttributes<HTMLButtonElement>)}
      >
        {body}
      </button>
    ) : (
      <article
        ref={ref as unknown as JSX.HTMLAttributes<HTMLElement>["ref"]}
        {...shared}
        {...rest}
      >
        {body}
      </article>
    );
  },
);
ResultCard.displayName = "ResultCard";

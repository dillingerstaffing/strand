/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface ResultCardProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "title"> {
  /** The result's name. */
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  /** Small chips; `remote` and `source` are the two tints. */
  badges?: { label: string; variant?: "remote" | "source" }[];
  /** The highlighted result, announced with `aria-current`. */
  active?: boolean;
  /** Makes the card a button. */
  onSelect?: () => void;
  className?: string;
}

/**
 * One result in an instrument's results panel; a button when selectable, an article when not.
 *
 * @example
 * <ResultCard title="Systems Engineer" company="Acme" active={id === hovered} onSelect={() => panTo(id)} />
 */
export const ResultCard = forwardRef<HTMLElement, ResultCardProps>(
  ({ title, company, location, salary, badges, active = false, onSelect, className = "", ...rest }, ref) => {
    const body = (
      <>
        <div className="strand-result-card__title">{title}</div>
        {company && <div className="strand-result-card__company">{company}</div>}
        {(location || salary || badges?.length) && (
          <div className="strand-result-card__meta">
            {location && <span className="strand-result-card__location">{location}</span>}
            {salary && <span className="strand-result-card__salary">{salary}</span>}
            {badges?.map((b) => (
              <span key={b.label} className={cx("strand-result-card__badge", b.variant && `strand-result-card__badge--${b.variant}`)}>
                {b.label}
              </span>
            ))}
          </div>
        )}
      </>
    );
    const shared = {
      className: cx("strand-result-card", active && "strand-result-card--active", className),
      "aria-current": active ? ("true" as const) : undefined,
    };
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
      <article ref={ref as unknown as JSX.HTMLAttributes<HTMLElement>["ref"]} {...shared} {...rest}>
        {body}
      </article>
    );
  },
);
ResultCard.displayName = "ResultCard";

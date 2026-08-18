/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface CardSectionProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Header row: baseline aligned, space between. */
  header?: boolean;
}

/**
 * A row inside a `Card` with `padding="none"`, ruled off from its siblings.
 *
 * @example
 * <Card padding="none"><CardSection header>Title</CardSection><CardSection>Body</CardSection></Card>
 */
export const CardSection = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ header = false, className = "", children, ...rest }, ref) => (
    <div ref={ref} className={cx("strand-card__section", header && "strand-card__section--header", className)} {...rest}>
      {children}
    </div>
  ),
);
CardSection.displayName = "CardSection";

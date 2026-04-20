/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface CardSectionProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** When true, applies the --header layout (baseline, space-between, gap) */
  header?: boolean;
}

/**
 * A horizontal row inside a composed card, separated from siblings
 * by a hairline rule. Use multiple CardSection children inside a
 * Card with padding="none" to stack header / body / cta rows. The
 * first child's top rule is suppressed automatically.
 *
 * Distinct from the standalone `strand-card-section` molecule
 * (DL 11.10 section-boundary production), which is a same-named
 * block used outside cards.
 *
 * @example
 * ```tsx
 * import { Card, CardSection } from '@dillingerstaffing/strand-ui';
 *
 * <Card padding="none">
 *   <CardSection header>Title<span>Meta</span></CardSection>
 *   <CardSection>Body</CardSection>
 *   <CardSection>CTA row</CardSection>
 * </Card>
 * ```
 */
export const CardSection = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ header = false, className = "", children, ...rest }, ref) => {
    const classes = [
      "strand-card__section",
      header && "strand-card__section--header",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  },
);

CardSection.displayName = "CardSection";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface SectionProps extends JSX.HTMLAttributes<HTMLElement> {
  /** Padding rhythm. */
  variant?: "standard" | "hero" | "compact";
  background?: "primary" | "elevated" | "recessed";
  borderTop?: boolean;
  /** Element to render, e.g. "header". */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Page-level content region.
 *
 * @example
 * <Section variant="hero" background="recessed"><Container>...</Container></Section>
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ variant = "standard", background = "primary", borderTop = false, as = "section", className = "", children, ...rest }, ref) => {
    // biome-ignore lint/suspicious/noExplicitAny: polymorphic tag
    const Tag = as as any;
    return (
      <Tag
        ref={ref}
        className={cx("strand-section", `strand-section--${variant}`, `strand-section--bg-${background}`, borderTop && "strand-section--border-top", className)}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);
Section.displayName = "Section";

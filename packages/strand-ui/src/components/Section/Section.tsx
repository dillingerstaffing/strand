/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface SectionProps extends JSX.HTMLAttributes<HTMLElement> {
  /** Padding variant */
  variant?: "standard" | "hero" | "compact";
  /** Surface background */
  background?: "primary" | "elevated" | "recessed";
  /** Top border separator */
  borderTop?: boolean;
}

/**
 * Page-level content region with padding, background, and optional top border.
 *
 * @example
 * ```tsx
 * import { Section, Container } from '@dillingerstaffing/strand-ui';
 *
 * <Section variant="hero" background="recessed">
 *   <Container>
 *     <h1>Hero Section</h1>
 *   </Container>
 * </Section>
 * ```
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      variant = "standard",
      background = "primary",
      borderTop = false,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-section",
      `strand-section--${variant}`,
      `strand-section--bg-${background}`,
      borderTop && "strand-section--border-top",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <section ref={ref} className={classes} {...rest}>
        {children}
      </section>
    );
  },
);

Section.displayName = "Section";

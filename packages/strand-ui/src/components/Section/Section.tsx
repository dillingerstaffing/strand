/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface SectionProps extends JSX.HTMLAttributes<HTMLElement> {
  /** Padding variant */
  variant?: "standard" | "hero";
  /** Surface background */
  background?: "primary" | "elevated" | "recessed";
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      variant = "standard",
      background = "primary",
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

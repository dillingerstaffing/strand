/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { forwardRef } from "preact/compat";

export interface ScrollRevealProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  /** IntersectionObserver visibility threshold (0-1) */
  threshold?: number;
  /** Only trigger reveal once */
  once?: boolean;
}

/**
 * Intersection Observer wrapper that reveals children with a transition on scroll.
 *
 * @example
 * ```tsx
 * import { ScrollReveal } from '@dillingerstaffing/strand-ui';
 *
 * <ScrollReveal threshold={0.2} once>
 *   <p>This content fades in on scroll.</p>
 * </ScrollReveal>
 * ```
 */
export const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(
  ({ threshold = 0.1, once = true, className = "", children, ...rest }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);

    const classes = ["strand-reveal", className].filter(Boolean).join(" ");

    useEffect(() => {
      const el = innerRef.current;
      if (!el || typeof IntersectionObserver === "undefined") return;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("strand-reveal--visible");
              if (once) {
                observer.unobserve(entry.target);
              }
            } else if (!once) {
              entry.target.classList.remove("strand-reveal--visible");
            }
          }
        },
        { threshold },
      );

      observer.observe(el);

      return () => {
        observer.disconnect();
      };
    }, [threshold, once]);

    return (
      <div
        ref={(node) => {
          (innerRef as { current: HTMLDivElement | null }).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as { current: HTMLDivElement | null }).current = node;
        }}
        className={classes}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ScrollReveal.displayName = "ScrollReveal";

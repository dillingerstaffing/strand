/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useRef, useState } from "preact/hooks";
import { cx, mergeRefs } from "../../internal/index.js";

export interface ScrollRevealProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** IntersectionObserver threshold, 0 to 1. */
  threshold?: number;
  /** Reveal once and stop observing. */
  once?: boolean;
}

/**
 * Reveals its children when they scroll into view.
 *
 * @example
 * <ScrollReveal threshold={0.2} once><p>Fades in on scroll.</p></ScrollReveal>
 */
export const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(({ threshold = 0.1, once = true, className = "", children, ...rest }, ref) => {
  const own = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = own.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);
  return (
    <div ref={mergeRefs(own, ref)} className={cx("strand-reveal", visible && "strand-reveal--visible", className)} {...rest}>
      {children}
    </div>
  );
});
ScrollReveal.displayName = "ScrollReveal";

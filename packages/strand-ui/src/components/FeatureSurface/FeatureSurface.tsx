/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface FeatureSurfaceProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Render as a different element, e.g. "article" or "section". */
  as?: "div" | "article" | "section";
  className?: string;
}

/**
 * The second dark surface role (design-language.md 9.3): a single element
 * promoted above the content around it. The one card a view is built on.
 *
 * Not `InstrumentViewport`, and the difference is not a shade. That one is
 * the abyss and exists for DENSITY — maps, charts, terminal output. This is
 * midnight and exists for EMPHASIS. 9.3's test: is the darkness carrying
 * data, or carrying emphasis?
 *
 * **The cascade is the primitive, not the background.** Midnight is ~2.5x
 * lighter than the abyss, so `gray-400` (6.99 → 4.36) and `teal-vital`
 * (7.07 → 4.42) both fail as text here while passing there, and the
 * instrument cascade uses both. Put ordinary text primitives inside this
 * and they retint themselves correctly; a bare background utility would
 * hand you the right box and the wrong contents.
 *
 * A view with several feature surfaces has no feature.
 *
 * @example
 * ```tsx
 * <FeatureSurface as="article">
 *   <span class="strand-overline">Next ship</span>
 *   <h2 class="strand-title">Ship 042</h2>
 *   <p class="strand-text-secondary">Thursday, 6:30 PM ET</p>
 * </FeatureSurface>
 * ```
 */
export const FeatureSurface = forwardRef<HTMLDivElement, FeatureSurfaceProps>(
  ({ as = "div", className = "", children, ...rest }, ref) => {
    // Narrowed to one concrete tag for the type checker only. `as` is a
    // union, so no single ref type satisfies every branch, and typing the
    // ref as the union produces an intersection nothing can inhabit. The
    // runtime still renders whichever element was asked for; the cast
    // states that HTMLDivElement is the honest default for a consumer who
    // does not change `as`.
    const Tag = as as "div";
    const classes = ["strand-feature-surface", className].filter(Boolean).join(" ");
    // The ref is cast because the element type is chosen by a prop, so no
    // single ref type is correct for every branch. HTMLDivElement is the
    // honest default for a consumer who does not change `as`.
    return (
      <Tag ref={ref} class={classes} {...rest}>
        {children}
      </Tag>
    );
  },
);

FeatureSurface.displayName = "FeatureSurface";

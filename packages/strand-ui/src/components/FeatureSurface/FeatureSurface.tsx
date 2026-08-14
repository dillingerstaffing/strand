/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface FeatureSurfaceProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Render as a different element, e.g. "article" or "section". */
  as?: "div" | "article" | "section";
  /**
   * Inner padding. The same ladder Card ships. `none` also clips to the
   * surface's radius, so panes laid against the corners cannot square them
   * off — use it when the CHILDREN carry the inset, e.g. a two-pane card
   * whose divider runs the full height.
   */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
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
 *
 * @example
 * ```tsx
 * // A split card: the PANES carry the inset so the divider between them
 * // runs the full height of the surface. `padding="none"` also clips, so
 * // the right pane's wash cannot square off the rounded corners.
 * <FeatureSurface as="article" padding="none" class="my-split">
 *   <div class="my-split__lead">…</div>
 *   <div class="my-split__rail">…</div>
 * </FeatureSurface>
 * ```
 */
export const FeatureSurface = forwardRef<HTMLDivElement, FeatureSurfaceProps>(
  ({ as = "div", padding = "md", className = "", children, ...rest }, ref) => {
    // Narrowed to one concrete tag for the type checker only. `as` is a
    // union, so no single ref type satisfies every branch, and typing the
    // ref as the union produces an intersection nothing can inhabit. The
    // runtime still renders whichever element was asked for; the cast
    // states that HTMLDivElement is the honest default for a consumer who
    // does not change `as`.
    const Tag = as as "div";
    const classes = [
      "strand-feature-surface",
      `strand-feature-surface--pad-${padding}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");
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

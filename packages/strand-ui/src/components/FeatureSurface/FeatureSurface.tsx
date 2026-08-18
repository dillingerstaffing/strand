/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface FeatureSurfaceProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Element to render. */
  as?: "div" | "article" | "section";
  /** Inner padding; `none` also clips children to the radius. */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * The single emphasised dark surface of a view (DL 9.3); ordinary text primitives inside it retint themselves.
 *
 * @example
 * <FeatureSurface as="article"><h2 className="strand-title">Ship 042</h2></FeatureSurface>
 */
export const FeatureSurface = forwardRef<HTMLDivElement, FeatureSurfaceProps>(
  ({ as = "div", padding = "md", className = "", children, ...rest }, ref) => {
    const Tag = as as "div";
    return (
      <Tag ref={ref} className={cx("strand-feature-surface", `strand-feature-surface--pad-${padding}`, className)} {...rest}>
        {children}
      </Tag>
    );
  },
);
FeatureSurface.displayName = "FeatureSurface";

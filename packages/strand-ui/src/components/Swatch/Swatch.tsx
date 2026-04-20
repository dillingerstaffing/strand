/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface SwatchGridProps extends JSX.HTMLAttributes<HTMLDivElement> {}

/**
 * Grid container for a row of color swatches. Auto-fills with
 * 160px minimum tiles.
 */
export const SwatchGrid = forwardRef<HTMLDivElement, SwatchGridProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={["strand-swatch-grid", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  ),
);
SwatchGrid.displayName = "SwatchGrid";

export interface SwatchProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Design-token name, e.g. "blue-primary". Rendered in mono uppercase. */
  name: string;
  /** Hex value, e.g. "#3B8EF6". Rendered below the name. */
  hex: string;
  /** Background color applied inline (consumer-provided). */
  background: string;
  /** Text color applied inline (consumer-provided, tone-dependent). */
  color: string;
}

/**
 * Single color specimen with a background + text color applied
 * inline (tone-dependent, can be any CSS color) and name/hex
 * labels rendered inside.
 *
 * @example
 * ```tsx
 * <Swatch name="blue-primary" hex="#3B8EF6" background="#3B8EF6" color="#fff" />
 * ```
 */
export const Swatch = forwardRef<HTMLDivElement, SwatchProps>(
  ({ name, hex, background, color, className = "", style, ...rest }, ref) => (
    <div
      ref={ref}
      className={["strand-swatch", className].filter(Boolean).join(" ")}
      style={{
        background,
        color,
        ...(style as Record<string, string>),
      }}
      {...rest}
    >
      <span className="strand-swatch__name">{name}</span>
      <span className="strand-swatch__hex">{hex}</span>
    </div>
  ),
);
Swatch.displayName = "Swatch";

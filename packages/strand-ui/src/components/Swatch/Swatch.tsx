/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx, styled } from "../../internal/index.js";

/** Auto-filling grid of colour swatches. */
export const SwatchGrid = styled("div", "strand-swatch-grid", "SwatchGrid");
export type SwatchGridProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface SwatchProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Token name, e.g. "blue-primary". */
  name: string;
  /** Hex value, e.g. "#3B8EF6". */
  hex: string;
  /** Background colour. */
  background: string;
  /** Text colour. */
  color: string;
}

/** One colour specimen with its name and hex. */
export const Swatch = forwardRef<HTMLDivElement, SwatchProps>(
  ({ name, hex, background, color, className = "", style, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-swatch", className)}
      style={{ background, color, ...(style as Record<string, string>) }}
      {...rest}
    >
      <span className="strand-swatch__name">{name}</span>
      <span className="strand-swatch__hex">{hex}</span>
    </div>
  ),
);
Swatch.displayName = "Swatch";

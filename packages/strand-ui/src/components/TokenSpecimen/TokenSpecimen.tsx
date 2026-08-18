/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx, styled } from "../../internal/index.js";

/** Spacing, radius and shadow token specimens. */
export const TokenSpecimenGrid = styled("div", "strand-token-specimen-grid", "TokenSpecimenGrid");
export const TokenSpecimen = styled("div", "strand-token-specimen", "TokenSpecimen");

export type TokenSpecimenGridProps = JSX.HTMLAttributes<HTMLDivElement>;
export type TokenSpecimenProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface TokenSpecimenSpacerProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  /** Bar width, a CSS length or a pixel number. */
  width?: string | number;
}

/** A bar sized to a spacing token. */
export const TokenSpecimenSpacer = forwardRef<HTMLSpanElement, TokenSpecimenSpacerProps>(
  ({ width, style, className = "", ...rest }, ref) => {
    const w = typeof width === "number" ? `${width}px` : width;
    return (
      <span
        ref={ref}
        className={cx("strand-token-specimen__spacer", className)}
        style={{ ...(w ? { width: w } : {}), ...(style as Record<string, string>) }}
        {...rest}
      />
    );
  },
);
TokenSpecimenSpacer.displayName = "TokenSpecimenSpacer";

export interface TokenSpecimenBoxProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  /** Border radius, e.g. "8px". */
  radius?: string;
  /** Box shadow, for elevation specimens. */
  shadow?: string;
}

/** A box carrying a radius or elevation token. */
export const TokenSpecimenBox = forwardRef<HTMLSpanElement, TokenSpecimenBoxProps>(
  ({ radius, shadow, style, className = "", ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-token-specimen__box", className)}
      style={{
        ...(radius ? { borderRadius: radius } : {}),
        ...(shadow ? { boxShadow: shadow } : {}),
        ...(style as Record<string, string>),
      }}
      {...rest}
    />
  ),
);
TokenSpecimenBox.displayName = "TokenSpecimenBox";

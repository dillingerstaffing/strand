/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface TokenSpecimenGridProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

/** Grid container for spacing/radius/shadow token specimens. */
export const TokenSpecimenGrid = forwardRef<
  HTMLDivElement,
  TokenSpecimenGridProps
>(({ className = "", children, ...rest }, ref) => (
  <div
    ref={ref}
    className={["strand-token-specimen-grid", className]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </div>
));
TokenSpecimenGrid.displayName = "TokenSpecimenGrid";

export interface TokenSpecimenProps extends JSX.HTMLAttributes<HTMLDivElement> {}

/**
 * Spacing/radius/shadow token specimen. Contains a visual
 * (spacer bar via __spacer, or rounded/shadowed box via __box)
 * and a label + value. The visual's pixel width, border-radius,
 * or box-shadow is set inline per token by the consumer.
 */
export const TokenSpecimen = forwardRef<HTMLDivElement, TokenSpecimenProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={["strand-token-specimen", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  ),
);
TokenSpecimen.displayName = "TokenSpecimen";

export interface TokenSpecimenSpacerProps
  extends JSX.HTMLAttributes<HTMLSpanElement> {
  /** Inline width (e.g. "16px" or number in px). */
  width?: string | number;
}

/** Horizontal spacer bar specimen; width sized inline per token. */
export const TokenSpecimenSpacer = forwardRef<
  HTMLSpanElement,
  TokenSpecimenSpacerProps
>(({ width, style, className = "", ...rest }, ref) => {
  const w = typeof width === "number" ? `${width}px` : width;
  return (
    <span
      ref={ref}
      className={["strand-token-specimen__spacer", className]
        .filter(Boolean)
        .join(" ")}
      style={{ ...(w ? { width: w } : {}), ...(style as Record<string, string>) }}
      {...rest}
    />
  );
});
TokenSpecimenSpacer.displayName = "TokenSpecimenSpacer";

export interface TokenSpecimenBoxProps
  extends JSX.HTMLAttributes<HTMLSpanElement> {
  /** Inline border-radius (e.g. "8px"). */
  radius?: string;
  /** Inline box-shadow (used for elevation specimens). */
  shadow?: string;
}

/** 64x64 box specimen for radius + elevation specs. */
export const TokenSpecimenBox = forwardRef<
  HTMLSpanElement,
  TokenSpecimenBoxProps
>(({ radius, shadow, style, className = "", ...rest }, ref) => (
  <span
    ref={ref}
    className={["strand-token-specimen__box", className]
      .filter(Boolean)
      .join(" ")}
    style={{
      ...(radius ? { borderRadius: radius } : {}),
      ...(shadow ? { boxShadow: shadow } : {}),
      ...(style as Record<string, string>),
    }}
    {...rest}
  />
));
TokenSpecimenBox.displayName = "TokenSpecimenBox";

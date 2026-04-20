/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface ContainerScaleProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

/** Vertical stack of container-width visualizer rows. */
export const ContainerScale = forwardRef<HTMLDivElement, ContainerScaleProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={["strand-container-scale", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  ),
);
ContainerScale.displayName = "ContainerScale";

export interface ContainerScaleRowProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

export const ContainerScaleRow = forwardRef<
  HTMLDivElement,
  ContainerScaleRowProps
>(({ className = "", children, ...rest }, ref) => (
  <div
    ref={ref}
    className={["strand-container-scale__row", className]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </div>
));
ContainerScaleRow.displayName = "ContainerScaleRow";

export interface ContainerScaleLabelProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

export const ContainerScaleLabel = forwardRef<
  HTMLDivElement,
  ContainerScaleLabelProps
>(({ className = "", children, ...rest }, ref) => (
  <div
    ref={ref}
    className={["strand-container-scale__label", className]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </div>
));
ContainerScaleLabel.displayName = "ContainerScaleLabel";

export interface ContainerScaleCaptionProps
  extends JSX.HTMLAttributes<HTMLSpanElement> {}

export const ContainerScaleCaption = forwardRef<
  HTMLSpanElement,
  ContainerScaleCaptionProps
>(({ className = "", children, ...rest }, ref) => (
  <span
    ref={ref}
    className={["strand-container-scale__caption", className]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </span>
));
ContainerScaleCaption.displayName = "ContainerScaleCaption";

export interface ContainerScaleTrackProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

export const ContainerScaleTrack = forwardRef<
  HTMLDivElement,
  ContainerScaleTrackProps
>(({ className = "", children, ...rest }, ref) => (
  <div
    ref={ref}
    className={["strand-container-scale__track", className]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </div>
));
ContainerScaleTrack.displayName = "ContainerScaleTrack";

export interface ContainerScaleBarProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Inline width (e.g. "60%" or "640px"). */
  width?: string;
}

export const ContainerScaleBar = forwardRef<
  HTMLDivElement,
  ContainerScaleBarProps
>(({ width, style, className = "", children, ...rest }, ref) => (
  <div
    ref={ref}
    className={["strand-container-scale__bar", className]
      .filter(Boolean)
      .join(" ")}
    style={{ ...(width ? { width } : {}), ...(style as Record<string, string>) }}
    {...rest}
  >
    {children}
  </div>
));
ContainerScaleBar.displayName = "ContainerScaleBar";

export interface ContainerScalePxProps
  extends JSX.HTMLAttributes<HTMLSpanElement> {}

export const ContainerScalePx = forwardRef<
  HTMLSpanElement,
  ContainerScalePxProps
>(({ className = "", children, ...rest }, ref) => (
  <span
    ref={ref}
    className={["strand-container-scale__px", className]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </span>
));
ContainerScalePx.displayName = "ContainerScalePx";

export interface ContainerScaleAxisProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

export const ContainerScaleAxis = forwardRef<
  HTMLDivElement,
  ContainerScaleAxisProps
>(({ className = "", children, ...rest }, ref) => (
  <div
    ref={ref}
    className={["strand-container-scale__axis", className]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </div>
));
ContainerScaleAxis.displayName = "ContainerScaleAxis";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx, styled } from "../../internal/index.js";

/** Proportional bars visualising the container width tiers. */
export const ContainerScale = styled("div", "strand-container-scale", "ContainerScale");
export const ContainerScaleRow = styled("div", "strand-container-scale__row", "ContainerScaleRow");
export const ContainerScaleLabel = styled("div", "strand-container-scale__label", "ContainerScaleLabel");
export const ContainerScaleCaption = styled<HTMLSpanElement>("span", "strand-container-scale__caption", "ContainerScaleCaption");
export const ContainerScaleTrack = styled("div", "strand-container-scale__track", "ContainerScaleTrack");
export const ContainerScalePx = styled<HTMLSpanElement>("span", "strand-container-scale__px", "ContainerScalePx");
export const ContainerScaleAxis = styled("div", "strand-container-scale__axis", "ContainerScaleAxis");

export type ContainerScaleProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ContainerScaleRowProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ContainerScaleLabelProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ContainerScaleCaptionProps = JSX.HTMLAttributes<HTMLSpanElement>;
export type ContainerScaleTrackProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ContainerScalePxProps = JSX.HTMLAttributes<HTMLSpanElement>;
export type ContainerScaleAxisProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface ContainerScaleBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Bar width, e.g. "60%" or "640px". */
  width?: string;
}

/** A bar whose width is the tier it represents. */
export const ContainerScaleBar = forwardRef<HTMLDivElement, ContainerScaleBarProps>(
  ({ width, style, className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-container-scale__bar", className)}
      style={{ ...(width ? { width } : {}), ...(style as Record<string, string>) }}
      {...rest}
    >
      {children}
    </div>
  ),
);
ContainerScaleBar.displayName = "ContainerScaleBar";

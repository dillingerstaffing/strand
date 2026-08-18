/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx, styled } from "../../internal/index.js";

/** In-page window chrome that hosts a modal specimen without taking the viewport. */
export const LabFrame = styled("div", "strand-ref-frame", "LabFrame");
export const LabFrameChrome = styled("div", "strand-ref-frame__chrome", "LabFrameChrome");
export const LabFrameTitle = styled<HTMLSpanElement>("span", "strand-ref-frame__title", "LabFrameTitle");
export const LabFrameBody = styled("div", "strand-ref-frame__body", "LabFrameBody");
export const LabFrameContentHead = styled("div", "strand-ref-frame__content-head", "LabFrameContentHead");
export const LabFrameActions = styled("div", "strand-ref-frame__actions", "LabFrameActions");
export const LabFrameOverlay = styled("div", "strand-ref-frame__overlay", "LabFrameOverlay");
export const LabFramePanelHeader = styled("div", "strand-ref-frame__panel-header", "LabFramePanelHeader");
export const LabFramePanelTitle = styled<HTMLHeadingElement>("h2", "strand-ref-frame__panel-title", "LabFramePanelTitle");
export const LabFramePanelBody = styled("div", "strand-ref-frame__panel-body", "LabFramePanelBody");
export const LabFramePanelFooter = styled("div", "strand-ref-frame__panel-footer", "LabFramePanelFooter");

export interface LabFrameDotProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  /** Dot colour, e.g. "#ff5f57". */
  color?: string;
}

/** A window-chrome dot. */
export const LabFrameDot = forwardRef<HTMLSpanElement, LabFrameDotProps>(
  ({ color, className = "", style, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-frame__dot", className)}
      style={{ ...(color ? { background: color } : {}), ...(style as Record<string, string>) }}
      {...rest}
    />
  ),
);
LabFrameDot.displayName = "LabFrameDot";

export interface LabFrameContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Hide the content visually while it stays in layout. */
  hidden?: boolean;
}

/** The page content behind a modal specimen. */
export const LabFrameContent = forwardRef<HTMLDivElement, LabFrameContentProps>(
  ({ hidden = false, className = "", children, ...rest }, ref) => (
    <div ref={ref} className={cx("strand-ref-frame__content", className)} aria-hidden={hidden ? "true" : undefined} {...rest}>
      {children}
    </div>
  ),
);
LabFrameContent.displayName = "LabFrameContent";

/** The modal panel of a specimen. */
export const LabFramePanel = forwardRef<HTMLDivElement, JSX.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...rest }, ref) => (
    <div ref={ref} className={cx("strand-ref-frame__panel", className)} role="dialog" aria-modal="true" {...rest}>
      {children}
    </div>
  ),
);
LabFramePanel.displayName = "LabFramePanel";

export interface LabFramePanelCloseProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  /** Accessible name. */
  "aria-label"?: string;
}

/** The panel's close control. */
export const LabFramePanelClose = forwardRef<HTMLButtonElement, LabFramePanelCloseProps>(
  ({ className = "", children, "aria-label": ariaLabel = "Close", ...rest }, ref) => (
    <button ref={ref} type="button" className={cx("strand-ref-frame__panel-close", className)} aria-label={ariaLabel} {...rest}>
      {children ?? "×"}
    </button>
  ),
);
LabFramePanelClose.displayName = "LabFramePanelClose";

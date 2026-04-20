/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

/**
 * LabFrame family: fake in-page window chrome that hosts a
 * dialog-style demo without taking over the real page viewport.
 * Use this to render modal specimens on a docs page.
 */

type DivProps = JSX.HTMLAttributes<HTMLDivElement>;
type SpanProps = JSX.HTMLAttributes<HTMLSpanElement>;
type ButtonProps = JSX.HTMLAttributes<HTMLButtonElement>;
type HeadingProps = JSX.HTMLAttributes<HTMLHeadingElement>;

function cx(
  ...p: Array<string | false | undefined | null | unknown>
): string {
  return p
    .filter((x): x is string => typeof x === "string" && x.length > 0)
    .join(" ");
}

export const LabFrame = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div ref={ref} className={cx("strand-ref-frame", className)} {...rest}>
      {children}
    </div>
  ),
);
LabFrame.displayName = "LabFrame";

export const LabFrameChrome = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-frame__chrome", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabFrameChrome.displayName = "LabFrameChrome";

export interface LabFrameDotProps extends SpanProps {
  /** Dot color applied inline (e.g. "#ff5f57" for macOS red). */
  color?: string;
}

export const LabFrameDot = forwardRef<HTMLSpanElement, LabFrameDotProps>(
  ({ color, className = "", style, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-frame__dot", className)}
      style={{
        ...(color ? { background: color } : {}),
        ...(style as Record<string, string>),
      }}
      {...rest}
    />
  ),
);
LabFrameDot.displayName = "LabFrameDot";

export const LabFrameTitle = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-frame__title", className)}
      {...rest}
    >
      {children}
    </span>
  ),
);
LabFrameTitle.displayName = "LabFrameTitle";

export const LabFrameBody = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-frame__body", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabFrameBody.displayName = "LabFrameBody";

export interface LabFrameContentProps extends DivProps {
  /** Hide content visually (blur + fade) while still in layout. */
  hidden?: boolean;
}

export const LabFrameContent = forwardRef<HTMLDivElement, LabFrameContentProps>(
  ({ hidden = false, className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-frame__content", className)}
      aria-hidden={hidden ? "true" : undefined}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabFrameContent.displayName = "LabFrameContent";

export const LabFrameContentHead = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-frame__content-head", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabFrameContentHead.displayName = "LabFrameContentHead";

export const LabFrameActions = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-frame__actions", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabFrameActions.displayName = "LabFrameActions";

export const LabFrameOverlay = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-frame__overlay", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabFrameOverlay.displayName = "LabFrameOverlay";

export const LabFramePanel = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-frame__panel", className)}
      role="dialog"
      aria-modal="true"
      {...rest}
    >
      {children}
    </div>
  ),
);
LabFramePanel.displayName = "LabFramePanel";

export const LabFramePanelHeader = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-frame__panel-header", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabFramePanelHeader.displayName = "LabFramePanelHeader";

export const LabFramePanelTitle = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className = "", children, ...rest }, ref) => (
    <h2
      ref={ref}
      className={cx("strand-ref-frame__panel-title", className)}
      {...rest}
    >
      {children}
    </h2>
  ),
);
LabFramePanelTitle.displayName = "LabFramePanelTitle";

export interface LabFramePanelCloseProps extends ButtonProps {
  /** Accessible label (e.g. "Close dialog"). */
  "aria-label"?: string;
}

export const LabFramePanelClose = forwardRef<
  HTMLButtonElement,
  LabFramePanelCloseProps
>(
  (
    { className = "", children, "aria-label": ariaLabel = "Close", ...rest },
    ref,
  ) => (
    <button
      ref={ref}
      type="button"
      className={cx("strand-ref-frame__panel-close", className)}
      aria-label={ariaLabel}
      {...rest}
    >
      {children ?? "×"}
    </button>
  ),
);
LabFramePanelClose.displayName = "LabFramePanelClose";

export const LabFramePanelBody = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-frame__panel-body", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabFramePanelBody.displayName = "LabFramePanelBody";

export const LabFramePanelFooter = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-frame__panel-footer", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabFramePanelFooter.displayName = "LabFramePanelFooter";

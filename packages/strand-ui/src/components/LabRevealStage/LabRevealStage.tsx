/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface LabRevealStageProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

export const LabRevealStage = forwardRef<HTMLDivElement, LabRevealStageProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={["strand-ref-reveal-stage", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabRevealStage.displayName = "LabRevealStage";

export interface LabRevealLineProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

export const LabRevealLine = forwardRef<HTMLDivElement, LabRevealLineProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={["strand-ref-reveal-line", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabRevealLine.displayName = "LabRevealLine";

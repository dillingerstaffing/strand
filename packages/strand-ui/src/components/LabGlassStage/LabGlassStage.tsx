/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface LabGlassStageProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

export const LabGlassStage = forwardRef<HTMLDivElement, LabGlassStageProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={["strand-ref-glass-stage", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabGlassStage.displayName = "LabGlassStage";

export interface LabGlassPanelProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

export const LabGlassPanel = forwardRef<HTMLDivElement, LabGlassPanelProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={["strand-ref-glass-panel", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabGlassPanel.displayName = "LabGlassPanel";

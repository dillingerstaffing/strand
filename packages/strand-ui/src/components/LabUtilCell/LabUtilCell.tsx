/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface LabUtilRowProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export const LabUtilRow = forwardRef<HTMLDivElement, LabUtilRowProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={["strand-ref-util-row", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabUtilRow.displayName = "LabUtilRow";

export interface LabUtilCellProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export const LabUtilCell = forwardRef<HTMLDivElement, LabUtilCellProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={["strand-ref-util-cell", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabUtilCell.displayName = "LabUtilCell";

export interface LabUtilCellCodeProps
  extends JSX.HTMLAttributes<HTMLSpanElement> {}

export const LabUtilCellCode = forwardRef<HTMLSpanElement, LabUtilCellCodeProps>(
  ({ className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={["strand-ref-util-cell__code", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </span>
  ),
);
LabUtilCellCode.displayName = "LabUtilCellCode";

export interface LabUtilCellCaptionProps
  extends JSX.HTMLAttributes<HTMLSpanElement> {}

export const LabUtilCellCaption = forwardRef<
  HTMLSpanElement,
  LabUtilCellCaptionProps
>(({ className = "", children, ...rest }, ref) => (
  <span
    ref={ref}
    className={["strand-ref-util-cell__caption", className]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </span>
));
LabUtilCellCaption.displayName = "LabUtilCellCaption";

export interface LabUtilCellDemoProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

export const LabUtilCellDemo = forwardRef<HTMLDivElement, LabUtilCellDemoProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={["strand-ref-util-cell__demo", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabUtilCellDemo.displayName = "LabUtilCellDemo";

export interface LabUtilCellBlockProps
  extends JSX.HTMLAttributes<HTMLSpanElement> {}

export const LabUtilCellBlock = forwardRef<
  HTMLSpanElement,
  LabUtilCellBlockProps
>(({ className = "", children, ...rest }, ref) => (
  <span
    ref={ref}
    className={["strand-ref-util-cell__block", className]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </span>
));
LabUtilCellBlock.displayName = "LabUtilCellBlock";

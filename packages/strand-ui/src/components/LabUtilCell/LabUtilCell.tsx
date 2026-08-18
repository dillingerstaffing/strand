/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { styled } from "../../internal/index.js";

/** A row of utility specimens, each a cell with code, caption and demo. */
export const LabUtilRow = styled("div", "strand-ref-util-row", "LabUtilRow");
export const LabUtilCell = styled("div", "strand-ref-util-cell", "LabUtilCell");
export const LabUtilCellCode = styled<HTMLSpanElement>("span", "strand-ref-util-cell__code", "LabUtilCellCode");
export const LabUtilCellCaption = styled<HTMLSpanElement>("span", "strand-ref-util-cell__caption", "LabUtilCellCaption");
export const LabUtilCellDemo = styled("div", "strand-ref-util-cell__demo", "LabUtilCellDemo");
export const LabUtilCellBlock = styled<HTMLSpanElement>("span", "strand-ref-util-cell__block", "LabUtilCellBlock");

export type LabUtilRowProps = JSX.HTMLAttributes<HTMLDivElement>;
export type LabUtilCellProps = JSX.HTMLAttributes<HTMLDivElement>;
export type LabUtilCellCodeProps = JSX.HTMLAttributes<HTMLSpanElement>;
export type LabUtilCellCaptionProps = JSX.HTMLAttributes<HTMLSpanElement>;
export type LabUtilCellDemoProps = JSX.HTMLAttributes<HTMLDivElement>;
export type LabUtilCellBlockProps = JSX.HTMLAttributes<HTMLSpanElement>;

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { styled } from "../../internal/index.js";

/** A stage of lines that reveal in sequence. */
export const LabRevealStage = styled("div", "strand-ref-reveal-stage", "LabRevealStage");
export const LabRevealLine = styled("div", "strand-ref-reveal-line", "LabRevealLine");

export type LabRevealStageProps = JSX.HTMLAttributes<HTMLDivElement>;
export type LabRevealLineProps = JSX.HTMLAttributes<HTMLDivElement>;

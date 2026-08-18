/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { styled } from "../../internal/index.js";

/** A dark stage with a glass panel on it. */
export const LabGlassStage = styled("div", "strand-ref-glass-stage", "LabGlassStage");
export const LabGlassPanel = styled("div", "strand-ref-glass-panel", "LabGlassPanel");

export type LabGlassStageProps = JSX.HTMLAttributes<HTMLDivElement>;
export type LabGlassPanelProps = JSX.HTMLAttributes<HTMLDivElement>;

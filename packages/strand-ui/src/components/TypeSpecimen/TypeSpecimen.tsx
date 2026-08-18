/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { styled } from "../../internal/index.js";

/** A display line over a mono meta row. */
export const TypeSpecimen = styled("div", "strand-type-specimen", "TypeSpecimen");
export const TypeSpecimenMeta = styled<HTMLSpanElement>("span", "strand-type-specimen__meta", "TypeSpecimenMeta");

export type TypeSpecimenProps = JSX.HTMLAttributes<HTMLDivElement>;
export type TypeSpecimenMetaProps = JSX.HTMLAttributes<HTMLSpanElement>;

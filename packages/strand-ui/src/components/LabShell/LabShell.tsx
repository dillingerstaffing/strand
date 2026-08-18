/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx, styled } from "../../internal/index.js";

/** Reference-page chrome: a sidebar and main grid with the blocks that fill it. */
export const LabShell = styled("div", "strand-ref-shell", "LabShell");
export const LabSidebar = styled<HTMLElement>("aside", "strand-ref-shell__sidebar", "LabSidebar");
export const LabSidebarHead = styled("div", "strand-ref-shell__sidebar-head", "LabSidebarHead");
export const LabSidebarScroll = styled("div", "strand-ref-shell__sidebar-scroll", "LabSidebarScroll");
export const LabBrand = styled("div", "strand-ref-shell__brand", "LabBrand");
export const LabBrandMark = styled("div", "strand-ref-shell__brand-mark", "LabBrandMark");
export const LabBrandTitle = styled<HTMLSpanElement>("span", "strand-ref-shell__brand-title", "LabBrandTitle");
export const LabBrandSub = styled<HTMLSpanElement>("span", "strand-ref-shell__brand-sub", "LabBrandSub");
export const LabSidebarGroup = styled("div", "strand-ref-shell__group", "LabSidebarGroup");
export const LabSidebarGroupLabel = styled<HTMLSpanElement>("span", "strand-ref-shell__group-label", "LabSidebarGroupLabel");
export const LabSidebarGroupList = styled<HTMLElement>("nav", "strand-ref-shell__group-list", "LabSidebarGroupList");
export const LabSidebarGroupDot = styled<HTMLSpanElement>("span", "strand-ref-shell__group-dot", "LabSidebarGroupDot");
export const LabMain = styled<HTMLElement>("main", "strand-ref-shell__main", "LabMain");
export const LabHeader = styled<HTMLElement>("header", "strand-ref-header", "LabHeader");
export const LabHeaderTitle = styled<HTMLHeadingElement>("h1", "strand-ref-header__title", "LabHeaderTitle");
export const LabHeaderLead = styled<HTMLParagraphElement>("p", "strand-ref-header__lead", "LabHeaderLead");
export const LabHeaderMeta = styled("div", "strand-ref-header__meta", "LabHeaderMeta");
export const LabHeaderMetaItem = styled("div", "strand-ref-header__meta-item", "LabHeaderMetaItem");
export const LabHeaderMetaLabel = styled<HTMLSpanElement>("span", "strand-ref-header__meta-label", "LabHeaderMetaLabel");
export const LabHeaderMetaValue = styled<HTMLSpanElement>("span", "strand-ref-header__meta-value", "LabHeaderMetaValue");
export const LabTaxonomy = styled("div", "strand-ref-taxonomy", "LabTaxonomy");
export const LabTaxonomyTitle = styled<HTMLSpanElement>("span", "strand-ref-taxonomy__title", "LabTaxonomyTitle");
export const LabTaxonomyList = styled<HTMLDListElement>("dl", "strand-ref-taxonomy__list", "LabTaxonomyList");
export const LabSection = styled<HTMLElement>("section", "strand-ref-section", "LabSection");
export const LabSectionHead = styled("div", "strand-ref-section__head", "LabSectionHead");
export const LabSectionHeadNote = styled<HTMLSpanElement>("span", "strand-ref-section__head-note", "LabSectionHeadNote");
export const LabSectionBody = styled("div", "strand-ref-section__body", "LabSectionBody");
export const LabExample = styled("div", "strand-ref-example", "LabExample");
export const LabExampleMeta = styled("div", "strand-ref-example__meta", "LabExampleMeta");
export const LabExampleLabel = styled<HTMLSpanElement>("span", "strand-ref-example__label", "LabExampleLabel");
export const LabExampleCode = styled<HTMLSpanElement>("span", "strand-ref-example__code", "LabExampleCode");
export const LabExampleCaption = styled<HTMLParagraphElement>("p", "strand-ref-example__caption", "LabExampleCaption");

export type LabTaxonomyListProps = JSX.HTMLAttributes<HTMLDListElement>;

export interface LabSidebarGroupLinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  /** Section anchor, e.g. "#typography". */
  href?: string;
}

/** A sidebar link with its group dot. */
export const LabSidebarGroupLink = forwardRef<HTMLAnchorElement, LabSidebarGroupLinkProps>(
  ({ className = "", children, ...rest }, ref) => (
    <a ref={ref} className={cx("strand-ref-shell__group-link", className)} {...rest}>
      <span className="strand-ref-shell__group-dot" />
      {children}
    </a>
  ),
);
LabSidebarGroupLink.displayName = "LabSidebarGroupLink";

export interface LabExampleDemoProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Drop the demo's inset. */
  padNone?: boolean;
  /** Recessed surface instead of white. */
  recessed?: boolean;
}

/** The demo panel of an example. */
export const LabExampleDemo = forwardRef<HTMLDivElement, LabExampleDemoProps>(
  ({ padNone = false, recessed = false, className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx(
        "strand-ref-example__demo",
        padNone && "strand-ref-example__demo--pad-none",
        recessed && "strand-ref-example__demo--recessed",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabExampleDemo.displayName = "LabExampleDemo";

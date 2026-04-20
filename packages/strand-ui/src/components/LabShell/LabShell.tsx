/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";

/**
 * LabShell + family: thin container primitives for a
 * component-reference page layout. CSS does 100% of the visual
 * work; these wrappers only emit the correct class + preserve
 * prop/ref forwarding.
 */

type DivProps = JSX.HTMLAttributes<HTMLDivElement>;
type SpanProps = JSX.HTMLAttributes<HTMLSpanElement>;
type ParagraphProps = JSX.HTMLAttributes<HTMLParagraphElement>;
type HeadingProps = JSX.HTMLAttributes<HTMLHeadingElement>;
type AnchorProps = JSX.HTMLAttributes<HTMLAnchorElement>;

function cx(
  ...parts: Array<string | false | undefined | null | unknown>
): string {
  return parts
    .filter((p): p is string => typeof p === "string" && p.length > 0)
    .join(" ");
}

// ── Shell root + sidebar family ────────────────────────────────

export const LabShell = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div ref={ref} className={cx("strand-ref-shell", className)} {...rest}>
      {children}
    </div>
  ),
);
LabShell.displayName = "LabShell";

type AsideProps = Omit<JSX.HTMLAttributes<HTMLElement>, "ref">;

export const LabSidebar = forwardRef<HTMLElement, AsideProps>(
  ({ className = "", children, ...rest }, ref) => (
    <aside
      ref={ref}
      className={cx("strand-ref-shell__sidebar", className)}
      {...rest}
    >
      {children}
    </aside>
  ),
);
LabSidebar.displayName = "LabSidebar";

export const LabSidebarHead = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-shell__sidebar-head", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabSidebarHead.displayName = "LabSidebarHead";

export const LabSidebarScroll = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-shell__sidebar-scroll", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabSidebarScroll.displayName = "LabSidebarScroll";

export const LabBrand = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-shell__brand", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabBrand.displayName = "LabBrand";

export const LabBrandMark = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-shell__brand-mark", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabBrandMark.displayName = "LabBrandMark";

export const LabBrandTitle = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-shell__brand-title", className)}
      {...rest}
    >
      {children}
    </span>
  ),
);
LabBrandTitle.displayName = "LabBrandTitle";

export const LabBrandSub = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-shell__brand-sub", className)}
      {...rest}
    >
      {children}
    </span>
  ),
);
LabBrandSub.displayName = "LabBrandSub";

export const LabSidebarGroup = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-shell__group", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabSidebarGroup.displayName = "LabSidebarGroup";

export const LabSidebarGroupLabel = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-shell__group-label", className)}
      {...rest}
    >
      {children}
    </span>
  ),
);
LabSidebarGroupLabel.displayName = "LabSidebarGroupLabel";

export const LabSidebarGroupList = forwardRef<HTMLElement, AsideProps>(
  ({ className = "", children, ...rest }, ref) => (
    <nav
      ref={ref}
      className={cx("strand-ref-shell__group-list", className)}
      {...rest}
    >
      {children}
    </nav>
  ),
);
LabSidebarGroupList.displayName = "LabSidebarGroupList";

export interface LabSidebarGroupLinkProps extends AnchorProps {
  /** Section anchor href, e.g. "#typography". */
  href?: string;
}

export const LabSidebarGroupLink = forwardRef<
  HTMLAnchorElement,
  LabSidebarGroupLinkProps
>(({ className = "", children, ...rest }, ref) => (
  <a
    ref={ref}
    className={cx("strand-ref-shell__group-link", className)}
    {...rest}
  >
    <span className="strand-ref-shell__group-dot" />
    {children}
  </a>
));
LabSidebarGroupLink.displayName = "LabSidebarGroupLink";

export const LabSidebarGroupDot = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-shell__group-dot", className)}
      {...rest}
    >
      {children}
    </span>
  ),
);
LabSidebarGroupDot.displayName = "LabSidebarGroupDot";

export const LabMain = forwardRef<HTMLElement, AsideProps>(
  ({ className = "", children, ...rest }, ref) => (
    <main
      ref={ref}
      className={cx("strand-ref-shell__main", className)}
      {...rest}
    >
      {children}
    </main>
  ),
);
LabMain.displayName = "LabMain";

// ── Header ─────────────────────────────────────────────────────

export const LabHeader = forwardRef<HTMLElement, AsideProps>(
  ({ className = "", children, ...rest }, ref) => (
    <header
      ref={ref}
      className={cx("strand-ref-header", className)}
      {...rest}
    >
      {children}
    </header>
  ),
);
LabHeader.displayName = "LabHeader";

export const LabHeaderTitle = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className = "", children, ...rest }, ref) => (
    <h1
      ref={ref}
      className={cx("strand-ref-header__title", className)}
      {...rest}
    >
      {children}
    </h1>
  ),
);
LabHeaderTitle.displayName = "LabHeaderTitle";

export const LabHeaderLead = forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className = "", children, ...rest }, ref) => (
    <p
      ref={ref}
      className={cx("strand-ref-header__lead", className)}
      {...rest}
    >
      {children}
    </p>
  ),
);
LabHeaderLead.displayName = "LabHeaderLead";

export const LabHeaderMeta = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-header__meta", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabHeaderMeta.displayName = "LabHeaderMeta";

export const LabHeaderMetaItem = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-header__meta-item", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabHeaderMetaItem.displayName = "LabHeaderMetaItem";

export const LabHeaderMetaLabel = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-header__meta-label", className)}
      {...rest}
    >
      {children}
    </span>
  ),
);
LabHeaderMetaLabel.displayName = "LabHeaderMetaLabel";

export const LabHeaderMetaValue = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-header__meta-value", className)}
      {...rest}
    >
      {children}
    </span>
  ),
);
LabHeaderMetaValue.displayName = "LabHeaderMetaValue";

// ── Taxonomy ───────────────────────────────────────────────────

export const LabTaxonomy = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div ref={ref} className={cx("strand-ref-taxonomy", className)} {...rest}>
      {children}
    </div>
  ),
);
LabTaxonomy.displayName = "LabTaxonomy";

export const LabTaxonomyTitle = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-taxonomy__title", className)}
      {...rest}
    >
      {children}
    </span>
  ),
);
LabTaxonomyTitle.displayName = "LabTaxonomyTitle";

export type LabTaxonomyListProps = JSX.HTMLAttributes<HTMLDListElement>;

export const LabTaxonomyList = forwardRef<
  HTMLDListElement,
  LabTaxonomyListProps
>(({ className = "", children, ...rest }, ref) => (
  <dl
    ref={ref}
    className={cx("strand-ref-taxonomy__list", className)}
    {...rest}
  >
    {children}
  </dl>
));
LabTaxonomyList.displayName = "LabTaxonomyList";

// ── Section ────────────────────────────────────────────────────

export const LabSection = forwardRef<HTMLElement, AsideProps>(
  ({ className = "", children, ...rest }, ref) => (
    <section
      ref={ref}
      className={cx("strand-ref-section", className)}
      {...rest}
    >
      {children}
    </section>
  ),
);
LabSection.displayName = "LabSection";

export const LabSectionHead = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-section__head", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabSectionHead.displayName = "LabSectionHead";

export const LabSectionHeadNote = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-section__head-note", className)}
      {...rest}
    >
      {children}
    </span>
  ),
);
LabSectionHeadNote.displayName = "LabSectionHeadNote";

export const LabSectionBody = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-section__body", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabSectionBody.displayName = "LabSectionBody";

// ── Example ────────────────────────────────────────────────────

export const LabExample = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div ref={ref} className={cx("strand-ref-example", className)} {...rest}>
      {children}
    </div>
  ),
);
LabExample.displayName = "LabExample";

export const LabExampleMeta = forwardRef<HTMLDivElement, DivProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx("strand-ref-example__meta", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
LabExampleMeta.displayName = "LabExampleMeta";

export const LabExampleLabel = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-example__label", className)}
      {...rest}
    >
      {children}
    </span>
  ),
);
LabExampleLabel.displayName = "LabExampleLabel";

export const LabExampleCode = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx("strand-ref-example__code", className)}
      {...rest}
    >
      {children}
    </span>
  ),
);
LabExampleCode.displayName = "LabExampleCode";

export interface LabExampleDemoProps extends DivProps {
  /** Omit all internal padding and hide overflow. */
  padNone?: boolean;
  /** Use the recessed surface background instead of white. */
  recessed?: boolean;
}

export const LabExampleDemo = forwardRef<HTMLDivElement, LabExampleDemoProps>(
  (
    { padNone = false, recessed = false, className = "", children, ...rest },
    ref,
  ) => (
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

export const LabExampleCaption = forwardRef<
  HTMLParagraphElement,
  ParagraphProps
>(({ className = "", children, ...rest }, ref) => (
  <p
    ref={ref}
    className={cx("strand-ref-example__caption", className)}
    {...rest}
  >
    {children}
  </p>
));
LabExampleCaption.displayName = "LabExampleCaption";

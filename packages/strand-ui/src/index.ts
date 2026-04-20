/*! Strand UI v0.2.0 | MIT License | dillingerstaffing.com */

// Input components
export { Button } from "./components/Button/index.js";
export type { ButtonProps } from "./components/Button/index.js";

export { Input } from "./components/Input/index.js";
export type { InputProps } from "./components/Input/index.js";

export { Textarea } from "./components/Textarea/index.js";
export type { TextareaProps } from "./components/Textarea/index.js";

export { Select } from "./components/Select/index.js";
export type { SelectProps, SelectOption } from "./components/Select/index.js";

export { Checkbox } from "./components/Checkbox/index.js";
export type { CheckboxProps } from "./components/Checkbox/index.js";

export { Radio } from "./components/Radio/index.js";
export type { RadioProps } from "./components/Radio/index.js";

export { Switch } from "./components/Switch/index.js";
export type { SwitchProps } from "./components/Switch/index.js";

export { Slider } from "./components/Slider/index.js";
export type { SliderProps } from "./components/Slider/index.js";

export { FormField } from "./components/FormField/index.js";
export type { FormFieldProps } from "./components/FormField/index.js";

// Display components
export { Card } from "./components/Card/index.js";
export type { CardProps } from "./components/Card/index.js";

export { Badge } from "./components/Badge/index.js";
export type { BadgeProps } from "./components/Badge/index.js";

export { Avatar } from "./components/Avatar/index.js";
export type { AvatarProps } from "./components/Avatar/index.js";

export { Tag } from "./components/Tag/index.js";
export type { TagProps } from "./components/Tag/index.js";

export { Table } from "./components/Table/index.js";
export type { TableProps, TableColumn } from "./components/Table/index.js";

export { DataReadout } from "./components/DataReadout/index.js";
export type { DataReadoutProps } from "./components/DataReadout/index.js";

export { CodeBlock } from "./components/CodeBlock/index.js";
export type { CodeBlockProps } from "./components/CodeBlock/index.js";

// Layout components
export { Stack } from "./components/Stack/index.js";
export type { StackProps } from "./components/Stack/index.js";

export { Grid } from "./components/Grid/index.js";
export type { GridProps } from "./components/Grid/index.js";

export { Container } from "./components/Container/index.js";
export type { ContainerProps } from "./components/Container/index.js";

export { Divider } from "./components/Divider/index.js";
export type { DividerProps } from "./components/Divider/index.js";

export { Section } from "./components/Section/index.js";
export type { SectionProps } from "./components/Section/index.js";

// Navigation components
export { Link } from "./components/Link/index.js";
export type { LinkProps } from "./components/Link/index.js";

export { Tabs } from "./components/Tabs/index.js";
export type { TabsProps, TabItem } from "./components/Tabs/index.js";

export { Breadcrumb } from "./components/Breadcrumb/index.js";
export type { BreadcrumbProps, BreadcrumbItem } from "./components/Breadcrumb/index.js";

export { Nav } from "./components/Nav/index.js";
export type { NavProps } from "./components/Nav/index.js";

// Feedback components
export { Toast, ToastProvider, useToast } from "./components/Toast/index.js";
export type { ToastProps } from "./components/Toast/index.js";

export { Alert } from "./components/Alert/index.js";
export type { AlertProps } from "./components/Alert/index.js";

export { Dialog } from "./components/Dialog/index.js";
export type { DialogProps } from "./components/Dialog/index.js";

export { Tooltip } from "./components/Tooltip/index.js";
export type { TooltipProps } from "./components/Tooltip/index.js";

export { Progress } from "./components/Progress/index.js";
export type { ProgressProps } from "./components/Progress/index.js";

export { Spinner } from "./components/Spinner/index.js";
export type { SpinnerProps } from "./components/Spinner/index.js";

export { Skeleton } from "./components/Skeleton/index.js";
export type { SkeletonProps } from "./components/Skeleton/index.js";

export { StarRating } from "./components/StarRating/index.js";
export type { StarRatingProps, StarRatingSize } from "./components/StarRating/index.js";

// Surfaces
export { InstrumentViewport } from "./components/InstrumentViewport/index.js";
export type { InstrumentViewportProps } from "./components/InstrumentViewport/index.js";

// Animation
export { ScrollReveal } from "./components/ScrollReveal/index.js";
export type { ScrollRevealProps } from "./components/ScrollReveal/index.js";

// ── Composition helpers ─────────────────────────────────────────

export { CardSection } from "./components/CardSection/index.js";
export type { CardSectionProps } from "./components/CardSection/index.js";

export { KvEditorial } from "./components/KvEditorial/index.js";
export type { KvEditorialProps } from "./components/KvEditorial/index.js";

// ── Component-reference page chrome (strand-ref-* family) ──────
// Used by docs sites and consumer labs to render a component-reference
// page layout. All visual work is done in CSS; wrappers forward
// props/ref only. See HTML_REFERENCE.md for composition recipes.

export {
  LabShell,
  LabSidebar,
  LabSidebarHead,
  LabSidebarScroll,
  LabBrand,
  LabBrandMark,
  LabBrandTitle,
  LabBrandSub,
  LabSidebarGroup,
  LabSidebarGroupLabel,
  LabSidebarGroupList,
  LabSidebarGroupLink,
  LabSidebarGroupDot,
  LabMain,
  LabHeader,
  LabHeaderTitle,
  LabHeaderLead,
  LabHeaderMeta,
  LabHeaderMetaItem,
  LabHeaderMetaLabel,
  LabHeaderMetaValue,
  LabTaxonomy,
  LabTaxonomyTitle,
  LabTaxonomyList,
  LabSection,
  LabSectionHead,
  LabSectionHeadNote,
  LabSectionBody,
  LabExample,
  LabExampleMeta,
  LabExampleLabel,
  LabExampleCode,
  LabExampleDemo,
  LabExampleCaption,
} from "./components/LabShell/index.js";
export type {
  LabSidebarGroupLinkProps,
  LabTaxonomyListProps,
  LabExampleDemoProps,
} from "./components/LabShell/index.js";

export {
  LabFrame,
  LabFrameChrome,
  LabFrameDot,
  LabFrameTitle,
  LabFrameBody,
  LabFrameContent,
  LabFrameContentHead,
  LabFrameActions,
  LabFrameOverlay,
  LabFramePanel,
  LabFramePanelHeader,
  LabFramePanelTitle,
  LabFramePanelClose,
  LabFramePanelBody,
  LabFramePanelFooter,
} from "./components/LabFrame/index.js";
export type {
  LabFrameDotProps,
  LabFrameContentProps,
  LabFramePanelCloseProps,
} from "./components/LabFrame/index.js";

export {
  LabGlassStage,
  LabGlassPanel,
} from "./components/LabGlassStage/index.js";
export type {
  LabGlassStageProps,
  LabGlassPanelProps,
} from "./components/LabGlassStage/index.js";

export {
  LabRevealStage,
  LabRevealLine,
} from "./components/LabRevealStage/index.js";
export type {
  LabRevealStageProps,
  LabRevealLineProps,
} from "./components/LabRevealStage/index.js";

export { LabTip, LabTipBubble } from "./components/LabTip/index.js";
export type {
  LabTipProps,
  LabTipBubbleProps,
  LabTipBubblePlacement,
} from "./components/LabTip/index.js";

export {
  LabUtilRow,
  LabUtilCell,
  LabUtilCellCode,
  LabUtilCellCaption,
  LabUtilCellDemo,
  LabUtilCellBlock,
} from "./components/LabUtilCell/index.js";
export type {
  LabUtilRowProps,
  LabUtilCellProps,
  LabUtilCellCodeProps,
  LabUtilCellCaptionProps,
  LabUtilCellDemoProps,
  LabUtilCellBlockProps,
} from "./components/LabUtilCell/index.js";

// ── Spec-visualizer primitives ─────────────────────────────────

export { Swatch, SwatchGrid } from "./components/Swatch/index.js";
export type { SwatchProps, SwatchGridProps } from "./components/Swatch/index.js";

export {
  TypeSpecimen,
  TypeSpecimenMeta,
} from "./components/TypeSpecimen/index.js";
export type {
  TypeSpecimenProps,
  TypeSpecimenMetaProps,
} from "./components/TypeSpecimen/index.js";

export {
  TokenSpecimen,
  TokenSpecimenGrid,
  TokenSpecimenSpacer,
  TokenSpecimenBox,
} from "./components/TokenSpecimen/index.js";
export type {
  TokenSpecimenProps,
  TokenSpecimenGridProps,
  TokenSpecimenSpacerProps,
  TokenSpecimenBoxProps,
} from "./components/TokenSpecimen/index.js";

export {
  ContainerScale,
  ContainerScaleRow,
  ContainerScaleLabel,
  ContainerScaleCaption,
  ContainerScaleTrack,
  ContainerScaleBar,
  ContainerScalePx,
  ContainerScaleAxis,
} from "./components/ContainerScale/index.js";
export type {
  ContainerScaleProps,
  ContainerScaleRowProps,
  ContainerScaleLabelProps,
  ContainerScaleCaptionProps,
  ContainerScaleTrackProps,
  ContainerScaleBarProps,
  ContainerScalePxProps,
  ContainerScaleAxisProps,
} from "./components/ContainerScale/index.js";

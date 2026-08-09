/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface StackProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Flex direction */
  direction?: "vertical" | "horizontal";
  /** Gap between items, maps to --strand-space-{n} */
  gap?: number;
  /** Cross-axis alignment */
  align?: "start" | "center" | "end" | "stretch";
  /** Main-axis alignment */
  justify?: "start" | "center" | "end" | "between" | "around";
  /** Enable flex-wrap */
  wrap?: boolean;
  /** Semantic element to render (e.g. "ul", "header"). Defaults to "div". */
  as?: keyof JSX.IntrinsicElements;
}

const ALIGN_MAP: Record<string, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

const JUSTIFY_MAP: Record<string, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
};

/**
 * Flexbox layout container for arranging children with consistent spacing.
 *
 * @example
 * ```tsx
 * import { Stack, Button } from '@dillingerstaffing/strand-ui';
 *
 * <Stack direction="horizontal" gap={4} align="center">
 *   <Button variant="primary">Save</Button>
 *   <Button variant="secondary">Cancel</Button>
 * </Stack>
 * ```
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = "vertical",
      gap = 4,
      align = "stretch",
      wrap = false,
      justify,
      as = "div",
      className = "",
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    // biome-ignore lint/suspicious/noExplicitAny: polymorphic tag boundary
    const Tag = as as any;
    const classes = [
      "strand-stack",
      `strand-stack--${direction}`,
      `strand-stack--gap-${gap}`,
      align !== "stretch" && `strand-stack--align-${align}`,
      justify && `strand-stack--justify-${justify}`,
      wrap && "strand-stack--wrap",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Gap is emitted as the canonical `strand-stack--gap-{n}` primitive
    // class, never an inline style: an inline gap defeats the design
    // system's spacing scale and reintroduces per-element style attributes
    // that consumers work hard to eliminate. The gap scale (1-6, 8) is
    // defined in Stack.css.
    return (
      <Tag ref={ref} className={classes} style={style} {...rest}>
        {children}
      </Tag>
    );
  },
);

Stack.displayName = "Stack";

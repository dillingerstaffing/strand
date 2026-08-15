/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { type SpacingStep, resolveGap, warnOffLadderGap } from "../../spacing.js";

export interface StackProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Flex direction */
  direction?: "vertical" | "horizontal";
  /**
   * Gap between items, a rung on the spacing ladder (DL Part V 5.1).
   *
   * TYPED TO THE LADDER, so a TypeScript consumer cannot write `gap={7}`.
   * JavaScript consumers get no such protection, which is why the runtime
   * clamps as well: before both existed, an off-ladder value emitted a class
   * with no rule and rendered NO gap at all.
   */
  gap?: SpacingStep | number;
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
    // THE LADDER IS THE CONTRACT. An off-ladder gap used to emit
    // `strand-stack--gap-7`, a class with no rule, so `row-gap` computed to
    // `normal` and the stack had no gap at all. It is clamped to the nearest
    // rung and said out loud in development, because a silent clamp would
    // trade one invisible failure for another.
    const resolved = resolveGap(gap);
    if (!resolved.exact) warnOffLadderGap("Stack", gap as number, resolved.step);
    const classes = [
      "strand-stack",
      `strand-stack--${direction}`,
      `strand-stack--gap-${resolved.step}`,
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
    // that consumers work hard to eliminate. The rungs are `SPACING_STEPS`
    // and every one of them has a rule in Stack.css, which is what the clamp
    // above guarantees.
    return (
      <Tag ref={ref} className={classes} style={style} {...rest}>
        {children}
      </Tag>
    );
  },
);

Stack.displayName = "Stack";

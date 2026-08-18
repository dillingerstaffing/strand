/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { type SpacingStep, resolveGap, warnOffLadderGap } from "../../spacing.js";
import { cx } from "../../internal/index.js";

export interface StackProps extends JSX.HTMLAttributes<HTMLDivElement> {
  direction?: "vertical" | "horizontal";
  /** Gap, a rung on the spacing ladder (cf: spacing-ladder). */
  gap?: SpacingStep | number;
  /** Cross-axis alignment. */
  align?: "start" | "center" | "end" | "stretch";
  /** Main-axis alignment. */
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  /** Element to render, e.g. "ul". */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Flex layout with a spacing-ladder gap.
 *
 * @example
 * <Stack direction="horizontal" gap={4} align="center"><Button>Save</Button><Button variant="secondary">Cancel</Button></Stack>
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ direction = "vertical", gap = 4, align = "stretch", wrap = false, justify, as = "div", className = "", style, children, ...rest }, ref) => {
    // biome-ignore lint/suspicious/noExplicitAny: polymorphic tag
    const Tag = as as any;
    const resolved = resolveGap(gap);
    if (!resolved.exact) warnOffLadderGap("Stack", gap as number, resolved.step);
    return (
      <Tag
        ref={ref}
        className={cx(
          "strand-stack",
          `strand-stack--${direction}`,
          `strand-stack--gap-${resolved.step}`,
          align !== "stretch" && `strand-stack--align-${align}`,
          justify && `strand-stack--justify-${justify}`,
          wrap && "strand-stack--wrap",
          className,
        )}
        style={style}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);
Stack.displayName = "Stack";

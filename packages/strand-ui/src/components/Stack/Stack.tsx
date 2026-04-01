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

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = "vertical",
      gap = 4,
      align = "stretch",
      wrap = false,
      justify,
      className = "",
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "strand-stack",
      `strand-stack--${direction}`,
      align !== "stretch" && `strand-stack--align-${align}`,
      justify && `strand-stack--justify-${justify}`,
      wrap && "strand-stack--wrap",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const inlineStyle: Record<string, string> = {
      gap: `var(--strand-space-${gap})`,
    };

    return (
      <div
        ref={ref}
        className={classes}
        style={{ ...inlineStyle, ...(style as Record<string, string>) }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Stack.displayName = "Stack";

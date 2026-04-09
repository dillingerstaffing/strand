/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface DividerProps {
  /** Separator direction */
  direction?: "horizontal" | "vertical";
  /** Optional label text displayed in the middle of the line */
  label?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * Visual separator line between content sections, horizontal or vertical.
 *
 * @example
 * ```tsx
 * import { Divider } from '@dillingerstaffing/strand-ui';
 *
 * <Divider direction="horizontal" label="OR" />
 * ```
 */
export const Divider = forwardRef<HTMLElement, DividerProps>(
  ({ direction = "horizontal", label, className = "" }, ref) => {
    const isVertical = direction === "vertical";

    if (isVertical) {
      const classes = [
        "strand-divider",
        "strand-divider--vertical",
        className,
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <div
          ref={ref as preact.Ref<HTMLDivElement>}
          role="separator"
          aria-orientation="vertical"
          className={classes}
        />
      );
    }

    if (label) {
      const classes = [
        "strand-divider",
        "strand-divider--horizontal",
        "strand-divider--labeled",
        className,
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <div
          ref={ref as preact.Ref<HTMLDivElement>}
          role="separator"
          aria-orientation="horizontal"
          className={classes}
        >
          <span className="strand-divider__line" />
          <span className="strand-divider__label">{label}</span>
          <span className="strand-divider__line" />
        </div>
      );
    }

    const classes = [
      "strand-divider",
      "strand-divider--horizontal",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <hr
        ref={ref as preact.Ref<HTMLHRElement>}
        role="separator"
        aria-orientation="horizontal"
        className={classes}
      />
    );
  },
);

Divider.displayName = "Divider";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface ProgressProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "size"> {
  /** Visual variant */
  variant?: "bar" | "ring";
  /** Completion percentage (0-100). Omit for indeterminate. */
  value?: number;
  /** Size of the progress indicator */
  size?: "sm" | "md" | "lg";
}

const RING_SIZES: Record<string, number> = { sm: 24, md: 40, lg: 56 };
const RING_STROKE = 3;

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      variant = "bar",
      value,
      size = "md",
      className = "",
      ...rest
    },
    ref,
  ) => {
    const isDeterminate = value != null;

    const classes = [
      "strand-progress",
      `strand-progress--${variant}`,
      `strand-progress--${size}`,
      !isDeterminate && "strand-progress--indeterminate",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const ariaProps: Record<string, string | number | undefined> = {
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": 100,
    };

    if (isDeterminate) {
      ariaProps["aria-valuenow"] = value;
    }

    if (variant === "ring") {
      const dim = RING_SIZES[size] ?? RING_SIZES.md;
      const radius = (dim - RING_STROKE) / 2;
      const circumference = 2 * Math.PI * radius;
      const offset = isDeterminate
        ? circumference - (circumference * (value as number)) / 100
        : 0;

      return (
        <div ref={ref} className={classes} {...ariaProps} {...rest}>
          <svg
            width={dim}
            height={dim}
            viewBox={`0 0 ${dim} ${dim}`}
            className="strand-progress__ring"
          >
            <circle
              cx={dim / 2}
              cy={dim / 2}
              r={radius}
              fill="none"
              stroke-width={RING_STROKE}
              className="strand-progress__track"
            />
            <circle
              cx={dim / 2}
              cy={dim / 2}
              r={radius}
              fill="none"
              stroke-width={RING_STROKE}
              stroke-dasharray={circumference}
              stroke-dashoffset={isDeterminate ? offset : undefined}
              stroke-linecap="round"
              className="strand-progress__fill"
              transform={`rotate(-90 ${dim / 2} ${dim / 2})`}
            />
          </svg>
        </div>
      );
    }

    return (
      <div ref={ref} className={classes} {...ariaProps} {...rest}>
        <div
          className="strand-progress__fill"
          style={isDeterminate ? { width: `${value}%` } : undefined}
        />
      </div>
    );
  },
);

Progress.displayName = "Progress";

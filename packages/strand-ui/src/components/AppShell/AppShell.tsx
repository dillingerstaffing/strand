/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface AppShellProps extends JSX.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * The card the whole application sits inside: a bounded frame on the page
 * ground, chrome flush to its edges, corners rounded and children clipped
 * to them.
 *
 * **Not a content width.** `Container`'s tiers are reading measures —
 * 640 for prose, 1024 at the widest, because text stops being readable
 * past it. A frame is a different axis that happens also to have a width:
 * bounded by how wide an application should feel, not by how far an eye
 * tracks a line. Reach for `Container` inside this, not instead of it.
 *
 * Clipping is the point rather than the width. Without it a nav's square
 * top corners overhang the frame's rounded ones, which is visible at
 * exactly the two pixels a reader looks at first.
 *
 * Below the md breakpoint the frame drops its border, radius and shadow:
 * chrome around content that already fills the viewport draws attention
 * to itself and costs horizontal space a phone does not have.
 *
 * @example
 * ```tsx
 * <AppShell>
 *   <Nav />
 *   <Container>{children}</Container>
 * </AppShell>
 * ```
 */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  ({ className = "", children, ...rest }, ref) => {
    const classes = ["strand-app-shell", className].filter(Boolean).join(" ");
    return (
      <div ref={ref} class={classes} {...rest}>
        {children}
      </div>
    );
  },
);
AppShell.displayName = "AppShell";

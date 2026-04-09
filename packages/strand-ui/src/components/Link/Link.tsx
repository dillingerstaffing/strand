/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface LinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  /** URL destination */
  href: string;
  /** Opens in new tab with rel="noopener noreferrer" */
  external?: boolean;
  /** Style variant */
  variant?: "default" | "cta" | "mono";
}

/**
 * Styled anchor element with external-link handling and visual variants.
 *
 * @example
 * ```tsx
 * import { Link } from '@dillingerstaffing/strand-ui';
 *
 * <Link href="/docs" variant="cta">Read the docs</Link>
 * <Link href="https://example.com" external>External site</Link>
 * ```
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, external = false, variant = "default", className = "", children, ...rest }, ref) => {
    const classes = [
      "strand-link",
      variant !== "default" && `strand-link--${variant}`,
      className,
    ].filter(Boolean).join(" ");

    return (
      <a
        ref={ref}
        href={href}
        className={classes}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        {...rest}
      >
        {children}
      </a>
    );
  },
);

Link.displayName = "Link";

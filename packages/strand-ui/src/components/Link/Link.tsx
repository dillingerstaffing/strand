/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "../../internal/index.js";

export interface LinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Opens in a new tab with `rel="noopener noreferrer"`. */
  external?: boolean;
  /** `inherit` takes the surrounding text colour, e.g. a title that is a link. */
  variant?: "default" | "cta" | "mono" | "inherit";
}

/**
 * Styled anchor.
 *
 * @example
 * <Link href="/docs" variant="cta">Read the docs</Link>
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, external = false, variant = "default", className = "", children, ...rest }, ref) => (
    <a
      ref={ref}
      href={href}
      className={cx("strand-link", variant !== "default" && `strand-link--${variant}`, className)}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...rest}
    >
      {children}
    </a>
  ),
);
Link.displayName = "Link";

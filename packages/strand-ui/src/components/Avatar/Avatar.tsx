/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useState } from "preact/hooks";
import { cx } from "../../internal/index.js";

export interface AvatarProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "size"> {
  /** Image URL; falls back to initials if it fails to load. */
  src?: string;
  alt?: string;
  /** One or two characters shown without an image. */
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Circular person mark: an image, or initials.
 *
 * @example
 * <Avatar src="/photo.jpg" alt="Jane Doe" size="lg" />
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ src, alt = "", initials = "", size = "md", className = "", ...rest }, ref) => {
  const [imgError, setImgError] = useState(false);
  const displayInitials = initials.slice(0, 2).toUpperCase();
  return (
    <div ref={ref} className={cx("strand-avatar", `strand-avatar--${size}`, className)} role="img" aria-label={alt || displayInitials} {...rest}>
      {src && !imgError ? (
        <img className="strand-avatar__img" src={src} alt={alt} onError={() => setImgError(true)} />
      ) : (
        <span className="strand-avatar__initials" aria-hidden="true">
          {displayInitials}
        </span>
      )}
    </div>
  );
});
Avatar.displayName = "Avatar";

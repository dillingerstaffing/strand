/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useState, useCallback } from "preact/hooks";

export interface AvatarProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "size"> {
  /** Image URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Fallback initials (1-2 characters) */
  initials?: string;
  /** Avatar size */
  size?: "sm" | "md" | "lg" | "xl";
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = "",
      initials = "",
      size = "md",
      className = "",
      ...rest
    },
    ref,
  ) => {
    const [imgError, setImgError] = useState(false);

    const handleError = useCallback(() => {
      setImgError(true);
    }, []);

    const showImage = src && !imgError;
    const displayInitials = initials.slice(0, 2).toUpperCase();

    const classes = [
      "strand-avatar",
      `strand-avatar--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} role="img" aria-label={alt || displayInitials} {...rest}>
        {showImage ? (
          <img
            className="strand-avatar__img"
            src={src}
            alt={alt}
            onError={handleError}
          />
        ) : (
          <span className="strand-avatar__initials" aria-hidden="true">
            {displayInitials}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

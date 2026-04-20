/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface TypeSpecimenProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

/**
 * Typography specimen container. Stacks a large display line
 * on top of a mono meta row. Siblings are separated by dashed
 * dividers automatically.
 *
 * @example
 * ```tsx
 * <TypeSpecimen>
 *   <h2 class="strand-headline--xl">The quick brown fox</h2>
 *   <TypeSpecimenMeta>
 *     Inter <b>48px</b> <b>weight-300</b> <b>tracking-tight</b>
 *   </TypeSpecimenMeta>
 * </TypeSpecimen>
 * ```
 */
export const TypeSpecimen = forwardRef<HTMLDivElement, TypeSpecimenProps>(
  ({ className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      className={["strand-type-specimen", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  ),
);
TypeSpecimen.displayName = "TypeSpecimen";

export interface TypeSpecimenMetaProps
  extends JSX.HTMLAttributes<HTMLSpanElement> {}

/**
 * Mono meta row for a TypeSpecimen. Children can include inline
 * `<b>` labels to highlight token names.
 */
export const TypeSpecimenMeta = forwardRef<HTMLSpanElement, TypeSpecimenMetaProps>(
  ({ className = "", children, ...rest }, ref) => (
    <span
      ref={ref}
      className={["strand-type-specimen__meta", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </span>
  ),
);
TypeSpecimenMeta.displayName = "TypeSpecimenMeta";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { cx } from "../../internal/index.js";

export interface SettleProps extends JSX.HTMLAttributes<HTMLElement> {
  /** The value shown; a change REPLACES the element so the fade fires (DL 6.9.1). Compare the value the user is told, not a counter. */
  on?: string | number | boolean | null;
  /** Element to render. */
  as?: keyof JSX.IntrinsicElements;
  children?: ComponentChildren;
}

/**
 * Fades a region's new state in when the model changes (DL 6.9); the sibling of `Reserve`, which owns the box.
 *
 * @example
 * <Settle as="span" on={count}>{count} people</Settle>
 */
export function Settle({ on, as: Tag = "div", className = "", children, ...rest }: SettleProps) {
  const key = on === undefined || on === null ? undefined : String(on);
  return (
    // @ts-expect-error polymorphic tag; the prop union is the caller's
    <Tag key={key} className={cx("strand-settle", className)} {...rest}>
      {children}
    </Tag>
  );
}
Settle.displayName = "Settle";

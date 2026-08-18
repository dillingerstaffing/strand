/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { cx } from "./cx.js";

/** A component that renders one element carrying one base class. */
export function styled<E extends HTMLElement = HTMLDivElement>(
  tag: keyof JSX.IntrinsicElements,
  base: string,
  displayName: string,
) {
  const Component = forwardRef<E, JSX.HTMLAttributes<E>>(({ className = "", children, ...rest }, ref) => {
    // biome-ignore lint/suspicious/noExplicitAny: the tag is chosen at definition
    const Tag = tag as any;
    return (
      <Tag ref={ref} className={cx(base, className as string)} {...rest}>
        {children}
      </Tag>
    );
  });
  Component.displayName = displayName;
  return Component;
}

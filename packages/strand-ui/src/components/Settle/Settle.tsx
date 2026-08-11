/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";

export interface SettleProps extends JSX.HTMLAttributes<HTMLElement> {
  /**
   * The value this region is showing. When it changes, the element is
   * REPLACED rather than patched, which is what makes the fade fire.
   *
   * This is the whole reason the component exists rather than leaving
   * consumers to add `.strand-settle` by hand: a class alone animates an
   * insertion, and the most common state change in an application -- a
   * count going from 6 to 7 -- patches a text node and inserts nothing.
   * See design-language.md 6.9.1.
   *
   * Pass the value the user is being told about, not a counter: it is
   * compared, so an unchanged value must not re-announce itself.
   */
  on?: string | number | boolean | null;
  /** Element to render. Defaults to a div; use span inline. */
  as?: keyof JSX.IntrinsicElements;
  children?: ComponentChildren;
}

/**
 * Fades a region's new state in when the model changes, instead of
 * cutting to it.
 *
 * Implements design-language.md 6.9 (state change). The sibling of
 * `Reserve`, and the split is deliberate: Reserve holds the BOX while a
 * wait resolves, Settle acknowledges the MOMENT the user's action took
 * effect. A region needing both composes both.
 *
 * It does not and cannot affect layout. If the two states are different
 * sizes, that is a space-contract problem (6.6.1) and belongs to Reserve
 * or to the surrounding layout -- never to the fade, because a motion
 * primitive asked to absorb a size change ends up animating height.
 *
 * @example
 * ```tsx
 * import { Settle } from '@dillingerstaffing/strand-ui';
 *
 * // A value that changes. `on` is what makes it re-announce.
 * <Settle as="span" on={count}>{count} people</Settle>
 *
 * // A control replaced by its confirmation. The branch is the identity.
 * <Settle on={joined ? 'joined' : 'join'}>
 *   {joined ? <JoinedChip /> : <JoinButton />}
 * </Settle>
 *
 * // An item arriving in a list. Insertion alone fires it, so `on` is
 * // unnecessary here -- the element did not exist a moment ago.
 * {comments.map((c) => <Settle key={c.id}>{c.body}</Settle>)}
 * ```
 */
export function Settle({
  on,
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: SettleProps) {
  const classes = ["strand-settle", className].filter(Boolean).join(" ");

  // The key rides on the element this component RETURNS, not on the
  // component itself -- a component cannot key itself, only its parent
  // can. Preact compares keys when diffing a component's output, so a
  // changed key here unmounts the old element and mounts a new one, and
  // the CSS animation fires on the mount.
  //
  // `on` undefined leaves the key undefined, which is the insertion-only
  // case: the element is new anyway, so there is nothing to force.
  const key = on === undefined || on === null ? undefined : String(on);

  return (
    // @ts-expect-error polymorphic tag; the prop union is the caller's
    <Tag key={key} className={classes} {...rest}>
      {children}
    </Tag>
  );
}

Settle.displayName = "Settle";

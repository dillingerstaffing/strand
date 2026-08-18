<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Fades a region's new state in when the model changes, instead of cutting
  to it.

  Implements design-language.md 6.9 (state change) and 6.9.1 (identity is
  what triggers it). Thin wrapper over the `.strand-settle` class.

  The sibling of Reserve, and the split is deliberate: Reserve holds the BOX
  while a wait resolves, Settle acknowledges the MOMENT the user's action
  took effect. It cannot affect layout, by design. If the two states are
  different sizes that is a space-contract problem (6.6.1) and belongs to
  Reserve.

  `on` is what makes a VALUE change animate. A count going from 6 to 7
  patches a text node and inserts nothing, so without an identity the fade
  never fires. Svelte's `{#key}` re-creates the block when the expression
  changes, which is exactly the replacement the CSS needs.

  @example
  ```svelte
  <script>
    import { Settle } from '@dillingerstaffing/strand-svelte';
  </script>

  <Settle as="span" on={count}>{count} people</Settle>

  <Settle on={joined ? 'joined' : 'join'}>
    {#if joined}<JoinedChip />{:else}<JoinButton />{/if}
  </Settle>
  ```
-->
<script lang="ts">
  /** The value this region is showing. */
  export let on: string | number | boolean | null | undefined = undefined
  /** Element to render. Defaults to a div; use span inline. */
  export let as: string = 'div'
  /** Additional CSS class */
  let className: string = ''
  export { className as class }

  $: classes = ['strand-settle', className].filter(Boolean).join(' ')
</script>

{#key on}
  <svelte:element this={as} class={classes} {...$$restProps}>
    <slot />
  </svelte:element>
{/key}

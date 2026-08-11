<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  A bottom-anchored region carrying the primary action of a view, placed
  where a thumb rests.

  Implements design-language.md 14.8 (target position). 14.7 makes a target
  hittable; this makes it reachable. Thin wrapper over the
  `.strand-actiondock` classes.

  Use it for the ONE action a view exists to produce, and show it only while
  the in-flow control it stands in for is off screen. A dock competing with
  the real control is two live buttons for one action.

  Accessibility: the docked control usually duplicates one already in the
  accessibility tree, so give the copy `aria-hidden` and a `tabindex="-1"`
  control to avoid a duplicate announcement and tab stop. Reach is a thumb
  problem; a keyboard user gains nothing from the copy.

  @example
  ```svelte
  <script>
    import { ActionDock, Button } from '@dillingerstaffing/strand-svelte'
  </script>

  <ActionDock visible={!primaryControlOnScreen} aria-hidden="true">
    <Button variant="primary" tabindex={-1} on:click={rsvp}>RSVP</Button>
  </ActionDock>
  ```
-->
<script lang="ts">
  /** Whether the dock is showing. Default false, so a dock that is never
      driven occludes nothing rather than welding itself across content. */
  export let visible: boolean = false
</script>

<div
  class="strand-actiondock"
  data-strand-actiondock={visible ? 'visible' : 'hidden'}
  {...$$restProps}
>
  <slot />
</div>

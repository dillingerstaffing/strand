<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  The second dark surface role (design-language.md 9.3): a single element
  promoted above the content around it.

  Not InstrumentViewport, and the difference is not a shade. That one is
  the abyss and exists for DENSITY; this is midnight and exists for
  EMPHASIS. THE CASCADE IS THE PRIMITIVE: gray-400 (6.99 -> 4.36) and
  teal-vital (7.07 -> 4.42) both fail as text on midnight while passing
  on the abyss, and the instrument cascade uses both. Put ordinary text
  primitives inside this and they retint themselves.

  A view with several feature surfaces has no feature.
-->
<script lang="ts">
  /** Render as a different element, e.g. "article" or "section". */
  export let as: 'div' | 'article' | 'section' = 'div'
  /** Merged explicitly; $$restProps spreads after class and would replace it. */
  let className: string = ''
  export { className as class }
  $: classes = ['strand-feature-surface', className].filter(Boolean).join(' ')
</script>

<svelte:element this={as} class={classes} {...$$restProps}>
  <slot />
</svelte:element>

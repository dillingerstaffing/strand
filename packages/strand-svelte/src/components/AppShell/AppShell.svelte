<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  The card the whole application sits inside.

  NOT a content width: Container's tiers are reading measures, widest 1024
  because text stops being readable past it. A frame is bounded by how wide
  an application should feel. Use Container INSIDE this, not instead of it.

  Clipping is the point rather than the width: without it a nav's square
  corners overhang the frame's rounded ones.
-->
<script lang="ts">
  /** Merged explicitly; $$restProps spreads after class and would replace it. */
  let className: string = ''
  export { className as class }
  $: classes = ['strand-app-shell', className].filter(Boolean).join(' ')
</script>

<div class={classes} {...$$restProps}><slot /></div>

<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Recessed dark surface for displaying instrument-style UI components.

  @example
  ```svelte
  <script>
    import { InstrumentViewport, DataReadout } from '@dillingerstaffing/strand-svelte';
  </script>

  <InstrumentViewport grid>
    <DataReadout label="Uptime" value="99.9%" />
  </InstrumentViewport>
  ```
-->
<script lang="ts">
  /** Show grid overlay lines */
  export let grid: boolean = false
  /** Render as page-filling instrument cabinet (DL Part 9.3 full-bleed mode).
   *  Requires the host page to apply `strand-body--instrument` to <body>
   *  so the dark surface reaches the screen edge. */
  export let fullBleed: boolean = false

  $: classes = [
    'strand-instrument-viewport',
    grid && 'strand-instrument-viewport--grid',
    fullBleed && 'strand-instrument-viewport--full-bleed',
  ].filter(Boolean).join(' ')
</script>

<div class={classes} {...$$restProps}>
  <slot />
</div>

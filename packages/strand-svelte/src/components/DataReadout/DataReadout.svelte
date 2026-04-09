<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Instrument-panel metric display with overline label and prominent value.

  @example
  ```svelte
  <script>
    import { DataReadout } from '@dillingerstaffing/strand-svelte';
  </script>

  <DataReadout label="Conversion Rate" value="94%" size="lg" />
  ```
-->
<script lang="ts">
  /** Overline label text */
  export let label: string
  /** The large displayed value */
  export let value: string | number
  /** Size variant: sm (compact), md (default), lg (hero), xl (primary instrument) */
  export let size: 'sm' | 'md' | 'lg' | 'xl' | undefined = undefined

  $: classes = [
    'strand-data-readout',
    size && size !== 'md' ? `strand-data-readout--${size}` : '',
  ].filter(Boolean).join(' ')
</script>

<div class={classes} {...$$restProps}>
  <span class="strand-data-readout__label">{label}</span>
  <span class="strand-data-readout__value">{value}</span>
</div>

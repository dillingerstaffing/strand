<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  The screen that covers an instrument viewport while it boots. Fades out
  rather than unmounting, so the map beneath is never revealed mid-paint:
  keep it mounted and flip `visible`. role="status" so the caption is
  announced rather than the state changing silently.
-->
<script lang="ts">
  /** Default true: it covers a booting instrument, so present is the safe state. */
  export let visible: boolean = true
  /** Instrument voice (11.7): "Processing", not "Loading...". */
  export let text: string = 'Processing'
  /** Merged explicitly; $$restProps spreads after class and would replace it. */
  let className: string = ''
  export { className as class }
  $: classes = [
    'strand-map-loading',
    visible ? '' : 'strand-map-loading--hidden',
    className,
  ]
    .filter(Boolean)
    .join(' ')
</script>

<div class={classes} role="status" aria-live="polite" aria-busy={visible ? 'true' : 'false'} {...$$restProps}>
  <div class="strand-map-loading__spinner" aria-hidden="true"></div>
  <div class="strand-map-loading__text">{text}</div>
  <div class="strand-map-loading__bar" aria-hidden="true"></div>
</div>

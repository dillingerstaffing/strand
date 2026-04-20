<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  export let ariaLabel: string = 'Close'
</script>

<button type="button" class="strand-ref-frame__panel-close" aria-label={ariaLabel} {...$$restProps}>
  <slot>×</slot>
</button>

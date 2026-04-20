<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  export let hidden: boolean = false
</script>

<div
  class="strand-ref-frame__content"
  aria-hidden={hidden ? 'true' : undefined}
  {...$$restProps}
>
  <slot />
</div>

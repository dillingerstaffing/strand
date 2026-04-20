<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  export let name: string
  export let hex: string
  export let background: string
  export let color: string
</script>

<div class="strand-swatch" style="background: {background}; color: {color};" {...$$restProps}>
  <span class="strand-swatch__name">{name}</span>
  <span class="strand-swatch__hex">{hex}</span>
</div>

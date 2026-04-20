<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  export let width: string | undefined = undefined
  $: styleAttr = width ? `width: ${width};` : ''
</script>

<div class="strand-container-scale__bar" style={styleAttr} {...$$restProps}>
  <slot />
</div>

<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  export let width: string | number | undefined = undefined
  $: w = typeof width === 'number' ? `${width}px` : width
  $: styleAttr = w ? `width: ${w};` : ''
</script>

<span class="strand-token-specimen__spacer" style={styleAttr} {...$$restProps}></span>

<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  export let color: string | undefined = undefined
  $: styleAttr = color ? `background: ${color};` : ''
</script>

<span class="strand-ref-frame__dot" style={styleAttr} {...$$restProps}></span>

<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  export let radius: string | undefined = undefined
  export let shadow: string | undefined = undefined
  $: styleAttr = [
    radius ? `border-radius: ${radius};` : '',
    shadow ? `box-shadow: ${shadow};` : '',
  ].filter(Boolean).join(' ')
</script>

<span class="strand-token-specimen__box" style={styleAttr} {...$$restProps}></span>

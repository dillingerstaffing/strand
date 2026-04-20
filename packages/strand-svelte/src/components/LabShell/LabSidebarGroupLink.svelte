<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  export let href: string = '#'
</script>

<a class="strand-ref-shell__group-link" {href} {...$$restProps}>
  <span class="strand-ref-shell__group-dot"></span>
  <slot />
</a>

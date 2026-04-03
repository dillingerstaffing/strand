<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** URL destination */
  export let href: string
  /** Opens in new tab with rel="noopener noreferrer" */
  export let external: boolean = false
</script>

<a
  {href}
  class="strand-link"
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener noreferrer' : undefined}
  {...$$restProps}
>
  <slot />
</a>

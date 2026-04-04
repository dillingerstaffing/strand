<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** URL destination */
  export let href: string
  /** Opens in new tab with rel="noopener noreferrer" */
  export let external: boolean = false
  /** Style variant */
  export let variant: 'default' | 'cta' | 'mono' = 'default'

  $: linkClasses = ['strand-link', variant !== 'default' && `strand-link--${variant}`].filter(Boolean).join(' ')
</script>

<a
  {href}
  class={linkClasses}
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener noreferrer' : undefined}
  {...$$restProps}
>
  <slot />
</a>

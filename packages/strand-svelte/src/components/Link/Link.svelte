<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Styled anchor element with external-link handling and visual variants.

  @example
  ```svelte
  <script>
    import { Link } from '@dillingerstaffing/strand-svelte';
  </script>

  <Link href="/docs" variant="cta">Read the docs</Link>
  <Link href="https://example.com" external>External site</Link>
  ```
-->
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

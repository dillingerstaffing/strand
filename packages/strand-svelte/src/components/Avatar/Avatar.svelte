<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Circular user representation with image, initials fallback, and multiple sizes.

  @example
  ```svelte
  <script>
    import { Avatar } from '@dillingerstaffing/strand-svelte';
  </script>

  <Avatar src="/photo.jpg" alt="Jane Doe" size="lg" />
  <Avatar initials="JD" size="md" />
  ```
-->
<script lang="ts">
  /** Image URL */
  export let src: string | undefined = undefined
  /** Alt text for image */
  export let alt: string = ''
  /** Fallback initials (1-2 characters) */
  export let initials: string = ''
  /** Avatar size */
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md'

  let imgError = false

  $: showImage = src && !imgError
  $: displayInitials = initials.slice(0, 2).toUpperCase()

  $: classes = [
    'strand-avatar',
    `strand-avatar--${size}`,
  ].filter(Boolean).join(' ')

  function handleError() {
    imgError = true
  }
</script>

<div class={classes} role="img" aria-label={alt || displayInitials} {...$$restProps}>
  {#if showImage}
    <img
      class="strand-avatar__img"
      {src}
      {alt}
      on:error={handleError}
    />
  {:else}
    <span class="strand-avatar__initials" aria-hidden="true">
      {displayInitials}
    </span>
  {/if}
</div>

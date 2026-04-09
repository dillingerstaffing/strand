<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Placeholder shimmer shape used while content is loading.

  @example
  ```svelte
  <script>
    import { Skeleton } from '@dillingerstaffing/strand-svelte';
  </script>

  <Skeleton variant="text" width="60%" />
  <Skeleton variant="circle" width="48px" />
  <Skeleton variant="rectangle" width="100%" height="200px" />
  ```
-->
<script lang="ts">
  /** Shape variant */
  export let variant: 'text' | 'rectangle' | 'circle' = 'text'
  /** CSS width value */
  export let width: string | undefined = undefined
  /** CSS height value */
  export let height: string | undefined = undefined

  $: effectiveWidth = width ?? (variant === 'text' ? '100%' : undefined)
  $: effectiveHeight = variant === 'circle' ? effectiveWidth : height

  $: classes = [
    'strand-skeleton',
    `strand-skeleton--${variant}`,
    'strand-skeleton--shimmer',
  ].filter(Boolean).join(' ')

  $: inlineStyle = [
    effectiveWidth ? `width: ${effectiveWidth}` : '',
    effectiveHeight ? `height: ${effectiveHeight}` : '',
  ].filter(Boolean).join('; ')
</script>

<div class={classes} aria-hidden="true" style={inlineStyle || undefined} {...$$restProps}></div>

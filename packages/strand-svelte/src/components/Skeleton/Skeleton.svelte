<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
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

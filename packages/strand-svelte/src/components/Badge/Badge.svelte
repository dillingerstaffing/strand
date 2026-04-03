<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Badge display mode */
  export let variant: 'dot' | 'count' = 'count'
  /** Color status */
  export let status: 'default' | 'teal' | 'blue' | 'amber' | 'red' = 'default'
  /** Number to display (count variant only) */
  export let count: number | undefined = undefined
  /** Maximum count before showing "N+" */
  export let maxCount: number = 99

  $: displayValue = variant === 'count'
    ? (count != null && count > maxCount ? `${maxCount}+` : count)
    : null

  $: ariaLabel = variant === 'dot'
    ? 'Status indicator'
    : count != null
      ? `${count} notifications`
      : undefined

  $: badgeClasses = [
    'strand-badge__indicator',
    `strand-badge--${variant}`,
    `strand-badge--${status}`,
  ].filter(Boolean).join(' ')

  $: hasChildren = $$slots.default
  $: wrapperClasses = hasChildren
    ? ['strand-badge'].filter(Boolean).join(' ')
    : ['strand-badge', 'strand-badge--inline'].filter(Boolean).join(' ')
</script>

<span class={wrapperClasses} {...$$restProps}>
  {#if hasChildren}
    <slot />
  {/if}
  <span class={badgeClasses} aria-label={ariaLabel} role="status">
    {#if displayValue != null}{displayValue}{/if}
  </span>
</span>

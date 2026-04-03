<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Visual variant */
  export let variant: 'bar' | 'ring' = 'bar'
  /** Completion percentage (0-100). Omit for indeterminate. */
  export let value: number | undefined = undefined
  /** Size of the progress indicator */
  export let size: 'sm' | 'md' | 'lg' = 'md'

  const RING_SIZES: Record<string, number> = { sm: 24, md: 40, lg: 56 }
  const RING_STROKE = 3

  $: isDeterminate = value != null
  $: classes = [
    'strand-progress',
    `strand-progress--${variant}`,
    `strand-progress--${size}`,
    !isDeterminate && 'strand-progress--indeterminate',
  ].filter(Boolean).join(' ')

  $: dim = RING_SIZES[size] ?? RING_SIZES.md
  $: radius = (dim - RING_STROKE) / 2
  $: circumference = 2 * Math.PI * radius
  $: offset = isDeterminate ? circumference - (circumference * (value as number)) / 100 : 0
</script>

{#if variant === 'ring'}
  <div
    class={classes}
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={isDeterminate ? value : undefined}
    {...$$restProps}
  >
    <svg
      width={dim}
      height={dim}
      viewBox={`0 0 ${dim} ${dim}`}
      class="strand-progress__ring"
    >
      <circle
        cx={dim / 2}
        cy={dim / 2}
        r={radius}
        fill="none"
        stroke-width={RING_STROKE}
        class="strand-progress__track"
      />
      <circle
        cx={dim / 2}
        cy={dim / 2}
        r={radius}
        fill="none"
        stroke-width={RING_STROKE}
        stroke-dasharray={circumference}
        stroke-dashoffset={isDeterminate ? offset : undefined}
        stroke-linecap="round"
        class="strand-progress__fill"
        transform={`rotate(-90 ${dim / 2} ${dim / 2})`}
      />
    </svg>
  </div>
{:else}
  <div
    class={classes}
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={isDeterminate ? value : undefined}
    {...$$restProps}
  >
    <div
      class="strand-progress__fill"
      style={isDeterminate ? `width: ${value}%` : undefined}
    ></div>
  </div>
{/if}

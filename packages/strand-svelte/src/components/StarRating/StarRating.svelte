<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Interactive 1-to-5 star rating control. Mirrors the Preact and Vue
  StarRating APIs for cross-consumer parity.

  @example
  ```svelte
  <script>
    import { StarRating } from '@dillingerstaffing/strand-svelte';
    let value = 0;
  </script>

  <StarRating
    {value}
    onChange={(v) => value = v}
    ariaLabel="Rate this event"
    size="md"
  />
  ```
-->
<script lang="ts">
  export let value: number = 0
  export let onChange: ((v: number) => void) | undefined = undefined
  export let size: 'sm' | 'md' | 'lg' = 'md'
  export let readOnly: boolean = false
  export let ariaLabel: string

  let hover: number = 0

  $: classes = [
    'strand-star-rating',
    `strand-star-rating--${size}`,
    readOnly && 'strand-star-rating--readonly',
  ].filter(Boolean).join(' ')

  $: display = hover || value

  function select(n: number): void {
    if (readOnly) return
    onChange?.(n)
  }

  function onKey(e: KeyboardEvent, n: number): void {
    if (readOnly) return
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      select(n)
    }
  }
</script>

<div
  class={classes}
  role="radiogroup"
  aria-label={ariaLabel}
  data-strand-component="star-rating"
  data-value={String(value)}
>
  {#each [1, 2, 3, 4, 5] as n (n)}
    <button
      type="button"
      class={`strand-star-rating__star${n <= display ? ' strand-star-rating__star--active' : ''}`}
      role="radio"
      aria-checked={n === value ? 'true' : 'false'}
      aria-label={`${n} star${n > 1 ? 's' : ''}`}
      tabindex={readOnly ? -1 : 0}
      disabled={readOnly}
      data-star-value={String(n)}
      on:click={() => select(n)}
      on:keydown={(e) => onKey(e, n)}
      on:mouseenter={readOnly ? undefined : () => (hover = n)}
      on:mouseleave={readOnly ? undefined : () => (hover = 0)}
      on:focus={readOnly ? undefined : () => (hover = n)}
      on:blur={readOnly ? undefined : () => (hover = 0)}
    >
      <span class="strand-star-rating__glyph" aria-hidden="true">{'\u2605'}</span>
    </button>
  {/each}
</div>

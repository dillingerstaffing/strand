<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Star rating control: each star is a radio; arrows, Home and End move the rating. Mirrors the Preact and Vue
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
  /** 0 through count; 0 is unset. */
  export let value: number = 0
  /** Called with the new value, 1 through count, or 0 when allowClear re-selects the current star. */
  export let onChange: ((v: number) => void) | undefined = undefined
  /** Number of stars. */
  export let count: number = 5
  /** Selecting the current star again clears the rating. */
  export let allowClear: boolean = false
  export let size: 'sm' | 'md' | 'lg' = 'md'
  /** Renders as an image named "{value} of {count} stars"; no controls. */
  export let readOnly: boolean = false
  /** Accessible name for the group. */
  export let ariaLabel: string

  let hover: number = 0
  let stars: HTMLButtonElement[] = []

  $: values = Array.from({ length: count }, (_, i) => i + 1)
  $: classes = ['strand-star-rating', `strand-star-rating--${size}`, readOnly && 'strand-star-rating--readonly'].filter(Boolean).join(' ')
  $: display = hover || value
  $: focused = value || 1

  function select(n: number): void {
    onChange?.(allowClear && n === value ? 0 : n)
  }
  function moveTo(n: number): void {
    const next = Math.min(count, Math.max(1, n))
    onChange?.(next)
    stars[next - 1]?.focus()
  }
  function onKeyDown(e: KeyboardEvent): void {
    const next: Record<string, number> = { ArrowRight: value + 1, ArrowUp: value + 1, ArrowLeft: value - 1, ArrowDown: value - 1, Home: 1, End: count }
    if (!(e.key in next)) return
    e.preventDefault()
    moveTo(next[e.key])
  }
</script>

{#if readOnly}
  <div class={classes} role="img" aria-label={`${ariaLabel}, ${value} of ${count} stars`} data-strand-component="star-rating" data-value={String(value)}>
    {#each values as n (n)}
      <span class={`strand-star-rating__star${n <= value ? ' strand-star-rating__star--active' : ''}`} data-star-value={String(n)}>
        <span class="strand-star-rating__glyph" aria-hidden="true">{'\u2605'}</span>
      </span>
    {/each}
  </div>
{:else}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div class={classes} role="radiogroup" aria-label={ariaLabel} data-strand-component="star-rating" data-value={String(value)} on:keydown={onKeyDown}>
    {#each values as n (n)}
      <button
        bind:this={stars[n - 1]}
        type="button"
        class={`strand-star-rating__star${n <= display ? ' strand-star-rating__star--active' : ''}`}
        role="radio"
        aria-checked={n === value ? 'true' : 'false'}
        aria-label={`${n} star${n > 1 ? 's' : ''}`}
        tabindex={n === focused ? 0 : -1}
        data-star-value={String(n)}
        on:click={() => select(n)}
        on:mouseenter={() => (hover = n)}
        on:mouseleave={() => (hover = 0)}
        on:focus={() => (hover = n)}
        on:blur={() => (hover = 0)}
      >
        <span class="strand-star-rating__glyph" aria-hidden="true">{'\u2605'}</span>
      </button>
    {/each}
  </div>
{/if}

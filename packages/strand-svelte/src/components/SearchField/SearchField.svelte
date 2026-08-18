<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  A search input for page chrome: a header field on a wide viewport, a
  full-width bar on a narrow one.

  Renders its full geometry from first paint with no JavaScript, so it can
  be server-rendered into a header without moving the page when it
  hydrates (design-language.md 6.6.1, the space contract).

  NOT `.strand-search-bar`, which is the overlay that floats on an
  instrument viewport. Use that one on a map; use this one in a header, a
  filter rail, or any ordinary document flow.

  Pair the two presentations with strand-hide-below-md / strand-hide-from-md
  rather than choosing one by measuring the viewport in JS.

  @example
  ```svelte
  <script>
    import { SearchField } from '@dillingerstaffing/strand-svelte'
    let q = ''
  </script>

  <SearchField
    bind:value={q}
    class="strand-hide-below-md"
    placeholder="Search trail runs, pottery, chess"
    clearable
    on:clear={() => (q = '')}
  />
  ```
-->
<script lang="ts">
  /** `field` is the fixed-width header presentation, `full` spans its container. */
  export let variant: 'field' | 'full' = 'field'

  /** Placeholder. Name real content: "Search trail runs, pottery, chess". */
  export let placeholder: string = 'Search'

  /** Accessible name. */
  export let label: string = 'Search'

  /** Current value. Bindable. */
  export let value: string | undefined = undefined

  /** Renders a clear control when the field is non-empty. */
  export let clearable: boolean = false

  /** Additional CSS class, MERGED with the component's own. */
  let className: string = ''
  export { className as class }

  /** Called when the clear control is pressed. */
  export let onclear: (() => void) | undefined = undefined

  /** Called with the current value on every keystroke. */
  export let onvaluechange: ((value: string) => void) | undefined = undefined

  function handleInput(event: Event) {
    onvaluechange?.((event.target as HTMLInputElement).value)
  }

  $: classes = [
    'strand-search-field',
    variant === 'full' ? 'strand-search-field--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  $: showClear = clearable && typeof value === 'string'
  $: hasValue = typeof value === 'string' && value.length > 0
</script>

<div class={classes} role="search">
  <svg
    class="strand-search-field__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5 14 14" />
  </svg>

  <input
    class="strand-search-field__input"
    type="search"
    aria-label={label}
    {placeholder}
    bind:value
    on:input={handleInput}
    {...$$restProps}
  />

  {#if showClear}
    <button
      type="button"
      class="strand-search-field__clear"
      aria-label="Clear search"
      hidden={!hasValue}
      on:click={() => onclear?.()}
    >
      <svg
        viewBox="0 0 16 16"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
    </button>
  {/if}
</div>

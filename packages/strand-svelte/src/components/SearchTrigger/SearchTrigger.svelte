<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  A control that looks like a search field and behaves like a button: it
  opens a search overlay rather than accepting text.

  Use this wherever search is palette-driven. Use SearchField only where
  the input itself is the search.

  Accessibility: a <button> with aria-haspopup="dialog", so assistive
  technology announces that activating it opens something rather than
  promising that typing works here. An <input> that opened an overlay on
  focus would violate WCAG 3.2.1 (On Focus).

  @example
  ```svelte
  <script>
    import { SearchTrigger } from '@dillingerstaffing/strand-svelte'
  </script>

  <SearchTrigger
    class="strand-hide-below-md"
    label="Search trail runs, pottery, chess"
    expanded={paletteOpen}
    controls="search-palette"
    on:click={() => (paletteOpen = true)}
  />
  ```
-->
<script lang="ts">
  /** `field` is the fixed-width header presentation, `full` spans its
      container, `icon` is a square button at the touch-target floor for
      the band where a header has stopped having room for a field but has
      not yet handed over to a phone layout. `icon` keeps the label in the
      accessibility tree (clipped, not display:none), because the label is
      the accessible name and WCAG 2.5.3 requires it to survive. */
  export let variant: 'field' | 'full' | 'icon' = 'field'

  /** Visible standing text, which is ALSO the accessible name. There is no
      aria-label override: WCAG 2.5.3 (Label in Name) requires the
      accessible name to contain the visible text, so a speech-input user
      saying what they can see activates the control. */
  export let label: string = 'Search'

  /** Whether the overlay this opens is currently showing. */
  export let expanded: boolean | undefined = undefined

  /** `id` of the overlay, when one is rendered. */
  export let controls: string | undefined = undefined

  /** Additional CSS class, MERGED with the component's own. Explicit prop
      rather than $$restProps, which spreads AFTER the class attribute and
      would REPLACE the component's classes outright -- the ActionDock
      defect the component-test-parity guard found. */
  let className: string = ''
  export { className as class }

  $: classes = [
    'strand-search-field',
    variant === 'full' ? 'strand-search-field--full' : '',
    'strand-search-trigger',
    variant === 'icon' ? 'strand-search-trigger--icon' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
</script>

<button
  type="button"
  class={classes}
  aria-haspopup="dialog"
  aria-expanded={expanded}
  aria-controls={controls}
  on:click
  {...$$restProps}
>
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
  <span class="strand-search-trigger__label">{label}</span>
</button>

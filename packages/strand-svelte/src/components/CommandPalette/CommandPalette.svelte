<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Search-and-jump overlay: a filtered list the user drives from the keyboard.

  Composes Dialog, so focus trapping, focus restoration, scroll lock and
  Escape dismissal are inherited rather than reimplemented here.

  Filtering and ranking belong to the CALLER. What lives here is the part
  that is easy to get subtly wrong: the combobox and listbox roles, the
  active-descendant wiring that lets a screen reader announce the highlighted
  row while focus stays in the text field, arrow selection with wrapping, and
  keeping the highlighted row inside the scroll viewport.

  @example
  ```svelte
  <script>
    import { CommandPalette } from '@dillingerstaffing/strand-svelte';
    let open = false;
    let query = '';
  </script>

  <CommandPalette
    {open}
    {query}
    items={results}
    placeholder="Jump to..."
    onclose={() => (open = false)}
    onquerychange={(v) => (query = v)}
    onselect={(item) => go(item)}
  />
  ```
-->
<script lang="ts">
  import { tick } from 'svelte'
  import Dialog from '../Dialog/Dialog.svelte'

  export interface CommandPaletteItem {
    /** Stable identity. Used for keys and for the active-descendant id. */
    id: string
    /** Primary text. This is what the user is scanning for. */
    label: string
    /** Secondary text shown beneath the label. */
    sublabel?: string
    /** Optional short trailing token, such as a category or shortcut hint. */
    badge?: string
  }

  /** Whether the palette is open */
  export let open: boolean = false
  /** Items to show, already filtered and ranked by the caller */
  export let items: CommandPaletteItem[] = []
  /** Current search text */
  export let query: string = ''
  /** Placeholder for the search field */
  export let placeholder: string = 'Search...'
  /** Shown when items is empty */
  export let emptyLabel: string = 'No matches'
  /** Accessible name for the palette */
  export let label: string = 'Search'
  /** Called when the palette should close */
  export let onclose: (() => void) | undefined = undefined
  /** Called as the user types */
  export let onquerychange: ((value: string) => void) | undefined = undefined
  /** Called when an item is chosen by Enter or by click */
  export let onselect: ((item: CommandPaletteItem) => void) | undefined = undefined

  let paletteIdCounter = 0
  const baseId = `strand-command-palette-${++paletteIdCounter}`
  const listboxId = `${baseId}-listbox`
  const optionId = (index: number) => `${baseId}-option-${index}`

  let active = 0
  let listEl: HTMLDivElement
  let inputEl: HTMLInputElement

  /** Wrap at both ends so the last item is one keypress from the first. */
  function wrapIndex(index: number, delta: number, length: number): number {
    if (length <= 0) return 0
    return (((index + delta) % length) + length) % length
  }

  // A shorter list can leave the highlight past the end, which would make
  // Enter select nothing. Reset whenever the result set changes identity,
  // and again on open so reopening does not resume an old position.
  $: if (items) active = 0
  $: if (open) active = 0

  // Put the caret in the search field when the palette opens.
  //
  // Dialog focuses the FIRST focusable element in its panel, which is its own
  // close button, and the input comes after it in the DOM. For most dialogs
  // that is the right default. For this one it is fatal: the entire
  // interaction model is "open and type", so a visitor who opened with the
  // keyboard was typing into a button and nothing filtered. Measured in a real
  // browser: activeElement was BUTTON.strand-dialog__close on open.
  //
  // Deferred to a frame rather than run synchronously, because Dialog does not
  // focus immediately either: it SCHEDULES a requestAnimationFrame. Focusing
  // synchronously here would land first and Dialog's callback would steal it
  // back to the close button, intermittently. Enqueued after Dialog's, and
  // rAF callbacks run FIFO, so this one wins.
  $: if (open && typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => inputEl?.focus())
  }

  // Keyboard selection can move the highlight outside the scroll viewport,
  // where the user is driving a list they cannot see.
  $: if (active >= 0 && listEl) scrollActiveIntoView(active)

  async function scrollActiveIntoView(index: number) {
    await tick()
    if (!listEl) return
    const el = listEl.querySelector<HTMLElement>(`#${CSS.escape(optionId(index))}`)
    // Guarded rather than called bare: scrollIntoView is absent in jsdom and
    // in any non-browser renderer, and an unguarded call there rejects on
    // every selection change. The scroll is a courtesy; losing it must not
    // break the component.
    if (typeof el?.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'nearest' })
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      active = wrapIndex(active, 1, items.length)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      active = wrapIndex(active, -1, items.length)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      active = 0
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      active = Math.max(0, items.length - 1)
      return
    }
    if (event.key === 'Enter') {
      const item = items[active]
      // Enter on an empty result set must do nothing rather than throw while
      // the user is mid-keystroke.
      if (!item) return
      event.preventDefault()
      onselect?.(item)
    }
  }

  function handleInput(event: Event) {
    onquerychange?.((event.target as HTMLInputElement).value)
  }
</script>

<Dialog {open} class="strand-command-palette" aria-label={label} onclose={() => onclose?.()}>
  <div class="strand-command-palette__search">
    <svg
      class="strand-command-palette__icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
    </svg>
    <input
      bind:this={inputEl}
      type="text"
      class="strand-command-palette__input"
      value={query}
      {placeholder}
      role="combobox"
      aria-expanded="true"
      aria-controls={listboxId}
      aria-activedescendant={items.length ? optionId(active) : undefined}
      aria-autocomplete="list"
      aria-label={label}
      autocomplete="off"
      spellcheck={false}
      on:input={handleInput}
      on:keydown={handleKeyDown}
    />
  </div>

  <div
    bind:this={listEl}
    class="strand-command-palette__list"
    id={listboxId}
    role="listbox"
    aria-label={label}
  >
    {#if items.length === 0}
      <p class="strand-command-palette__empty">{emptyLabel}</p>
    {/if}
    {#each items as item, index (item.id)}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!--
        The keyboard path for these rows is NOT a handler on each row: it is
        Enter on the combobox input, which acts on the aria-activedescendant
        row. That is the ARIA combobox pattern, where focus deliberately never
        leaves the field, so per-option key handlers would be unreachable code.
        tabindex="-1" keeps them programmatically addressable without making
        them tab stops.
      -->
      <div
        id={optionId(index)}
        role="option"
        tabindex="-1"
        aria-selected={index === active}
        class={index === active
          ? 'strand-command-palette__option strand-command-palette__option--active'
          : 'strand-command-palette__option'}
        on:mousemove={() => (active = index)}
        on:click={() => onselect?.(item)}
      >
        <span class="strand-command-palette__label">{item.label}</span>
        {#if item.sublabel}
          <span class="strand-command-palette__sublabel">{item.sublabel}</span>
        {/if}
        {#if item.badge}
          <span class="strand-command-palette__badge">{item.badge}</span>
        {/if}
      </div>
    {/each}
  </div>
</Dialog>

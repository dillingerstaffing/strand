<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  The persistent viewport-anchored navigation an application shell takes on
  a touch viewport.

  Implements design-language.md 19.1.1, which is the CONDITION selecting
  between this and the hamburger in 19.1. Read it before using this: the
  commonest misuse is putting a tab bar on a content surface, where the
  hamburger is correct and this costs 76px of every screen forever.

  Not Tabs, which switches content panels inside one view (19.3). Not
  ActionDock either: a dock carries the one ACTION a view produces, this
  carries DESTINATIONS. 19.1.1 does NOT forbid the two coexisting -- it
  forbids stacking them into a wall and requires a surface wanting both to
  decide which belongs nearer the thumb. Mutually exclusive by state is a
  legal answer.

  Reserve the space it occupies with `strand-tabbar-offset` on the
  scrolling content, or the last item of every list sits underneath it.

  @example
  ```svelte
  <script>
    import { TabBar } from '@dillingerstaffing/strand-svelte'
  </script>

  <TabBar
    items={[
      { id: 'discover', label: 'Discover', href: '/discover' },
      { id: 'calendar', label: 'Calendar', href: '/calendar' },
      { id: 'people', label: 'People', href: '/people' },
    ]}
    current={route}
    onnavigate={setRoute}
  />
  ```
-->
<script lang="ts" context="module">
  export interface TabBarItem {
    /** Stable identity, and what `onnavigate` receives. */
    id: string
    /** Visible label. Kept short: it wraps rather than truncating. */
    label: string
    /** Destination. Omit for a button-style item driven by `onnavigate`. */
    href?: string
  }
</script>

<script lang="ts">
  /** Three to five top-level destinations, per 19.1.1. */
  export let items: TabBarItem[] = []

  /** `id` of the current destination. Sets `aria-current="page"`. */
  export let current: string | undefined = undefined

  /** Accessible name for the landmark. */
  export let label: string = 'Primary'

  /** Called with an item's id. */
  export let onnavigate: ((id: string) => void) | undefined = undefined

  /** Additional CSS class, MERGED with the component's own. */
  let className: string = ''
  export { className as class }

  $: classes = ['strand-tabbar', className].filter(Boolean).join(' ')

  // A destination with a href stays a real link; only a plain click is owned (cf: tabbar-modified-click).
  function onItemClick(event: MouseEvent, item: TabBarItem) {
    if (item.href) {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }
      event.preventDefault()
    }
    onnavigate?.(item.id)
  }
</script>

<nav class={classes} aria-label={label} {...$$restProps}>
  {#each items as item (item.id)}
    {#if item.href}
      <a
        class="strand-tabbar__item"
        href={item.href}
        aria-current={item.id === current ? 'page' : undefined}
        on:click={(e) => onItemClick(e, item)}
      >
        <slot name="icon" {item} />
        <span class="strand-tabbar__label">{item.label}</span>
      </a>
    {:else}
      <button
        type="button"
        class="strand-tabbar__item"
        aria-current={item.id === current ? 'page' : undefined}
        on:click={(e) => onItemClick(e, item)}
      >
        <slot name="icon" {item} />
        <span class="strand-tabbar__label">{item.label}</span>
      </button>
    {/if}
  {/each}
</nav>

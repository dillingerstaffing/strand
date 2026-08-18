<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Tabbed content switcher with keyboard navigation and ARIA tab pattern.

  @example
  ```svelte
  <script>
    import { Tabs } from '@dillingerstaffing/strand-svelte';
    let activeTab = 'overview';
    const tabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'details', label: 'Details' },
    ];
  </script>

  <Tabs {tabs} bind:activeTab>
    <div slot="overview"><p>Overview content</p></div>
    <div slot="details"><p>Details content</p></div>
  </Tabs>
  ```
-->
<script lang="ts" context="module">
  export interface TabItem {
    id: string
    label: string
  }
  let counter = 0
</script>

<script lang="ts">
  export let tabs: TabItem[] = []
  /** Active tab id; leave undefined to let the tabs own it. */
  export let activeTab: string | undefined = undefined
  /** Initial tab of uncontrolled tabs; the first tab by default. */
  export let defaultActiveTab: string | undefined = undefined
  export let onchange: ((id: string) => void) | undefined = undefined
  /** `automatic` selects as the arrows move focus; `manual` moves focus only and selects on Enter or Space. */
  export let activation: 'automatic' | 'manual' = 'automatic'
  /** `instrument` renders the strip as a mono uppercase readout. */
  export let variant: 'default' | 'instrument' = 'default'

  const base = `strand-tabs-${++counter}`
  let buttons: HTMLButtonElement[] = []
  let ownActive: string | undefined = defaultActiveTab ?? tabs[0]?.id
  $: active = activeTab ?? ownActive
  $: classes = ['strand-tabs', variant !== 'default' && `strand-tabs--${variant}`].filter(Boolean).join(' ')

  function select(id: string) {
    if (activeTab === undefined) ownActive = id
    onchange?.(id)
  }
  function handleKeyDown(e: KeyboardEvent) {
    const focused = buttons.findIndex((b) => b === e.target)
    const current = focused >= 0 ? focused : tabs.findIndex((t) => t.id === active)
    const n = tabs.length
    const next: Record<string, number> = { ArrowRight: (current + 1) % n, ArrowLeft: (current - 1 + n) % n, Home: 0, End: n - 1 }
    if (!(e.key in next)) return
    e.preventDefault()
    const index = next[e.key]
    const tab = tabs[index]
    if (!tab) return
    if (activation === 'automatic') select(tab.id)
    buttons[index]?.focus()
  }
</script>

<div class={classes} {...$$restProps}>
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div role="tablist" on:keydown={handleKeyDown}>
    {#each tabs as tab, index (tab.id)}
      {@const isActive = tab.id === active}
      <button
        bind:this={buttons[index]}
        id={`${base}-tab-${tab.id}`}
        role="tab"
        type="button"
        class="strand-tabs__tab"
        aria-selected={isActive ? 'true' : 'false'}
        aria-controls={`${base}-panel-${tab.id}`}
        tabindex={isActive ? 0 : -1}
        on:click={() => select(tab.id)}
      >
        {tab.label}
      </button>
    {/each}
  </div>
  {#each tabs as tab (tab.id)}
    {@const isActive = tab.id === active}
    <div id={`${base}-panel-${tab.id}`} role="tabpanel" aria-labelledby={`${base}-tab-${tab.id}`} hidden={!isActive} tabindex={0}>
      {#if isActive}
        <slot {tab} {isActive} />
      {/if}
    </div>
  {/each}
</div>

<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  export interface TabItem {
    id: string
    label: string
  }

  /** Tab definitions */
  export let tabs: TabItem[] = []
  /** Currently active tab id (controlled) */
  export let activeTab: string
  /** Called when active tab changes */
  export let onchange: ((id: string) => void) | undefined = undefined

  let tablistEl: HTMLDivElement

  function handleTabClick(id: string) {
    onchange?.(id)
  }

  function focusAndSelect(index: number) {
    const tab = tabs[index]
    if (tab) {
      onchange?.(tab.id)
      const buttons = tablistEl?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      buttons?.[index]?.focus()
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab)
    let nextIndex: number | null = null

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % tabs.length
        break
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = tabs.length - 1
        break
      default:
        return
    }

    e.preventDefault()
    focusAndSelect(nextIndex)
  }
</script>

<div class="strand-tabs" {...$$restProps}>
  <div bind:this={tablistEl} role="tablist" on:keydown={handleKeyDown}>
    {#each tabs as tab (tab.id)}
      {@const isActive = tab.id === activeTab}
      <button
        id={`tab-${tab.id}`}
        role="tab"
        type="button"
        class={['strand-tabs__tab', isActive && 'strand-tabs__tab--active'].filter(Boolean).join(' ')}
        aria-selected={isActive ? 'true' : 'false'}
        aria-controls={`panel-${tab.id}`}
        tabindex={isActive ? 0 : -1}
        on:click={() => handleTabClick(tab.id)}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  {#each tabs as tab (tab.id)}
    {@const isActive = tab.id === activeTab}
    <div
      id={`panel-${tab.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${tab.id}`}
      hidden={!isActive}
      tabindex={0}
    >
      {#if isActive}
        <slot name={tab.id} />
      {/if}
    </div>
  {/each}
</div>

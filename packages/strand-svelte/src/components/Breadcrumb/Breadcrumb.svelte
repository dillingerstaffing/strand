<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Hierarchical navigation path showing the current page location.

  @example
  ```svelte
  <script>
    import { Breadcrumb } from '@dillingerstaffing/strand-svelte';

    const items = [
      { label: 'Home', href: '/' },
      { label: 'Settings', href: '/settings' },
      { label: 'Profile' },
    ];
  </script>

  <Breadcrumb {items} />
  ```
-->
<script lang="ts" context="module">
  export interface BreadcrumbItem {
    label: string
    href?: string
    /** Called when the item is activated; without an href the item renders as a button. */
    onClick?: (e: MouseEvent) => void
  }
</script>

<script lang="ts">
  /** The path; the last item is the current page. */
  export let items: BreadcrumbItem[] = []
  /** Separator between items; the `separator` slot takes markup. */
  export let separator: string = '/'
  /** `instrument` renders the trail as a mono uppercase readout. */
  export let variant: 'default' | 'instrument' = 'default'
  /** Accessible name of the navigation landmark. */
  export let label: string = 'Breadcrumb'

  $: classes = ['strand-breadcrumb', variant !== 'default' && `strand-breadcrumb--${variant}`].filter(Boolean).join(' ')
</script>

<nav aria-label={label} class={classes} {...$$restProps}>
  <ol class="strand-breadcrumb__list">
    {#each items as item, index (item.label + index)}
      <li class="strand-breadcrumb__item">
        {#if index > 0}
          <span class="strand-breadcrumb__separator" aria-hidden="true"><slot name="separator">{separator}</slot></span>
        {/if}
        {#if index === items.length - 1}
          <span class="strand-breadcrumb__current" aria-current="page">{item.label}</span>
        {:else if item.href}
          <a href={item.href} class="strand-breadcrumb__link" on:click={item.onClick}>{item.label}</a>
        {:else}
          <button type="button" class="strand-breadcrumb__link" on:click={item.onClick}>{item.label}</button>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

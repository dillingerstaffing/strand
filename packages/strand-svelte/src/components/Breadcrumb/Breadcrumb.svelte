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
<script lang="ts">
  export interface BreadcrumbItem {
    label: string
    href?: string
  }

  /** Breadcrumb path items; last item is treated as current page */
  export let items: BreadcrumbItem[] = []
  /** Separator character between items */
  export let separator: string = '/'
</script>

<nav aria-label="Breadcrumb" class="strand-breadcrumb" {...$$restProps}>
  <ol class="strand-breadcrumb__list">
    {#each items as item, index (item.label + index)}
      <li class="strand-breadcrumb__item">
        {#if index > 0}
          <span class="strand-breadcrumb__separator" aria-hidden="true">{separator}</span>
        {/if}
        {#if index === items.length - 1}
          <span class="strand-breadcrumb__current" aria-current="page">{item.label}</span>
        {:else}
          <a href={item.href} class="strand-breadcrumb__link">{item.label}</a>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

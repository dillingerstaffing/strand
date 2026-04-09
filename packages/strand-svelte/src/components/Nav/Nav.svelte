<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Top-level navigation bar with logo slot, link items, actions, and responsive mobile menu.

  @example
  ```svelte
  <script>
    import { Nav } from '@dillingerstaffing/strand-svelte';

    const items = [
      { label: 'Home', href: '/', active: true },
      { label: 'About', href: '/about' },
    ];
  </script>

  <Nav {items} glass>
    <img slot="logo" src="/logo.svg" alt="Brand" />
  </Nav>
  ```
-->
<script lang="ts">
  export interface NavItem {
    label: string
    href: string
    active?: boolean
  }

  /** Navigation items */
  export let items: NavItem[] = []
  /** Glassmorphic variant (fixed, backdrop-filter, DL 11.5) */
  export let glass: boolean = false

  let menuOpen = false

  function toggleMenu() {
    menuOpen = !menuOpen
  }

  $: navClasses = ['strand-nav', glass && 'strand-nav--glass'].filter(Boolean).join(' ')
</script>

<nav class={navClasses} aria-label="Main navigation" {...$$restProps}>
  <div class="strand-nav__inner">
    {#if $$slots.logo}
      <div class="strand-nav__logo">
        <slot name="logo" />
      </div>
    {/if}

    <div class="strand-nav__items">
      {#each items as item (item.href)}
        <a
          href={item.href}
          class={['strand-nav__link', item.active && 'strand-nav__link--active'].filter(Boolean).join(' ')}
          aria-current={item.active ? 'page' : undefined}
        >
          {item.label}
        </a>
      {/each}
    </div>

    {#if $$slots.actions}
      <div class="strand-nav__actions">
        <slot name="actions" />
      </div>
    {/if}

    <button
      type="button"
      class="strand-nav__hamburger"
      aria-expanded={menuOpen ? 'true' : 'false'}
      aria-label={menuOpen ? 'Close menu' : 'Menu'}
      on:click={toggleMenu}
    >
      <span class="strand-nav__hamburger-icon" aria-hidden="true"></span>
    </button>
  </div>

  {#if menuOpen}
    <div class="strand-nav__mobile-menu">
      {#each items as item (item.href)}
        <a
          href={item.href}
          class={['strand-nav__mobile-link', item.active && 'strand-nav__mobile-link--active'].filter(Boolean).join(' ')}
          aria-current={item.active ? 'page' : undefined}
        >
          {item.label}
        </a>
      {/each}
    </div>
  {/if}
</nav>

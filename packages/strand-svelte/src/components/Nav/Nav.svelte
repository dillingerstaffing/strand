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
<script lang="ts" context="module">
  export interface NavItem {
    label: string
    href: string
    active?: boolean
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  /** Navigation items */
  export let items: NavItem[] = []
  /** Glassmorphic variant (fixed, backdrop-filter, DL 11.5) */
  export let glass: boolean = false
  /** Render the hamburger and its slide-down panel below the md breakpoint. */
  export let mobileMenu: boolean = true
  /** Open state of the mobile menu; bind it to control it, or leave it to the nav */
  export let menuOpen: boolean = false
  /** Called with the next open state whenever the hamburger is pressed */
  export let onmenutoggle: ((open: boolean) => void) | undefined = undefined

  function toggleMenu() {
    menuOpen = !menuOpen
    onmenutoggle?.(menuOpen)
  }

  function syncGlassClass(isGlass: boolean) {
    if (typeof document !== 'undefined') {
      if (isGlass) {
        document.body.classList.add('strand-glass-nav-active')
      } else {
        document.body.classList.remove('strand-glass-nav-active')
      }
    }
  }

  onMount(() => syncGlassClass(glass))
  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('strand-glass-nav-active')
    }
  })
  $: syncGlassClass(glass)

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

    <!-- Not rendered rather than hidden: a surface that has declared it has no
         mobile menu should not ship the button that opens one. -->
    {#if mobileMenu}
      <button
        type="button"
        class="strand-nav__hamburger"
        aria-expanded={menuOpen ? 'true' : 'false'}
        aria-label={menuOpen ? 'Close menu' : 'Menu'}
        on:click={toggleMenu}
      >
        <span class="strand-nav__hamburger-icon" aria-hidden="true"></span>
      </button>
    {/if}
  </div>

  {#if mobileMenu && menuOpen}
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

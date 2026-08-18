<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Top-level navigation bar with logo slot, link items, actions, and responsive mobile menu.

  @example
  ```vue
  <script setup>
  import { Nav } from '@dillingerstaffing/strand-vue';

  const items = [
    { label: 'Home', href: '/', active: true },
    { label: 'About', href: '/about' },
  ];
  </script>

  <template>
    <Nav :items="items" glass>
      <template #logo>
        <img src="/logo.svg" alt="Brand" />
      </template>
    </Nav>
  </template>
  ```
-->
<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'

export interface NavItem {
  label: string
  href: string
  active?: boolean
}

export interface NavProps {
  /** Navigation items */
  items?: NavItem[]
  /** Glassmorphic variant (fixed, backdrop-filter, DL 11.5) */
  glass?: boolean
  /** Render the hamburger and its slide-down panel below the md breakpoint. */
  mobileMenu?: boolean
  /** Controlled open state of the mobile menu; leave unset to let the nav own it */
  menuOpen?: boolean
}

const props = withDefaults(defineProps<NavProps>(), {
  items: () => [],
  glass: false,
  mobileMenu: true,
  menuOpen: undefined,
})

const emit = defineEmits<{
  (e: 'update:menuOpen', open: boolean): void
  (e: 'menuToggle', open: boolean): void
}>()

const ownOpen = ref(false)
const menuOpen = computed(() => props.menuOpen ?? ownOpen.value)

function toggleMenu() {
  const next = !menuOpen.value
  if (props.menuOpen === undefined) ownOpen.value = next
  emit('update:menuOpen', next)
  emit('menuToggle', next)
}

function syncGlassClass(isGlass: boolean) {
  if (isGlass) {
    document.body.classList.add('strand-glass-nav-active')
  } else {
    document.body.classList.remove('strand-glass-nav-active')
  }
}

onMounted(() => syncGlassClass(props.glass))
onUnmounted(() => document.body.classList.remove('strand-glass-nav-active'))
watch(() => props.glass, syncGlassClass)

const classes = computed(() => ['strand-nav', props.glass && 'strand-nav--glass'].filter(Boolean).join(' '))
</script>

<template>
  <nav :class="classes" aria-label="Main navigation">
    <div class="strand-nav__inner">
      <div v-if="$slots.logo" class="strand-nav__logo">
        <slot name="logo" />
      </div>

      <div class="strand-nav__items">
        <a
          v-for="item in items"
          :key="item.href"
          :href="item.href"
          :class="[
            'strand-nav__link',
            item.active && 'strand-nav__link--active',
          ].filter(Boolean).join(' ')"
          :aria-current="item.active ? 'page' : undefined"
        >
          {{ item.label }}
        </a>
      </div>

      <div v-if="$slots.actions" class="strand-nav__actions">
        <slot name="actions" />
      </div>

      <!-- Not rendered rather than hidden: a surface that has declared it has
           no mobile menu should not ship the button that opens one. -->
      <button
        v-if="mobileMenu"
        type="button"
        class="strand-nav__hamburger"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        :aria-label="menuOpen ? 'Close menu' : 'Menu'"
        @click="toggleMenu"
      >
        <span class="strand-nav__hamburger-icon" aria-hidden="true" />
      </button>
    </div>

    <div v-if="mobileMenu && menuOpen" class="strand-nav__mobile-menu">
      <a
        v-for="item in items"
        :key="item.href"
        :href="item.href"
        :class="[
          'strand-nav__mobile-link',
          item.active && 'strand-nav__mobile-link--active',
        ].filter(Boolean).join(' ')"
        :aria-current="item.active ? 'page' : undefined"
      >
        {{ item.label }}
      </a>
    </div>
  </nav>
</template>

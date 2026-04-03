<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed, ref } from 'vue'

export interface NavItem {
  label: string
  href: string
  active?: boolean
}

export interface NavProps {
  /** Navigation items */
  items?: NavItem[]
}

const props = withDefaults(defineProps<NavProps>(), {
  items: () => [],
})

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

const classes = computed(() => ['strand-nav'].filter(Boolean).join(' '))
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

      <button
        type="button"
        class="strand-nav__hamburger"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        :aria-label="menuOpen ? 'Close menu' : 'Menu'"
        @click="toggleMenu"
      >
        <span class="strand-nav__hamburger-icon" aria-hidden="true" />
      </button>
    </div>

    <div v-if="menuOpen" class="strand-nav__mobile-menu">
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

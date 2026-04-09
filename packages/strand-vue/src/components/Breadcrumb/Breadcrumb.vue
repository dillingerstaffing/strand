<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Hierarchical navigation path showing the current page location.

  @example
  ```vue
  <script setup>
  import { Breadcrumb } from '@dillingerstaffing/strand-vue';

  const items = [
    { label: 'Home', href: '/' },
    { label: 'Settings', href: '/settings' },
    { label: 'Profile' },
  ];
  </script>

  <template>
    <Breadcrumb :items="items" />
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  /** Breadcrumb path items; last item is treated as current page */
  items: BreadcrumbItem[]
  /** Separator character between items */
  separator?: string
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: '/',
})

const classes = computed(() =>
  ['strand-breadcrumb'].filter(Boolean).join(' '),
)
</script>

<template>
  <nav aria-label="Breadcrumb" :class="classes">
    <ol class="strand-breadcrumb__list">
      <li
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="strand-breadcrumb__item"
      >
        <span
          v-if="index > 0"
          class="strand-breadcrumb__separator"
          aria-hidden="true"
        >
          {{ separator }}
        </span>
        <span
          v-if="index === items.length - 1"
          class="strand-breadcrumb__current"
          aria-current="page"
        >
          {{ item.label }}
        </span>
        <a
          v-else
          :href="item.href"
          class="strand-breadcrumb__link"
        >
          {{ item.label }}
        </a>
      </li>
    </ol>
  </nav>
</template>

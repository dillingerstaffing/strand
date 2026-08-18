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
  /** Called when the item is activated; without an href the item renders as a button. */
  onClick?: (e: MouseEvent) => void
}

export interface BreadcrumbProps {
  /** The path; the last item is the current page. */
  items: BreadcrumbItem[]
  /** Separator between items; the `separator` slot takes markup. */
  separator?: string
  /** `instrument` renders the trail as a mono uppercase readout. */
  variant?: 'default' | 'instrument'
  /** Accessible name of the navigation landmark. */
  label?: string
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: '/',
  variant: 'default',
  label: 'Breadcrumb',
})

const classes = computed(() => ['strand-breadcrumb', props.variant !== 'default' && `strand-breadcrumb--${props.variant}`].filter(Boolean).join(' '))
</script>

<template>
  <nav :aria-label="label" :class="classes">
    <ol class="strand-breadcrumb__list">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="strand-breadcrumb__item">
        <span v-if="index > 0" class="strand-breadcrumb__separator" aria-hidden="true"><slot name="separator">{{ separator }}</slot></span>
        <span v-if="index === items.length - 1" class="strand-breadcrumb__current" aria-current="page">{{ item.label }}</span>
        <a v-else-if="item.href" :href="item.href" class="strand-breadcrumb__link" @click="item.onClick">{{ item.label }}</a>
        <button v-else type="button" class="strand-breadcrumb__link" @click="item.onClick">{{ item.label }}</button>
      </li>
    </ol>
  </nav>
</template>

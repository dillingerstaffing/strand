<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Tabbed content switcher with keyboard navigation and ARIA tab pattern.

  @example
  ```vue
  <script setup>
  import { ref } from 'vue';
  import { Tabs } from '@dillingerstaffing/strand-vue';
  const activeTab = ref('overview');
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
  ];
  </script>

  <template>
    <Tabs :tabs="tabs" v-model:active-tab="activeTab">
      <template #overview><p>Overview content</p></template>
      <template #details><p>Details content</p></template>
    </Tabs>
  </template>
  ```
-->
<script setup lang="ts">
import { computed, ref } from 'vue'

export interface TabItem {
  id: string
  label: string
}

export interface TabsProps {
  /** Tab definitions (id + label only; content is provided via slots) */
  tabs: TabItem[]
  /** Currently active tab id (controlled) */
  activeTab: string
}

const props = defineProps<TabsProps>()

const emit = defineEmits<{
  (e: 'change', id: string): void
}>()

const tablistRef = ref<HTMLDivElement | null>(null)

const classes = computed(() => ['strand-tabs'].filter(Boolean).join(' '))

function focusAndSelect(index: number) {
  const tab = props.tabs[index]
  if (tab) {
    emit('change', tab.id)
    const buttons = tablistRef.value?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    buttons?.[index]?.focus()
  }
}

function handleKeyDown(event: KeyboardEvent) {
  const currentIndex = props.tabs.findIndex((t) => t.id === props.activeTab)
  let nextIndex: number | null = null

  switch (event.key) {
    case 'ArrowRight':
      nextIndex = (currentIndex + 1) % props.tabs.length
      break
    case 'ArrowLeft':
      nextIndex = (currentIndex - 1 + props.tabs.length) % props.tabs.length
      break
    case 'Home':
      nextIndex = 0
      break
    case 'End':
      nextIndex = props.tabs.length - 1
      break
    default:
      return
  }

  event.preventDefault()
  focusAndSelect(nextIndex)
}
</script>

<template>
  <div :class="classes">
    <div ref="tablistRef" role="tablist" @keydown="handleKeyDown">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :id="`tab-${tab.id}`"
        role="tab"
        type="button"
        :class="[
          'strand-tabs__tab',
          tab.id === activeTab && 'strand-tabs__tab--active',
        ].filter(Boolean).join(' ')"
        :aria-selected="tab.id === activeTab ? 'true' : 'false'"
        :aria-controls="`panel-${tab.id}`"
        :tabindex="tab.id === activeTab ? 0 : -1"
        @click="emit('change', tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      v-for="tab in tabs"
      :key="tab.id"
      :id="`panel-${tab.id}`"
      role="tabpanel"
      :aria-labelledby="`tab-${tab.id}`"
      :hidden="tab.id !== activeTab || undefined"
      :tabindex="0"
    >
      <slot :name="`panel-${tab.id}`" />
    </div>
  </div>
</template>

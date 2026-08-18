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
      <template #panel-overview><p>Overview content</p></template>
      <template #panel-details><p>Details content</p></template>
    </Tabs>
  </template>
  ```
-->
<script setup lang="ts">
import { computed, ref, useId } from 'vue'

export interface TabItem {
  id: string
  label: string
}

export interface TabsProps {
  tabs: TabItem[]
  /** Active tab id; leave unset to let the tabs own it. */
  activeTab?: string
  /** Initial tab of uncontrolled tabs; the first tab by default. */
  defaultActiveTab?: string
  /** `automatic` selects as the arrows move focus; `manual` moves focus only and selects on Enter or Space. */
  activation?: 'automatic' | 'manual'
  /** `instrument` renders the strip as a mono uppercase readout. */
  variant?: 'default' | 'instrument'
}

const props = withDefaults(defineProps<TabsProps>(), {
  activeTab: undefined,
  defaultActiveTab: undefined,
  activation: 'automatic',
  variant: 'default',
})

const emit = defineEmits<{
  (e: 'change', id: string): void
  (e: 'update:activeTab', id: string): void
}>()

const base = useId()
const buttons = ref<HTMLButtonElement[]>([])
const ownActive = ref(props.defaultActiveTab ?? props.tabs[0]?.id)
const active = computed(() => props.activeTab ?? ownActive.value)
const classes = computed(() => ['strand-tabs', props.variant !== 'default' && `strand-tabs--${props.variant}`].filter(Boolean).join(' '))

function select(id: string) {
  if (props.activeTab === undefined) ownActive.value = id
  emit('change', id)
  emit('update:activeTab', id)
}
function buttonFor(id: string) {
  return buttons.value.find((b) => b.dataset.tabId === id)
}
function onKeyDown(event: KeyboardEvent) {
  const focused = props.tabs.findIndex((t) => buttonFor(t.id) === event.target)
  const current = focused >= 0 ? focused : props.tabs.findIndex((t) => t.id === active.value)
  const n = props.tabs.length
  const next: Record<string, number> = { ArrowRight: (current + 1) % n, ArrowLeft: (current - 1 + n) % n, Home: 0, End: n - 1 }
  if (!(event.key in next)) return
  event.preventDefault()
  const tab = props.tabs[next[event.key]]
  if (!tab) return
  if (props.activation === 'automatic') select(tab.id)
  buttonFor(tab.id)?.focus()
}
</script>

<template>
  <div :class="classes">
    <div role="tablist" @keydown="onKeyDown">
      <button
        v-for="tab in tabs"
        :id="`${base}-tab-${tab.id}`"
        :key="tab.id"
        ref="buttons"
        role="tab"
        type="button"
        class="strand-tabs__tab"
        :data-tab-id="tab.id"
        :aria-selected="tab.id === active ? 'true' : 'false'"
        :aria-controls="`${base}-panel-${tab.id}`"
        :tabindex="tab.id === active ? 0 : -1"
        @click="select(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div v-for="tab in tabs" :id="`${base}-panel-${tab.id}`" :key="tab.id" role="tabpanel" :aria-labelledby="`${base}-tab-${tab.id}`" :hidden="tab.id !== active || undefined" :tabindex="0">
      <slot :name="`panel-${tab.id}`" />
    </div>
  </div>
</template>

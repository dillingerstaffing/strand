<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  The persistent viewport-anchored navigation an application shell takes on
  a touch viewport.

  Implements design-language.md 19.1.1, which is the CONDITION selecting
  between this and the hamburger in 19.1. Read it before using this: the
  commonest misuse is putting a tab bar on a content surface, where the
  hamburger is correct and this costs 76px of every screen forever.

  Not Tabs, which switches content panels inside one view (19.3). Not
  ActionDock either: a dock carries the one ACTION a view produces, this
  carries DESTINATIONS. 19.1.1 does NOT forbid the two coexisting -- it
  forbids stacking them into a wall and requires a surface wanting both to
  decide which belongs nearer the thumb. Mutually exclusive by state is a
  legal answer.

  Reserve the space it occupies with `strand-tabbar-offset` on the
  scrolling content, or the last item of every list sits underneath it.

  @example
  ```vue
  <TabBar
    :items="[
      { id: 'discover', label: 'Discover', href: '/discover' },
      { id: 'calendar', label: 'Calendar', href: '/calendar' },
      { id: 'people', label: 'People', href: '/people' },
    ]"
    :current="route"
    @navigate="setRoute"
  />
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

export interface TabBarItem {
  /** Stable identity, and what `navigate` emits. */
  id: string
  /** Visible label. Kept short: it wraps rather than truncating. */
  label: string
  /** Destination. Omit for a button-style item driven by `navigate`. */
  href?: string
}

interface Props {
  /** Three to five top-level destinations, per 19.1.1. */
  items: TabBarItem[]
  /** `id` of the current destination. Sets `aria-current="page"`. */
  current?: string
  /** Accessible name for the landmark. */
  label?: string
  /** Additional CSS class. */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  current: undefined,
  label: 'Primary',
  className: '',
})

// Attributes land on the nav explicitly rather than by Vue's automatic inheritance, so a consumer's id cannot end up on both the landmark and something inside it.
defineOptions({ inheritAttrs: false })

const emit = defineEmits<{ navigate: [id: string] }>()

const classes = computed(() =>
  ['strand-tabbar', props.className].filter(Boolean).join(' '),
)

// A destination with a href stays a real link; only a plain click is owned (cf: tabbar-modified-click).
function onItemClick(event: MouseEvent, item: TabBarItem) {
  if (item.href) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    event.preventDefault()
  }
  emit('navigate', item.id)
}
</script>

<template>
  <nav :class="classes" :aria-label="label" v-bind="$attrs">
    <component
      :is="item.href ? 'a' : 'button'"
      v-for="item in items"
      :key="item.id"
      class="strand-tabbar__item"
      :href="item.href"
      :type="item.href ? undefined : 'button'"
      :aria-current="item.id === current ? 'page' : undefined"
      @click="onItemClick($event, item)"
    >
      <span v-if="$slots.icon" class="strand-tabbar__icon" aria-hidden="true">
        <slot name="icon" :item="item" />
      </span>
      <span class="strand-tabbar__label">{{ item.label }}</span>
    </component>
  </nav>
</template>

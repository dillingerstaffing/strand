<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Search-and-jump overlay: a filtered list the user drives from the keyboard.

  Composes Dialog, so focus trapping, focus restoration, scroll lock and
  Escape dismissal are inherited rather than reimplemented here.

  Filtering and ranking belong to the CALLER. What lives here is the part
  that is easy to get subtly wrong: the combobox and listbox roles, the
  active-descendant wiring that lets a screen reader announce the highlighted
  row while focus stays in the text field, arrow selection with wrapping, and
  keeping the highlighted row inside the scroll viewport.

  @example
  ```vue
  <script setup>
  import { ref } from 'vue';
  import { CommandPalette } from '@dillingerstaffing/strand-vue';
  const open = ref(false);
  const query = ref('');
  </script>

  <template>
    <CommandPalette
      :open="open"
      :items="results"
      :query="query"
      placeholder="Jump to..."
      @close="open = false"
      @query-change="query = $event"
      @select="go($event)"
    />
  </template>
  ```
-->
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import Dialog from '../Dialog/Dialog.vue'

export interface CommandPaletteItem {
  /** Stable identity. Used for keys and for the active-descendant id. */
  id: string
  /** Primary text. This is what the user is scanning for. */
  label: string
  /** Secondary text shown beneath the label. */
  sublabel?: string
  /** Optional short trailing token, such as a category or shortcut hint. */
  badge?: string
}

export interface CommandPaletteProps {
  /** Whether the palette is open */
  open: boolean
  /** Items to show, already filtered and ranked by the caller */
  items: CommandPaletteItem[]
  /** Current search text */
  query: string
  /** Placeholder for the search field */
  placeholder?: string
  /** Shown when items is empty */
  emptyLabel?: string
  /** Accessible name for the palette */
  label?: string
}

const props = withDefaults(defineProps<CommandPaletteProps>(), {
  placeholder: 'Search...',
  emptyLabel: 'No matches',
  label: 'Search',
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'queryChange', value: string): void
  (e: 'select', item: CommandPaletteItem): void
}>()

let paletteIdCounter = 0
const baseId = `strand-command-palette-${++paletteIdCounter}`
const listboxId = `${baseId}-listbox`
const optionId = (index: number) => `${baseId}-option-${index}`

const active = ref(0)
const listRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

/** Wrap at both ends so the last item is one keypress from the first. */
function wrapIndex(index: number, delta: number, length: number): number {
  if (length <= 0) return 0
  return (((index + delta) % length) + length) % length
}

// A shorter list can leave the highlight past the end, which would make Enter select nothing.
watch(
  () => props.items,
  () => {
    active.value = 0
  },
)

// Reopening should not resume someone else's old position.
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) active.value = 0
  },
)

// Put the caret in the search field when the palette opens.
watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return
    await nextTick()
    requestAnimationFrame(() => {
      inputRef.value?.focus()
    })
  },
  // Immediate: a palette mounted already open must focus too, and a plain watch fires only on change (cf: command-palette).
  { immediate: true },
)

// Keyboard selection keeps the highlight in view (cf: command-palette).
watch(active, async (index) => {
  await nextTick()
  const list = listRef.value
  if (!list) return
  const el = list.querySelector<HTMLElement>(`#${CSS.escape(optionId(index))}`)
  // Guarded: scrollIntoView is absent outside a browser, and the scroll is a courtesy (cf: command-palette).
  if (typeof el?.scrollIntoView === 'function') {
    el.scrollIntoView({ block: 'nearest' })
  }
})

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    active.value = wrapIndex(active.value, 1, props.items.length)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    active.value = wrapIndex(active.value, -1, props.items.length)
    return
  }
  if (event.key === 'Home') {
    event.preventDefault()
    active.value = 0
    return
  }
  if (event.key === 'End') {
    event.preventDefault()
    active.value = Math.max(0, props.items.length - 1)
    return
  }
  if (event.key === 'Enter') {
    const item = props.items[active.value]
    // Enter on an empty result set must do nothing rather than throw while the user is mid-keystroke.
    if (!item) return
    event.preventDefault()
    emit('select', item)
  }
}

function onInput(event: Event) {
  emit('queryChange', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <Dialog
    :open="open"
    class="strand-command-palette"
    :aria-label="label"
    @close="emit('close')"
  >
    <div class="strand-command-palette__search">
      <svg
        class="strand-command-palette__icon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L14 14" />
      </svg>
      <input
        ref="inputRef"
        type="text"
        class="strand-command-palette__input"
        :value="query"
        :placeholder="placeholder"
        role="combobox"
        aria-expanded="true"
        :aria-controls="listboxId"
        :aria-activedescendant="items.length ? optionId(active) : undefined"
        aria-autocomplete="list"
        :aria-label="label"
        autocomplete="off"
        :spellcheck="false"
        @input="onInput"
        @keydown="handleKeyDown"
      />
    </div>

    <div
      ref="listRef"
      class="strand-command-palette__list"
      :id="listboxId"
      role="listbox"
      :aria-label="label"
    >
      <p v-if="items.length === 0" class="strand-command-palette__empty">
        {{ emptyLabel }}
      </p>
      <div
        v-for="(item, index) in items"
        :key="item.id"
        :id="optionId(index)"
        role="option"
        tabindex="-1"
        :aria-selected="index === active"
        :class="
          index === active
            ? 'strand-command-palette__option strand-command-palette__option--active'
            : 'strand-command-palette__option'
        "
        @mousemove="active = index"
        @click="emit('select', item)"
      >
        <span class="strand-command-palette__label">{{ item.label }}</span>
        <span v-if="item.sublabel" class="strand-command-palette__sublabel">
          {{ item.sublabel }}
        </span>
        <span v-if="item.badge" class="strand-command-palette__badge">
          {{ item.badge }}
        </span>
      </div>
    </div>
  </Dialog>
</template>

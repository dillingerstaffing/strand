<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Modal overlay with focus trapping, scroll lock, and backdrop click dismissal.

  @example
  ```vue
  <script setup>
  import { ref } from 'vue';
  import { Dialog } from '@dillingerstaffing/strand-vue';
  const isOpen = ref(false);
  </script>

  <template>
    <Dialog :open="isOpen" title="Confirm" @close="isOpen = false">
      <p>Are you sure?</p>
    </Dialog>
  </template>
  ```
-->
<script setup lang="ts">
import { computed, ref, watch, onUnmounted, nextTick } from 'vue'

export interface DialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Optional title rendered in the dialog header */
  title?: string
  /** Close when clicking the backdrop */
  closeOnOutsideClick?: boolean
  /** Close when pressing Escape */
  closeOnEscape?: boolean
  /**
   * Where the panel sits in the viewport. `center` is right for a
   * confirmation. `start` drops it under the reader's gaze, which is where
   * a search or command overlay belongs: centred, a fixed-height panel
   * straddles the fold on a short viewport and its input is the last thing
   * the eye reaches.
   */
  align?: 'center' | 'start'
  /**
   * Inner padding. The same ladder `Card` carries, at the same values.
   * `none` also clips content to the panel's radius, for panels whose
   * children carry their own inset (a query row, a scrolling list).
   */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Whether to render the close button. Set `false` for overlays whose
   * convention has no X and whose dismissal is Escape or the backdrop.
   * Escape and backdrop dismissal are unaffected.
   */
  dismissible?: boolean
}

const props = withDefaults(defineProps<DialogProps>(), {
  closeOnOutsideClick: true,
  closeOnEscape: true,
  align: 'center',
  padding: 'lg',
  dismissible: true,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const FOCUSABLE_SELECTOR =
  'a[href], button:not(:disabled), textarea:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'

let dialogIdCounter = 0
const titleId = `strand-dialog-title-${++dialogIdCounter}`

const panelRef = ref<HTMLDivElement | null>(null)
let previousFocus: Element | null = null
let originalOverflow = ''

const panelClasses = computed(() =>
  [
    'strand-dialog__panel',
    props.align === 'start' ? 'strand-dialog__panel--align-start' : '',
    `strand-dialog__panel--pad-${props.padding}`,
  ]
    .filter(Boolean)
    .join(' '),
)

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEscape) {
    event.stopPropagation()
    emit('close')
    return
  }

  if (event.key === 'Tab') {
    const panel = panelRef.value
    if (!panel) return

    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }
}

function handleBackdropClick(event: MouseEvent) {
  if (props.closeOnOutsideClick && event.target === event.currentTarget) {
    emit('close')
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previousFocus = document.activeElement
      originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      await nextTick()
      const panel = panelRef.value
      if (panel) {
        const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        if (focusable.length > 0) {
          focusable[0].focus()
        } else {
          panel.focus()
        }
      }
    } else {
      document.body.style.overflow = originalOverflow
      if (previousFocus && previousFocus instanceof HTMLElement) {
        previousFocus.focus()
      }
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (props.open) {
    document.body.style.overflow = originalOverflow
  }
})
</script>

<template>
  <div
    v-if="open"
    class="strand-dialog__backdrop"
    @click="handleBackdropClick"
    @keydown="handleKeyDown"
  >
    <div
      ref="panelRef"
      :class="panelClasses"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="title ? titleId : undefined"
      :tabindex="-1"
    >
      <div v-if="title" class="strand-dialog__header">
        <h2 :id="titleId" class="strand-dialog__title">
          {{ title }}
        </h2>
      </div>
      <button
        v-if="dismissible"
        type="button"
        class="strand-dialog__close"
        aria-label="Close"
        @click="emit('close')"
      >
        &#215;
      </button>
      <div class="strand-dialog__body">
        <slot />
      </div>
    </div>
  </div>
</template>

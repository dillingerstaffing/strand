<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Syntax-highlighted code display with optional language label and copy-to-clipboard.

  @example
  ```vue
  <script setup>
  import { CodeBlock } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <CodeBlock code="const x = 42;" language="js" copyable />
  </template>
  ```
-->
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

interface Props {
  /** The code content to display */
  code: string
  /** Optional language label (e.g. "html", "css", "bash") */
  language?: string
  /** Additional CSS class */
  className?: string
  /**
   * Render the one-click copy-to-clipboard button. Defaults to true so
   * every CodeBlock is copyable out of the box; pass false to opt out
   * for blocks that should not advertise a copy affordance.
   */
  copyable?: boolean
}

const COPIED_DURATION_MS = 1500

const props = withDefaults(defineProps<Props>(), {
  className: '',
  copyable: true,
})

const classes = computed(() =>
  ['strand-code-block', props.className].filter(Boolean).join(' '),
)

const copied = ref(false)
let timer: number | null = null

onBeforeUnmount(() => {
  if (timer !== null) window.clearTimeout(timer)
})

async function handleCopy() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.code)
    } else {
      const ta = document.createElement('textarea')
      ta.value = props.code
      ta.setAttribute('readonly', '')
      ta.style.position = 'absolute'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    if (timer !== null) window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      copied.value = false
    }, COPIED_DURATION_MS)
  } catch {
    // Ignore copy failures.
  }
}
</script>

<template>
  <div :class="classes" :data-strand-copy="copyable ? '' : undefined" v-bind="$attrs">
    <span v-if="language" class="strand-code-block__label">{{ language }}</span>
    <pre class="strand-code-block__pre"><code>{{ code }}</code></pre>
    <button
      v-if="copyable"
      type="button"
      :class="['strand-code-block__copy', copied ? 'strand-code-block__copy--copied' : '']"
      :aria-label="copied ? 'Copied' : 'Copy code to clipboard'"
      @click="handleCopy"
    >
      <svg
        class="strand-code-block__copy-icon strand-code-block__copy-icon--clipboard"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M6 3 V2 a1 1 0 0 1 1-1 h2 a1 1 0 0 1 1 1 v1 M5 3 h6 a1 1 0 0 1 1 1 v9 a1 1 0 0 1 -1 1 h-6 a1 1 0 0 1 -1 -1 v-9 a1 1 0 0 1 1 -1 z" />
      </svg>
      <svg
        class="strand-code-block__copy-icon strand-code-block__copy-icon--check"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M3 8 l3 3 l7 -7" />
      </svg>
    </button>
  </div>
</template>

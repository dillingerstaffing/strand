<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  The list an instrument returns for a query.

  Three states, not two, deliberately: a failed request and an empty
  result are different answers and the user is owed the difference.
  "0 matches detected" means the instrument ran; an error means it did not.
-->
<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  /** Instrument voice: "12 matches detected". */
  count?: string
  visible?: boolean
  state?: 'results' | 'empty' | 'error'
  stateTitle?: string
  stateHint?: string
  retryLabel?: string
  /** Renders the retry control in the error state. */
  retryable?: boolean
  label?: string
  className?: string
}
const props = withDefaults(defineProps<Props>(), {
  count: undefined, visible: true, state: 'results',
  stateTitle: undefined, stateHint: undefined, retryLabel: 'Retry',
  retryable: false, label: 'Results', className: '',
})
defineOptions({ inheritAttrs: false })
const emit = defineEmits<{ retry: [] }>()
const classes = computed(() =>
  ['strand-results-panel', props.className].filter(Boolean).join(' '),
)
</script>

<template>
  <section :class="classes" :aria-label="label" :hidden="!visible" v-bind="$attrs">
    <!-- Polite, not assertive: a count re-announcing on every keystroke of
         a live search interrupts more than it informs. -->
    <div v-if="count" class="strand-results-panel__count" aria-live="polite">{{ count }}</div>
    <div v-if="state === 'results'" class="strand-results-panel__items"><slot /></div>
    <div v-else class="strand-results-panel__state">
      <div v-if="stateTitle" class="strand-results-panel__state-title">{{ stateTitle }}</div>
      <div v-if="stateHint" class="strand-results-panel__state-hint">{{ stateHint }}</div>
      <button
        v-if="state === 'error' && retryable"
        type="button"
        class="strand-results-panel__error-link"
        @click="emit('retry')"
      >{{ retryLabel }}</button>
    </div>
  </section>
</template>

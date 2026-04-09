<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Compact label for categorization, filtering, or status display.

  @example
  ```vue
  <script setup>
  import { Tag } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Tag variant="solid" status="teal" removable @remove="handleRemove">
      Active
    </Tag>
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Visual style variant */
  variant?: 'solid' | 'outlined'
  /** Color status */
  status?: 'default' | 'teal' | 'blue' | 'amber' | 'red'
  /** Show remove button */
  removable?: boolean
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  status: 'default',
  removable: false,
  className: '',
})

const emit = defineEmits<{
  remove: []
}>()

const classes = computed(() =>
  [
    'strand-tag',
    `strand-tag--${props.variant}`,
    `strand-tag--${props.status}`,
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <span :class="classes" v-bind="$attrs">
    <span class="strand-tag__text"><slot /></span>
    <button
      v-if="removable"
      type="button"
      class="strand-tag__remove"
      aria-label="Remove"
      @click="emit('remove')"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 3l6 6M9 3l-6 6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </span>
</template>

<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Centered max-width wrapper for constraining page content.

  @example
  ```vue
  <script setup>
  import { Container } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Container size="default">
      <p>Content constrained to default max width.</p>
    </Container>
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Max-width constraint */
  size?: 'narrow' | 'default' | 'wide' | 'full'
  /** Root element */
  as?: string
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  as: 'div',
  className: '',
})

const classes = computed(() =>
  [
    'strand-container',
    `strand-container--${props.size}`,
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <component :is="as" :class="classes" v-bind="$attrs">
    <slot />
  </component>
</template>

<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Page-level content region with padding, background, and optional top border.

  @example
  ```vue
  <script setup>
  import { Section, Container } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Section variant="hero" background="recessed">
      <Container>
        <h1>Hero Section</h1>
      </Container>
    </Section>
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Padding variant */
  variant?: 'standard' | 'hero' | 'compact'
  /** Surface background */
  background?: 'primary' | 'elevated' | 'recessed'
  /** Top border separator */
  borderTop?: boolean
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'standard',
  background: 'primary',
  borderTop: false,
  className: '',
})

const classes = computed(() =>
  [
    'strand-section',
    `strand-section--${props.variant}`,
    `strand-section--bg-${props.background}`,
    props.borderTop && 'strand-section--border-top',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <section :class="classes" v-bind="$attrs">
    <slot />
  </section>
</template>

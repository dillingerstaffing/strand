<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Styled anchor element with external-link handling and visual variants.

  @example
  ```vue
  <script setup>
  import { Link } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Link href="/docs" variant="cta">Read the docs</Link>
    <Link href="https://example.com" external>External site</Link>
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** URL destination */
  href: string
  /** Opens in new tab with rel="noopener noreferrer" */
  external?: boolean
  /** Style variant */
  variant?: 'default' | 'cta' | 'mono'
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  external: false,
  variant: 'default',
  className: '',
})

const classes = computed(() =>
  ['strand-link', props.variant !== 'default' && `strand-link--${props.variant}`, props.className].filter(Boolean).join(' '),
)
</script>

<template>
  <a
    :href="href"
    :class="classes"
    v-bind="{
      ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
      ...$attrs,
    }"
  >
    <slot />
  </a>
</template>

<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** The code content to display */
  code: string
  /** Optional language label (e.g. "html", "css", "bash") */
  language?: string
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
})

const classes = computed(() =>
  ['strand-code-block', props.className]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div :class="classes" v-bind="$attrs">
    <span v-if="language" class="strand-code-block__label">{{ language }}</span>
    <pre class="strand-code-block__pre"><code>{{ code }}</code></pre>
  </div>
</template>

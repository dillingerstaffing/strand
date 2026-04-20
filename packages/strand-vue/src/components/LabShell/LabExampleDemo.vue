<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padNone?: boolean
  recessed?: boolean
  className?: string
}
const props = withDefaults(defineProps<Props>(), {
  padNone: false,
  recessed: false,
  className: '',
})

const classes = computed(() =>
  [
    'strand-ref-example__demo',
    props.padNone ? 'strand-ref-example__demo--pad-none' : '',
    props.recessed ? 'strand-ref-example__demo--recessed' : '',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div :class="classes" v-bind="$attrs"><slot /></div>
</template>

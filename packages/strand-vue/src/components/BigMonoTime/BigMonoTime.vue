<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!-- An oversized monospace clock readout. tabular-nums is why 06:45 and
     11:11 are the same width and a column of times does not ripple. Not
     DataReadout, which pairs a label with a value; this is the value alone
     at display scale and the rail supplies the context. -->
<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  value: string
  until?: string
  separator?: string
  size?: 'sm' | 'md' | 'lg'
  /** Machine-readable value; supplied means it renders as <time>. */
  dateTime?: string
  className?: string
}
const props = withDefaults(defineProps<Props>(), {
  until: undefined, separator: '–', size: 'md', dateTime: undefined, className: '',
})
defineOptions({ inheritAttrs: false })
const classes = computed(() =>
  ['strand-big-mono-time', props.size !== 'md' ? `strand-big-mono-time--${props.size}` : '', props.className]
    .filter(Boolean).join(' '),
)
</script>
<template>
  <component :is="dateTime ? 'time' : 'span'" :class="classes" :datetime="dateTime" v-bind="$attrs">
    {{ value }}<!-- aria-hidden: the rail says "to", a dash read aloud mid-time does not
    --><span v-if="until" class="strand-big-mono-time__sep" aria-hidden="true">{{ separator }}</span><template v-if="until">{{ until }}</template>
  </component>
</template>

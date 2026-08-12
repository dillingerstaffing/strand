<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  A month laid out as a well plate: seven columns because a week has seven
  days, and as many rows as the month needs.

  Implements the `well-plate` production (design-language.md Part XI-B
  11.10) and 10.6 Bounded Cells. A day is a bounded cell: its size comes
  from the structure rather than from its contents, so it declares a
  capacity and states the rest as a count. It never clips silently and
  never grows its row.

  Keyboard: the ARIA grid pattern (14.5). The whole grid is ONE tab stop
  with a roving tabindex; arrows move by day and week, Home and End move
  within the week, PageUp and PageDown change month.

  @example
  ```vue
  <CalendarGrid
    :year="2026" :month="7" label="August 2026"
    v-model:selected="selected" :capacity="2" :counts="countsByDay"
    @month-change="onMonthChange"
  >
    <template #day="{ day }"><EventChips :iso="day.iso" /></template>
  </CalendarGrid>
  ```
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  buildMonthGrid,
  isoOf,
  type CalendarDay,
} from './buildMonthGrid.js'

interface Props {
  year: number
  month: number
  weekStartsOn?: 0 | 1
  /** Accessible name, e.g. "August 2026". A grid with no name is announced
      as an unlabelled table of numbers. */
  label: string
  dayNames?: string[]
  dayNamesLong?: string[]
  selected?: string
  /** The day treated as today. Pass it explicitly for a deterministic
      server render. */
  today?: Date
  /** 10.6's declared capacity, measured at the SMALLEST sanctioned size. */
  capacity?: number
  counts?: Record<string, number>
  className?: string
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES_LONG = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]

const props = withDefaults(defineProps<Props>(), {
  weekStartsOn: 0,
  dayNames: undefined,
  dayNamesLong: undefined,
  selected: undefined,
  today: undefined,
  capacity: 2,
  counts: undefined,
  className: '',
})

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  select: [iso: string]
  monthChange: [year: number, month: number]
}>()

const gridEl = ref<HTMLElement | null>(null)
const focused = ref<string | undefined>(undefined)

const weeks = computed(() =>
  buildMonthGrid(props.year, props.month, props.weekStartsOn),
)
const flat = computed(() => weeks.value.flat())
const todayIso = computed(() => isoOf(props.today ?? new Date()))
const names = computed(() => props.dayNames ?? DAY_NAMES)
const namesLong = computed(() => props.dayNamesLong ?? DAY_NAMES_LONG)
const ordered = computed(() =>
  Array.from({ length: 7 }, (_, i) => (i + props.weekStartsOn) % 7),
)

// The roving tabindex's holder: the selection when it is in view, else the
// first day of the month, so a keyboard user arrives somewhere meaningful
// rather than on a trailing day of the previous month.
const rovingIso = computed(() => {
  if (focused.value) return focused.value
  if (props.selected && flat.value.some((d) => d.iso === props.selected)) {
    return props.selected
  }
  return flat.value.find((d) => !d.adjacent)?.iso
})

const classes = computed(() =>
  ['strand-calendar-grid', props.className].filter(Boolean).join(' '),
)

function move(from: CalendarDay, deltaDays: number) {
  const next = new Date(
    from.date.getFullYear(),
    from.date.getMonth(),
    from.date.getDate() + deltaDays,
  )
  const iso = isoOf(next)
  focused.value = iso
  if (next.getMonth() !== props.month || next.getFullYear() !== props.year) {
    emit('monthChange', next.getFullYear(), next.getMonth())
  }
  requestAnimationFrame(() => {
    gridEl.value
      ?.querySelector<HTMLElement>(`[data-iso="${iso}"]`)
      ?.focus()
  })
}

function onKeyDown(event: KeyboardEvent, day: CalendarDay) {
  const deltas: Record<string, number> = {
    ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7,
  }
  if (event.key in deltas) {
    event.preventDefault()
    move(day, deltas[event.key])
    return
  }
  // Home and End are within the WEEK, per the grid pattern. The month is
  // PageUp and PageDown's job.
  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    const offset = (day.date.getDay() - props.weekStartsOn + 7) % 7
    move(day, event.key === 'Home' ? -offset : 6 - offset)
    return
  }
  if (event.key === 'PageUp' || event.key === 'PageDown') {
    event.preventDefault()
    const target = new Date(
      props.year,
      props.month + (event.key === 'PageUp' ? -1 : 1),
      1,
    )
    focused.value = undefined
    emit('monthChange', target.getFullYear(), target.getMonth())
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('select', day.iso)
  }
}

const hiddenFor = (iso: string) =>
  Math.max(0, (props.counts?.[iso] ?? 0) - props.capacity)

const dayClasses = (day: CalendarDay) =>
  [
    'strand-calendar-grid__day',
    day.adjacent ? 'strand-calendar-grid__day--adjacent' : '',
    day.iso === todayIso.value ? 'strand-calendar-grid__day--today' : '',
    day.iso === props.selected ? 'strand-calendar-grid__day--selected' : '',
  ]
    .filter(Boolean)
    .join(' ')
</script>

<template>
  <div ref="gridEl" :class="classes" role="grid" :aria-label="label" v-bind="$attrs">
    <div class="strand-calendar-grid__header" role="row">
      <!-- The visible text is an abbreviation, and "Mon" read aloud is not
           a weekday. `abbr` is only valid on <th> and does nothing here; a
           visually-hidden full name survives translation tools and user
           stylesheets that aria-label does not. -->
      <span
        v-for="i in ordered"
        :key="i"
        class="strand-calendar-grid__axis"
        role="columnheader"
      >
        <span aria-hidden="true">{{ names[i] }}</span>
        <span class="strand-sr-only">{{ namesLong[i] }}</span>
      </span>
    </div>

    <div
      v-for="week in weeks"
      :key="week[0].iso"
      class="strand-calendar-grid__week"
      role="row"
    >
      <div
        v-for="day in week"
        :key="day.iso"
        :class="dayClasses(day)"
        role="gridcell"
        :data-iso="day.iso"
        :tabindex="day.iso === rovingIso ? 0 : -1"
        :aria-selected="day.iso === selected ? 'true' : undefined"
        :aria-current="day.iso === todayIso ? 'date' : undefined"
        @keydown="onKeyDown($event, day)"
        @click="emit('select', day.iso)"
        @focus="focused = day.iso"
      >
        <span class="strand-calendar-grid__date">{{ day.day }}</span>
        <div v-if="$slots.day" class="strand-calendar-grid__content">
          <slot name="day" :day="day" />
        </div>
        <span
          v-if="hiddenFor(day.iso) > 0"
          class="strand-calendar-grid__remainder"
        >+{{ hiddenFor(day.iso) }} more</span>
      </div>
    </div>
  </div>
</template>

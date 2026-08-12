<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
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
  ```svelte
  <script>
    import { CalendarGrid } from '@dillingerstaffing/strand-svelte'
  </script>

  <CalendarGrid
    year={2026} month={7} label="August 2026"
    {selected} capacity={2} {counts}
    onselect={setSelected} onmonthchange={goToMonth}
  >
    <svelte:fragment slot="day" let:day><EventChips iso={day.iso} /></svelte:fragment>
  </CalendarGrid>
  ```
-->
<script lang="ts" context="module">
  export interface CalendarDay {
    date: Date
    day: number
    adjacent: boolean
    iso: string
  }

  const pad = (n: number) => String(n).padStart(2, '0')
  export const isoOf = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

  /**
   * The weeks of a month, including the leading and trailing days needed
   * to complete the first and last weeks.
   *
   * Dates are constructed from local y/m/d rather than parsed from
   * strings: new Date("2026-08-01") parses as UTC midnight and renders as
   * the previous day for anyone west of Greenwich.
   */
  export function buildMonthGrid(
    year: number,
    month: number,
    weekStartsOn = 0,
  ): CalendarDay[][] {
    const toDay = (d: Date): CalendarDay => ({
      date: d,
      day: d.getDate(),
      adjacent: d.getMonth() !== month,
      iso: isoOf(d),
    })

    const lead = (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7
    const cursor = new Date(year, month, 1 - lead)
    // Day 0 of the next month is the last day of this one. Comparing
    // against it rather than against the week's month is what stops a
    // month ending exactly on a week boundary from growing an extra row.
    const lastOfMonth = new Date(year, month + 1, 0)
    const weeks: CalendarDay[][] = []

    for (;;) {
      const week: CalendarDay[] = []
      for (let i = 0; i < 7; i++) {
        week.push(
          toDay(
            new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()),
          ),
        )
        cursor.setDate(cursor.getDate() + 1)
      }
      weeks.push(week)
      if (week[6].date >= lastOfMonth) break
    }
    return weeks
  }
</script>

<script lang="ts">
  export let year: number
  export let month: number
  export let weekStartsOn: 0 | 1 = 0

  /** Accessible name, e.g. "August 2026". A grid with no name is announced
      as an unlabelled table of numbers. */
  export let label: string

  export let dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  export let dayNamesLong: string[] = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ]
  export let selected: string | undefined = undefined

  /** The day treated as today. Pass it explicitly for a deterministic
      server render. */
  export let today: Date | undefined = undefined

  /** 10.6's declared capacity, measured at the SMALLEST sanctioned size. */
  export let capacity: number = 2
  export let counts: Record<string, number> | undefined = undefined

  export let onselect: ((iso: string) => void) | undefined = undefined
  export let onmonthchange: ((year: number, month: number) => void) | undefined =
    undefined

  /** Additional CSS class, MERGED with the component's own. Explicit prop
      rather than $$restProps, which spreads AFTER the class attribute and
      would REPLACE the grid's own class outright. */
  let className: string = ''
  export { className as class }

  let gridEl: HTMLElement | null = null
  let focused: string | undefined = undefined

  $: weeks = buildMonthGrid(year, month, weekStartsOn)
  $: flat = weeks.flat()
  $: todayIso = isoOf(today ?? new Date())
  $: ordered = Array.from({ length: 7 }, (_, i) => (i + weekStartsOn) % 7)
  $: classes = ['strand-calendar-grid', className].filter(Boolean).join(' ')

  // The roving tabindex's holder: the selection when it is in view, else
  // the first day of the month, so a keyboard user arrives somewhere
  // meaningful rather than on a trailing day of the previous month.
  $: rovingIso =
    focused ??
    (selected && flat.some((d) => d.iso === selected)
      ? selected
      : flat.find((d) => !d.adjacent)?.iso)

  function move(from: CalendarDay, deltaDays: number) {
    const next = new Date(
      from.date.getFullYear(),
      from.date.getMonth(),
      from.date.getDate() + deltaDays,
    )
    const iso = isoOf(next)
    focused = iso
    if (next.getMonth() !== month || next.getFullYear() !== year) {
      onmonthchange?.(next.getFullYear(), next.getMonth())
    }
    requestAnimationFrame(() => {
      gridEl?.querySelector<HTMLElement>(`[data-iso="${iso}"]`)?.focus()
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
      const offset = (day.date.getDay() - weekStartsOn + 7) % 7
      move(day, event.key === 'Home' ? -offset : 6 - offset)
      return
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault()
      const target = new Date(year, month + (event.key === 'PageUp' ? -1 : 1), 1)
      focused = undefined
      onmonthchange?.(target.getFullYear(), target.getMonth())
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onselect?.(day.iso)
    }
  }

  const hiddenFor = (iso: string, c: Record<string, number> | undefined, cap: number) =>
    Math.max(0, (c?.[iso] ?? 0) - cap)

  const dayClasses = (day: CalendarDay, sel: string | undefined, tIso: string) =>
    [
      'strand-calendar-grid__day',
      day.adjacent ? 'strand-calendar-grid__day--adjacent' : '',
      day.iso === tIso ? 'strand-calendar-grid__day--today' : '',
      day.iso === sel ? 'strand-calendar-grid__day--selected' : '',
    ]
      .filter(Boolean)
      .join(' ')
</script>

<div bind:this={gridEl} class={classes} role="grid" aria-label={label} {...$$restProps}>
  <div class="strand-calendar-grid__header" role="row">
    {#each ordered as i (i)}
      <!-- `abbr` is only valid on <th> and does nothing on a role=columnheader
           div. A visually-hidden full name survives translation tools and
           user stylesheets that aria-label does not. -->
      <span class="strand-calendar-grid__axis" role="columnheader">
        <span aria-hidden="true">{dayNames[i]}</span>
        <span class="strand-sr-only">{dayNamesLong[i]}</span>
      </span>
    {/each}
  </div>

  {#each weeks as week (week[0].iso)}
    <div class="strand-calendar-grid__week" role="row">
      {#each week as day (day.iso)}
        <div
          class={dayClasses(day, selected, todayIso)}
          role="gridcell"
          data-iso={day.iso}
          tabindex={day.iso === rovingIso ? 0 : -1}
          aria-selected={day.iso === selected ? 'true' : undefined}
          aria-current={day.iso === todayIso ? 'date' : undefined}
          on:keydown={(e) => onKeyDown(e, day)}
          on:click={() => onselect?.(day.iso)}
          on:focus={() => (focused = day.iso)}
        >
          <span class="strand-calendar-grid__date">{day.day}</span>
          {#if $$slots.day}
            <div class="strand-calendar-grid__content">
              <slot name="day" {day} />
            </div>
          {/if}
          {#if hiddenFor(day.iso, counts, capacity) > 0}
            <span class="strand-calendar-grid__remainder">
              +{hiddenFor(day.iso, counts, capacity)} more
            </span>
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>

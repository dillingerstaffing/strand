/*! Strand Vue | MIT License | dillingerstaffing.com */

// The month arithmetic, in its own module because Vue's <script setup> cannot
// carry exports and because a pure function is worth testing without mounting
// anything.

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
 * The weeks of a month, including the leading and trailing days needed to
 * complete the first and last weeks.
 *
 * Dates are constructed from local y/m/d rather than parsed from strings:
 * new Date("2026-08-01") parses as UTC midnight and renders as the
 * previous day for anyone west of Greenwich.
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
  // Day 0 of the next month is the last day of this one. Comparing against
  // it rather than against the week's month is what stops a month ending
  // exactly on a week boundary from growing a spurious extra row.
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

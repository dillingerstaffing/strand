/*! Strand svelte | MIT License | dillingerstaffing.com */

// GEOMETRY belongs to the layout tier in real Chromium. This file mirrors the
// canonical Preact assertions so the ports cannot drift: the date arithmetic,
// the ARIA grid contract, and 10.6's counted remainder.

import { describe, expect, it, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import CalendarGrid, { buildMonthGrid } from './CalendarGrid.svelte'

const BASE = {
  year: 2026,
  month: 7,
  label: 'August 2026',
  today: new Date(2026, 7, 12),
}

describe('buildMonthGrid', () => {
  it('pads the first week with the previous month days', () => {
    const weeks = buildMonthGrid(2026, 7)
    expect(weeks[0]).toHaveLength(7)
    expect(weeks[0][0].adjacent).toBe(true)
    expect(weeks[0][6].day).toBe(1)
  })

  it('adds no leading week when the month starts on the week start', () => {
    const weeks = buildMonthGrid(2026, 1, 0)
    expect(weeks[0][0].day).toBe(1)
    expect(weeks[0][0].adjacent).toBe(false)
  })

  // The bug this caught in the canonical implementation: February 2026 is 28
  // days starting on the week start, so it fills exactly four weeks, and a
  // termination test based on the week's month grew a fifth row of March.
  it('gives a month ending on a week boundary no spurious extra row', () => {
    expect(buildMonthGrid(2026, 1).length).toBe(4)
    expect(buildMonthGrid(2026, 7).length).toBe(6)
  })

  it('holds its invariants for every month across seven years, both week starts', () => {
    let checked = 0
    for (let y = 2024; y <= 2030; y++) {
      for (let m = 0; m < 12; m++) {
        for (const ws of [0, 1] as const) {
          const weeks = buildMonthGrid(y, m, ws)
          const own = weeks.flat().filter((d) => !d.adjacent)
          expect(weeks.flat()).toHaveLength(weeks.length * 7)
          expect(own).toHaveLength(new Date(y, m + 1, 0).getDate())
          for (const week of weeks) expect(week[0].date.getDay()).toBe(ws)
          checked++
        }
      }
    }
    // An empty sweep reporting success is the failure this guards against.
    expect(checked).toBe(7 * 12 * 2)
  })

  it('emits an iso key matching the local date, not a UTC shift', () => {
    for (const day of buildMonthGrid(2026, 7).flat()) {
      const [y, m, d] = day.iso.split('-').map(Number)
      expect(y).toBe(day.date.getFullYear())
      expect(m).toBe(day.date.getMonth() + 1)
      expect(d).toBe(day.date.getDate())
    }
  })
})

describe('CalendarGrid', () => {
  it('is a named grid of rows and cells', () => {
    const { container } = render(CalendarGrid, { props: BASE })
    expect(container.querySelector('[role="grid"]')).toHaveAttribute(
      'aria-label',
      'August 2026',
    )
    expect(container.querySelectorAll('[role="columnheader"]')).toHaveLength(7)
  })

  it('names each column in full for a screen reader', () => {
    const { container } = render(CalendarGrid, { props: BASE })
    const first = container.querySelector('[role="columnheader"]')
    // The full name is present for a screen reader and hidden from sight;
    // the abbreviation is present for sight and hidden from the reader.
    expect(first?.querySelector('.strand-sr-only')?.textContent?.trim()).toBe('Sunday')
    expect(first?.querySelector('[aria-hidden="true"]')?.textContent?.trim()).toBe('Sun')
  })

  // Thirty-one tab stops in a month would make the keyboard path through any
  // page carrying a calendar unusable.
  it('is exactly one tab stop', () => {
    const { container } = render(CalendarGrid, { props: BASE })
    expect(
      container.querySelectorAll('[role="gridcell"][tabindex="0"]'),
    ).toHaveLength(1)
  })

  it('puts the tab stop on the selected day when there is one', () => {
    const { container } = render(CalendarGrid, {
      props: { ...BASE, selected: '2026-08-20' },
    })
    expect(
      container.querySelector('[role="gridcell"][tabindex="0"]'),
    ).toHaveAttribute('data-iso', '2026-08-20')
  })

  it('marks today with aria-current, not only with a colour', () => {
    const { container } = render(CalendarGrid, { props: BASE })
    const marked = container.querySelectorAll('[aria-current="date"]')
    expect(marked).toHaveLength(1)
    expect(marked[0]).toHaveAttribute('data-iso', '2026-08-12')
  })

  it('marks the selection with aria-selected', () => {
    const { container } = render(CalendarGrid, {
      props: { ...BASE, selected: '2026-08-03' },
    })
    expect(container.querySelector('[aria-selected="true"]')).toHaveAttribute(
      'data-iso',
      '2026-08-03',
    )
  })

  // ── 10.6, the reason this needed a design-language change ──

  it('states the remainder as a count rather than clipping it', () => {
    const { container } = render(CalendarGrid, {
      props: { ...BASE, capacity: 2, counts: { '2026-08-12': 5 } },
    })
    expect(
      container
        .querySelector('[data-iso="2026-08-12"] .strand-calendar-grid__remainder')
        ?.textContent?.trim(),
    ).toBe('+3 more')
  })

  it('shows no remainder when everything fits', () => {
    const { container } = render(CalendarGrid, {
      props: { ...BASE, capacity: 2, counts: { '2026-08-12': 2 } },
    })
    expect(
      container.querySelector('[data-iso="2026-08-12"] .strand-calendar-grid__remainder'),
    ).toBeNull()
  })

  it('never renders a negative remainder', () => {
    const { container } = render(CalendarGrid, {
      props: { ...BASE, capacity: 5, counts: { '2026-08-12': 1 } },
    })
    expect(container.textContent).not.toContain('more')
  })

  it('marks adjacent days so they read as context', () => {
    const { container } = render(CalendarGrid, { props: BASE })
    const adjacent = container.querySelectorAll('.strand-calendar-grid__day--adjacent')
    expect(adjacent.length).toBeGreaterThan(0)
    expect(adjacent[0]).toHaveAttribute('data-iso', '2026-07-26')
  })
})

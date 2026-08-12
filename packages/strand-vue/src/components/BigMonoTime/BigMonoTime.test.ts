/*! Strand vue | MIT License | dillingerstaffing.com */
// Mirrors the canonical Preact assertions so the ports cannot drift.
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import BigMonoTime from './BigMonoTime.vue'

describe('BigMonoTime', () => {
  it('renders the time', () => {
    const { container } = render(BigMonoTime, { props: { value: '06:45' } })
    expect(container.querySelector('.strand-big-mono-time')?.textContent?.trim()).toBe('06:45')
  })

  // A <time> without datetime asserts a machine-readable instant that is
  // not there, so the element type follows the data.
  it('is a plain span when there is nothing machine-readable to carry', () => {
    const { container } = render(BigMonoTime, { props: { value: '06:45' } })
    expect(container.querySelector('.strand-big-mono-time')?.tagName).toBe('SPAN')
  })

  it('is a <time> when given a machine-readable value', () => {
    const { container } = render(BigMonoTime, {
      props: { value: '06:45', dateTime: '2026-08-13T06:45' },
    })
    const el = container.querySelector('.strand-big-mono-time')
    expect(el?.tagName).toBe('TIME')
    expect(el).toHaveAttribute('datetime', '2026-08-13T06:45')
  })

  it('renders a range with both ends', () => {
    const { container } = render(BigMonoTime, { props: { value: '06:45', until: '08:30' } })
    expect(container.textContent).toContain('06:45')
    expect(container.textContent).toContain('08:30')
  })

  it('hides the range separator from the accessibility tree', () => {
    const { container } = render(BigMonoTime, { props: { value: '06:45', until: '08:30' } })
    expect(container.querySelector('.strand-big-mono-time__sep')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders no separator for a single time', () => {
    const { container } = render(BigMonoTime, { props: { value: '06:45' } })
    expect(container.querySelector('.strand-big-mono-time__sep')).toBeNull()
  })
})

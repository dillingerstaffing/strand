import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import Progress from './Progress.vue'

describe('Progress', () => {
  // ── ARIA ──

  it('renders with progressbar role', () => {
    const { getByRole } = render(Progress, { props: { value: 50 } })
    expect(getByRole('progressbar')).toBeTruthy()
  })

  it('has aria-valuemin of 0', () => {
    const { getByRole } = render(Progress, { props: { value: 50 } })
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0')
  })

  it('has aria-valuemax of 100', () => {
    const { getByRole } = render(Progress, { props: { value: 50 } })
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100')
  })

  it('has aria-valuenow when determinate', () => {
    const { getByRole } = render(Progress, { props: { value: 75 } })
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75')
  })

  it('has no aria-valuenow when indeterminate', () => {
    const { getByRole } = render(Progress)
    expect(getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  })

  // ── Variants ──

  it('applies bar variant class by default', () => {
    const { getByRole } = render(Progress, { props: { value: 50 } })
    expect(getByRole('progressbar').className).toContain('strand-progress--bar')
  })

  it('applies ring variant class', () => {
    const { getByRole } = render(Progress, { props: { variant: 'ring', value: 50 } })
    expect(getByRole('progressbar').className).toContain('strand-progress--ring')
  })

  it('renders SVG for ring variant', () => {
    const { container } = render(Progress, { props: { variant: 'ring', value: 50 } })
    expect(container.querySelector('svg')).toBeTruthy()
  })

  // ── Indeterminate ──

  it('applies indeterminate class when no value', () => {
    const { getByRole } = render(Progress)
    expect(getByRole('progressbar').className).toContain('strand-progress--indeterminate')
  })

  it('does not apply indeterminate class when value is provided', () => {
    const { getByRole } = render(Progress, { props: { value: 50 } })
    expect(getByRole('progressbar').className).not.toContain('strand-progress--indeterminate')
  })

  // ── Sizes ──

  it('applies md size class by default', () => {
    const { getByRole } = render(Progress, { props: { value: 50 } })
    expect(getByRole('progressbar').className).toContain('strand-progress--md')
  })

  it('applies sm size class', () => {
    const { getByRole } = render(Progress, { props: { value: 50, size: 'sm' } })
    expect(getByRole('progressbar').className).toContain('strand-progress--sm')
  })

  it('applies lg size class', () => {
    const { getByRole } = render(Progress, { props: { value: 50, size: 'lg' } })
    expect(getByRole('progressbar').className).toContain('strand-progress--lg')
  })

  // ── Fill width ──

  it('sets fill width to match value for bar variant', () => {
    const { container } = render(Progress, { props: { value: 60 } })
    const fill = container.querySelector('.strand-progress__fill')
    expect((fill as HTMLElement)?.style.width).toBe('60%')
  })

  // ── Ring SVG ──

  it('renders track and fill circles for ring variant', () => {
    const { container } = render(Progress, { props: { variant: 'ring', value: 50 } })
    expect(container.querySelector('.strand-progress__track')).toBeTruthy()
    expect(container.querySelector('.strand-progress__fill')).toBeTruthy()
  })

  // ── Custom className ──

  it('merges custom className', () => {
    const { getByRole } = render(Progress, { props: { value: 50, className: 'custom' } })
    const el = getByRole('progressbar')
    expect(el.className).toContain('strand-progress')
    expect(el.className).toContain('custom')
  })
})

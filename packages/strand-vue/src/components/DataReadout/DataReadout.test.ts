import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import DataReadout from './DataReadout.vue'

describe('DataReadout', () => {
  // ── Rendering ──

  it('renders a div element', () => {
    const { container } = render(DataReadout, {
      props: { label: 'Revenue', value: '$1.2M' },
    })
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('applies strand-data-readout base class', () => {
    const { container } = render(DataReadout, {
      props: { label: 'Revenue', value: '$1.2M' },
    })
    expect(container.firstElementChild?.className).toContain('strand-data-readout')
  })

  // ── Label and value ──

  it('renders label text', () => {
    const { container } = render(DataReadout, {
      props: { label: 'Revenue', value: '$1.2M' },
    })
    const label = container.querySelector('.strand-data-readout__label')
    expect(label?.textContent).toBe('Revenue')
  })

  it('renders string value', () => {
    const { container } = render(DataReadout, {
      props: { label: 'Revenue', value: '$1.2M' },
    })
    const val = container.querySelector('.strand-data-readout__value')
    expect(val?.textContent).toBe('$1.2M')
  })

  it('renders numeric value', () => {
    const { container } = render(DataReadout, {
      props: { label: 'Count', value: 42 },
    })
    const val = container.querySelector('.strand-data-readout__value')
    expect(val?.textContent).toBe('42')
  })

  // ── Sizes ──

  it('does not apply size class for md (default)', () => {
    const { container } = render(DataReadout, {
      props: { label: 'Test', value: '0', size: 'md' },
    })
    expect(container.firstElementChild?.className).not.toContain('strand-data-readout--md')
  })

  it('does not apply size class when size is omitted', () => {
    const { container } = render(DataReadout, {
      props: { label: 'Test', value: '0' },
    })
    expect(container.firstElementChild?.className).not.toContain('strand-data-readout--sm')
    expect(container.firstElementChild?.className).not.toContain('strand-data-readout--lg')
  })

  it('applies sm size class', () => {
    const { container } = render(DataReadout, {
      props: { label: 'Test', value: '0', size: 'sm' },
    })
    expect(container.firstElementChild?.className).toContain('strand-data-readout--sm')
  })

  it('applies lg size class', () => {
    const { container } = render(DataReadout, {
      props: { label: 'Test', value: '0', size: 'lg' },
    })
    expect(container.firstElementChild?.className).toContain('strand-data-readout--lg')
  })

  // ── Custom className ──

  it('merges custom className', () => {
    const { container } = render(DataReadout, {
      props: { label: 'Test', value: '0', className: 'custom' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-data-readout')
    expect(el?.className).toContain('custom')
  })

  // ── Props forwarding ──

  it('forwards additional attributes', () => {
    const { container } = render(DataReadout, {
      props: { label: 'Test', value: '0' },
      attrs: { id: 'my-readout' },
    })
    expect(container.firstElementChild?.getAttribute('id')).toBe('my-readout')
  })
})

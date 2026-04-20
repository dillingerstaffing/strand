import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import KvEditorial from './KvEditorial.vue'

describe('KvEditorial', () => {
  it('renders a div with strand-kv base class', () => {
    const { container } = render(KvEditorial, {
      props: { label: 'A', value: 'B' },
    })
    expect(container.firstElementChild?.className).toContain('strand-kv')
  })

  it('applies --editorial modifier', () => {
    const { container } = render(KvEditorial, {
      props: { label: 'A', value: 'B' },
    })
    expect(container.firstElementChild?.className).toContain('strand-kv--editorial')
  })

  it('renders label and value', () => {
    const { getByText } = render(KvEditorial, {
      props: { label: 'Owner', value: 'DS' },
    })
    expect(getByText('Owner')).toBeTruthy()
    expect(getByText('DS')).toBeTruthy()
  })

  it('does not apply --status by default', () => {
    const { container } = render(KvEditorial, {
      props: { label: 'A', value: 'B' },
    })
    const valueEl = container.querySelector('.strand-kv__value')
    expect(valueEl?.className).not.toContain('strand-kv__value--status')
  })

  it('applies --status modifier when status is true', () => {
    const { container } = render(KvEditorial, {
      props: { label: 'A', value: 'B', status: true },
    })
    const valueEl = container.querySelector('.strand-kv__value')
    expect(valueEl?.className).toContain('strand-kv__value--status')
  })
})

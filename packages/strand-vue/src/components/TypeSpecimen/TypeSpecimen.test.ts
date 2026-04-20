import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import TypeSpecimen from './TypeSpecimen.vue'
import TypeSpecimenMeta from './TypeSpecimenMeta.vue'

describe('TypeSpecimen (Vue)', () => {
  it('base class', () => {
    const { container } = render(TypeSpecimen, { slots: { default: 'x' } })
    expect(container.firstElementChild?.className).toContain('strand-type-specimen')
  })

  it('Meta base class + span', () => {
    const { container } = render(TypeSpecimenMeta, { slots: { default: 'x' } })
    expect(container.firstElementChild?.tagName).toBe('SPAN')
    expect(container.firstElementChild?.className).toContain('strand-type-specimen__meta')
  })
})

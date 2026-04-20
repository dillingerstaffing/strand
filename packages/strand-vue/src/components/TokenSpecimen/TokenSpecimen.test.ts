import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import TokenSpecimen from './TokenSpecimen.vue'
import TokenSpecimenGrid from './TokenSpecimenGrid.vue'
import TokenSpecimenSpacer from './TokenSpecimenSpacer.vue'
import TokenSpecimenBox from './TokenSpecimenBox.vue'

describe('TokenSpecimen (Vue)', () => {
  it('Grid base class', () => {
    const { container } = render(TokenSpecimenGrid, { slots: { default: 'x' } })
    expect(container.firstElementChild?.className).toContain('strand-token-specimen-grid')
  })

  it('Specimen base class', () => {
    const { container } = render(TokenSpecimen, { slots: { default: 'x' } })
    expect(container.firstElementChild?.className).toContain('strand-token-specimen')
  })

  it('Spacer base class + inline width (string)', () => {
    const { container } = render(TokenSpecimenSpacer, { props: { width: '48px' } })
    const el = container.firstElementChild as HTMLElement
    expect(el.className).toContain('strand-token-specimen__spacer')
    expect(el.style.width).toBe('48px')
  })

  it('Spacer numeric width converts to px', () => {
    const { container } = render(TokenSpecimenSpacer, { props: { width: 48 } })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.width).toBe('48px')
  })

  it('Box base class + inline radius + shadow', () => {
    const { container } = render(TokenSpecimenBox, {
      props: { radius: '8px', shadow: '0 4px 12px rgba(0,0,0,0.1)' },
    })
    const el = container.firstElementChild as HTMLElement
    expect(el.className).toContain('strand-token-specimen__box')
    expect(el.style.borderRadius).toBe('8px')
    expect(el.style.boxShadow).toContain('rgba(0,0,0,0.1)')
  })
})

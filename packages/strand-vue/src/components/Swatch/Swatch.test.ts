import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import Swatch from './Swatch.vue'
import SwatchGrid from './SwatchGrid.vue'

describe('Swatch (Vue)', () => {
  it('SwatchGrid base class', () => {
    const { container } = render(SwatchGrid, { slots: { default: 'x' } })
    expect(container.firstElementChild?.className).toContain('strand-swatch-grid')
  })

  it('Swatch renders name + hex + base class', () => {
    const { container, getByText } = render(Swatch, {
      props: { name: 'blue', hex: '#fff', background: '#fff', color: '#000' },
    })
    expect(container.firstElementChild?.className).toContain('strand-swatch')
    expect(getByText('blue')).toBeTruthy()
    expect(getByText('#fff')).toBeTruthy()
  })

  it('Swatch applies inline background/color', () => {
    const { container } = render(Swatch, {
      props: { name: 'a', hex: '#fff', background: 'rgb(1, 2, 3)', color: 'rgb(255, 255, 255)' },
    })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.background).toContain('rgb(1, 2, 3)')
    expect(el.style.color).toBe('rgb(255, 255, 255)')
  })
})

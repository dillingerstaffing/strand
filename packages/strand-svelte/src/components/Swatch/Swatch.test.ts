/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Swatch from './Swatch.svelte'
import SwatchGrid from './SwatchGrid.svelte'

describe('Swatch (Svelte)', () => {
  it('SwatchGrid base class', () => {
    const { container } = render(SwatchGrid)
    expect(container.querySelector('.strand-swatch-grid')).toBeInTheDocument()
  })

  it('Swatch renders name and hex', () => {
    const { container, getByText } = render(Swatch, {
      props: { name: 'blue', hex: '#fff', background: '#fff', color: '#000' },
    })
    expect(container.querySelector('.strand-swatch')).toBeInTheDocument()
    expect(getByText('blue')).toBeInTheDocument()
    expect(getByText('#fff')).toBeInTheDocument()
  })

  it('Swatch applies inline background/color', () => {
    const { container } = render(Swatch, {
      props: { name: 'a', hex: '#fff', background: 'rgb(1, 2, 3)', color: '#fff' },
    })
    const el = container.querySelector('.strand-swatch') as HTMLElement
    expect(el.style.background).toContain('rgb(1, 2, 3)')
    expect(el.style.color).toBe('rgb(255, 255, 255)')
  })
})

/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import TokenSpecimen from './TokenSpecimen.svelte'
import TokenSpecimenGrid from './TokenSpecimenGrid.svelte'
import TokenSpecimenSpacer from './TokenSpecimenSpacer.svelte'
import TokenSpecimenBox from './TokenSpecimenBox.svelte'

describe('TokenSpecimen (Svelte)', () => {
  it('Grid base class', () => {
    const { container } = render(TokenSpecimenGrid)
    expect(container.querySelector('.strand-token-specimen-grid')).toBeInTheDocument()
  })

  it('Specimen base class', () => {
    const { container } = render(TokenSpecimen)
    expect(container.querySelector('.strand-token-specimen')).toBeInTheDocument()
  })

  it('Spacer width string', () => {
    const { container } = render(TokenSpecimenSpacer, { props: { width: '48px' } })
    const el = container.querySelector('.strand-token-specimen__spacer') as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el.style.width).toBe('48px')
  })

  it('Spacer width numeric', () => {
    const { container } = render(TokenSpecimenSpacer, { props: { width: 48 } })
    const el = container.querySelector('.strand-token-specimen__spacer') as HTMLElement
    expect(el.style.width).toBe('48px')
  })

  it('Box radius + shadow', () => {
    const { container } = render(TokenSpecimenBox, {
      props: { radius: '8px', shadow: '0 4px 12px rgba(0,0,0,0.1)' },
    })
    const el = container.querySelector('.strand-token-specimen__box') as HTMLElement
    expect(el.style.borderRadius).toBe('8px')
    expect(el.style.boxShadow).toContain('rgba(0,0,0,0.1)')
  })
})

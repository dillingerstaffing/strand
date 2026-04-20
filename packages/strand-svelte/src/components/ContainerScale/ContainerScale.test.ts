/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import ContainerScale from './ContainerScale.svelte'
import ContainerScaleRow from './ContainerScaleRow.svelte'
import ContainerScaleLabel from './ContainerScaleLabel.svelte'
import ContainerScaleCaption from './ContainerScaleCaption.svelte'
import ContainerScaleTrack from './ContainerScaleTrack.svelte'
import ContainerScaleBar from './ContainerScaleBar.svelte'
import ContainerScalePx from './ContainerScalePx.svelte'
import ContainerScaleAxis from './ContainerScaleAxis.svelte'

describe('ContainerScale (Svelte)', () => {
  it('root base class', () => {
    const { container } = render(ContainerScale)
    expect(container.querySelector('.strand-container-scale')).toBeInTheDocument()
  })

  it('BEM parts render with scoped classes', () => {
    expect(render(ContainerScaleRow).container.querySelector('.strand-container-scale__row')).toBeInTheDocument()
    expect(render(ContainerScaleLabel).container.querySelector('.strand-container-scale__label')).toBeInTheDocument()
    expect(render(ContainerScaleCaption).container.querySelector('.strand-container-scale__caption')).toBeInTheDocument()
    expect(render(ContainerScaleTrack).container.querySelector('.strand-container-scale__track')).toBeInTheDocument()
    expect(render(ContainerScalePx).container.querySelector('.strand-container-scale__px')).toBeInTheDocument()
    expect(render(ContainerScaleAxis).container.querySelector('.strand-container-scale__axis')).toBeInTheDocument()
  })

  it('Bar inline width', () => {
    const { container } = render(ContainerScaleBar, { props: { width: '60%' } })
    const el = container.querySelector('.strand-container-scale__bar') as HTMLElement
    expect(el.style.width).toBe('60%')
  })
})

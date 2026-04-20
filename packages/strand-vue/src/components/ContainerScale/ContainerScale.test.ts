import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import ContainerScale from './ContainerScale.vue'
import ContainerScaleRow from './ContainerScaleRow.vue'
import ContainerScaleLabel from './ContainerScaleLabel.vue'
import ContainerScaleCaption from './ContainerScaleCaption.vue'
import ContainerScaleTrack from './ContainerScaleTrack.vue'
import ContainerScaleBar from './ContainerScaleBar.vue'
import ContainerScalePx from './ContainerScalePx.vue'
import ContainerScaleAxis from './ContainerScaleAxis.vue'

describe('ContainerScale (Vue)', () => {
  it('root base class', () => {
    const { container } = render(ContainerScale, { slots: { default: 'x' } })
    expect(container.firstElementChild?.className).toContain('strand-container-scale')
  })

  it('BEM parts render with scoped classes', () => {
    const pairs: Array<[any, string]> = [
      [ContainerScaleRow, 'strand-container-scale__row'],
      [ContainerScaleLabel, 'strand-container-scale__label'],
      [ContainerScaleCaption, 'strand-container-scale__caption'],
      [ContainerScaleTrack, 'strand-container-scale__track'],
      [ContainerScalePx, 'strand-container-scale__px'],
      [ContainerScaleAxis, 'strand-container-scale__axis'],
    ]
    for (const [C, cls] of pairs) {
      const { container } = render(C, { slots: { default: 'x' } })
      expect(container.firstElementChild?.className).toContain(cls)
    }
  })

  it('Bar applies inline width', () => {
    const { container } = render(ContainerScaleBar, {
      props: { width: '60%' },
      slots: { default: 'x' },
    })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.width).toBe('60%')
    expect(el.className).toContain('strand-container-scale__bar')
  })
})

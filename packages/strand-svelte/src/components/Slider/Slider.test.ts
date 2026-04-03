/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Slider from './Slider.svelte'

describe('Slider', () => {
  it('renders with default classes', () => {
    const { container } = render(Slider)
    expect(container.querySelector('.strand-slider')).toBeInTheDocument()
    const input = container.querySelector('.strand-slider__field')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'range')
  })

  it('applies disabled class and attribute', () => {
    const { container } = render(Slider, { props: { disabled: true } })
    expect(container.querySelector('.strand-slider')).toHaveClass('strand-slider--disabled')
    expect(container.querySelector('.strand-slider__field')).toBeDisabled()
  })

  it('passes min, max, step', () => {
    const { container } = render(Slider, { props: { min: 10, max: 50, step: 5 } })
    const input = container.querySelector('.strand-slider__field')
    expect(input).toHaveAttribute('min', '10')
    expect(input).toHaveAttribute('max', '50')
    expect(input).toHaveAttribute('step', '5')
  })

  it('sets aria-value attributes', () => {
    const { container } = render(Slider, { props: { min: 0, max: 100, value: 50 } })
    const input = container.querySelector('.strand-slider__field')
    expect(input).toHaveAttribute('aria-valuemin', '0')
    expect(input).toHaveAttribute('aria-valuemax', '100')
    expect(input).toHaveAttribute('aria-valuenow', '50')
  })

  it('defaults to min=0, max=100, step=1', () => {
    const { container } = render(Slider)
    const input = container.querySelector('.strand-slider__field')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
    expect(input).toHaveAttribute('step', '1')
  })
})

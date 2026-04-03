/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Slider from './Slider.vue'

describe('Slider', () => {
  it('renders with default props', () => {
    const { container } = render(Slider)
    const wrapper = container.querySelector('.strand-slider')
    expect(wrapper).toBeInTheDocument()
    const input = container.querySelector('.strand-slider__field') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'range')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
    expect(input).toHaveAttribute('step', '1')
  })

  it('sets aria-valuemin, aria-valuemax, and aria-valuenow', () => {
    const { container } = render(Slider, {
      props: { min: 10, max: 200, modelValue: 50 },
    })
    const input = container.querySelector('.strand-slider__field')
    expect(input).toHaveAttribute('aria-valuemin', '10')
    expect(input).toHaveAttribute('aria-valuemax', '200')
    expect(input).toHaveAttribute('aria-valuenow', '50')
  })

  it('applies custom min, max, step props', () => {
    const { container } = render(Slider, {
      props: { min: 5, max: 50, step: 5 },
    })
    const input = container.querySelector('.strand-slider__field')
    expect(input).toHaveAttribute('min', '5')
    expect(input).toHaveAttribute('max', '50')
    expect(input).toHaveAttribute('step', '5')
  })

  it('applies disabled class and attribute', () => {
    const { container } = render(Slider, {
      props: { disabled: true },
    })
    const wrapper = container.querySelector('.strand-slider')
    expect(wrapper).toHaveClass('strand-slider--disabled')
    const input = container.querySelector('.strand-slider__field')
    expect(input).toBeDisabled()
  })

  it('does not apply disabled class when not disabled', () => {
    const { container } = render(Slider)
    const wrapper = container.querySelector('.strand-slider')
    expect(wrapper).not.toHaveClass('strand-slider--disabled')
  })

  it('emits update:modelValue on input', async () => {
    const { container, emitted } = render(Slider, {
      props: { modelValue: 50 },
    })
    const input = container.querySelector('.strand-slider__field') as HTMLInputElement
    await fireEvent.update(input, '75')
    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual([75])
  })

  it('sets value from modelValue prop', () => {
    const { container } = render(Slider, {
      props: { modelValue: 42 },
    })
    const input = container.querySelector('.strand-slider__field') as HTMLInputElement
    expect(input.value).toBe('42')
  })
})

/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import StarRating from './StarRating.svelte'

describe('StarRating', () => {
  it('renders five radio buttons', () => {
    const { container } = render(StarRating, { props: { value: 0, ariaLabel: 'Rate' } })
    expect(container.querySelectorAll('[role="radio"]').length).toBe(5)
  })

  it('applies the active class to stars up to the value', () => {
    const { container } = render(StarRating, { props: { value: 3, ariaLabel: 'Rate' } })
    expect(
      container.querySelectorAll('.strand-star-rating__star--active').length,
    ).toBe(3)
  })

  it('sets aria-checked true on the selected star', () => {
    const { container } = render(StarRating, { props: { value: 2, ariaLabel: 'Rate' } })
    const radios = container.querySelectorAll('[role="radio"]')
    expect(radios[1]).toHaveAttribute('aria-checked', 'true')
    expect(radios[0]).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange with the clicked star value', async () => {
    const onChange = vi.fn()
    const { container } = render(StarRating, {
      props: { value: 0, ariaLabel: 'Rate', onChange },
    })
    const radios = container.querySelectorAll('[role="radio"]')
    await fireEvent.click(radios[3])
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('does not call onChange in readOnly mode', async () => {
    const onChange = vi.fn()
    const { container } = render(StarRating, {
      props: { value: 2, ariaLabel: 'Rate', readOnly: true, onChange },
    })
    const radios = container.querySelectorAll('[role="radio"]')
    await fireEvent.click(radios[4])
    expect(onChange).not.toHaveBeenCalled()
  })

  it('applies the size modifier class', () => {
    const { container } = render(StarRating, {
      props: { value: 0, ariaLabel: 'Rate', size: 'lg' },
    })
    expect(container.querySelector('.strand-star-rating--lg')).toBeInTheDocument()
  })

  it('defaults to md size', () => {
    const { container } = render(StarRating, { props: { value: 0, ariaLabel: 'Rate' } })
    expect(container.querySelector('.strand-star-rating--md')).toBeInTheDocument()
  })

  it('applies readonly class when readOnly is set', () => {
    const { container } = render(StarRating, {
      props: { value: 3, ariaLabel: 'Rate', readOnly: true },
    })
    expect(
      container.querySelector('.strand-star-rating--readonly'),
    ).toBeInTheDocument()
  })

  it('exposes data-strand-component attribute', () => {
    const { container } = render(StarRating, { props: { value: 0, ariaLabel: 'Rate' } })
    expect(
      container.querySelector('[data-strand-component="star-rating"]'),
    ).toBeInTheDocument()
  })

  it('reflects the aria-label prop on the radiogroup', () => {
    const { container } = render(StarRating, {
      props: { value: 0, ariaLabel: 'Rate event' },
    })
    expect(container.querySelector('[aria-label="Rate event"]')).toBeInTheDocument()
  })

  it('activates a star on Space keydown', async () => {
    const onChange = vi.fn()
    const { container } = render(StarRating, {
      props: { value: 0, ariaLabel: 'Rate', onChange },
    })
    const radios = container.querySelectorAll('[role="radio"]')
    await fireEvent.keyDown(radios[1], { key: ' ' })
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('disables star buttons in read-only mode', () => {
    const { container } = render(StarRating, {
      props: { value: 3, ariaLabel: 'Rate', readOnly: true },
    })
    const radios = container.querySelectorAll('[role="radio"]')
    for (const r of radios) {
      expect(r).toBeDisabled()
    }
  })
})

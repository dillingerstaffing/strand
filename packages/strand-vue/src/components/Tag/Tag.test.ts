import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Tag from './Tag.vue'

describe('Tag', () => {
  // ── Rendering ──

  it('renders a span element', () => {
    const { container } = render(Tag, { slots: { default: 'Label' } })
    expect(container.firstElementChild?.tagName).toBe('SPAN')
  })

  it('renders slot content inside text span', () => {
    const { container } = render(Tag, { slots: { default: 'Active' } })
    const textSpan = container.querySelector('.strand-tag__text')
    expect(textSpan?.textContent).toBe('Active')
  })

  // ── Variants ──

  it('applies solid variant class by default', () => {
    const { container } = render(Tag, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).toContain('strand-tag--solid')
  })

  it('applies outlined variant class', () => {
    const { container } = render(Tag, {
      props: { variant: 'outlined' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-tag--outlined')
  })

  // ── Status colors ──

  it('applies default status class by default', () => {
    const { container } = render(Tag, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).toContain('strand-tag--default')
  })

  it('applies teal status class', () => {
    const { container } = render(Tag, {
      props: { status: 'teal' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-tag--teal')
  })

  it('applies red status class', () => {
    const { container } = render(Tag, {
      props: { status: 'red' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-tag--red')
  })

  it('applies amber status class', () => {
    const { container } = render(Tag, {
      props: { status: 'amber' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-tag--amber')
  })

  it('applies blue status class', () => {
    const { container } = render(Tag, {
      props: { status: 'blue' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-tag--blue')
  })

  // ── Removable ──

  it('does not show remove button by default', () => {
    const { container } = render(Tag, { slots: { default: 'Test' } })
    expect(container.querySelector('.strand-tag__remove')).toBeNull()
  })

  it('shows remove button when removable', () => {
    const { container } = render(Tag, {
      props: { removable: true },
      slots: { default: 'Test' },
    })
    expect(container.querySelector('.strand-tag__remove')).toBeTruthy()
  })

  it('remove button has aria-label', () => {
    const { container } = render(Tag, {
      props: { removable: true },
      slots: { default: 'Test' },
    })
    const btn = container.querySelector('.strand-tag__remove')
    expect(btn?.getAttribute('aria-label')).toBe('Remove')
  })

  it('emits remove event on button click', async () => {
    const { container, emitted } = render(Tag, {
      props: { removable: true },
      slots: { default: 'Test' },
    })
    const btn = container.querySelector('.strand-tag__remove') as HTMLButtonElement
    await fireEvent.click(btn)
    expect(emitted().remove).toHaveLength(1)
  })

  it('remove button contains SVG with aria-hidden', () => {
    const { container } = render(Tag, {
      props: { removable: true },
      slots: { default: 'Test' },
    })
    const svg = container.querySelector('.strand-tag__remove svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
  })

  // ── Custom className ──

  it('merges custom className', () => {
    const { container } = render(Tag, {
      props: { className: 'custom' },
      slots: { default: 'Test' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-tag')
    expect(el?.className).toContain('custom')
  })
})

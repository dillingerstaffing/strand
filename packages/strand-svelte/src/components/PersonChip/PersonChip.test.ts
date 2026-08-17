/*! Strand svelte | MIT License | dillingerstaffing.com */
// Mirrors the canonical Preact assertions so the ports cannot drift.
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import PersonChip from './PersonChip.svelte'

describe('PersonChip', () => {
  it('renders the name and derived initials', () => {
    const { container } = render(PersonChip, { props: { name: 'Maria Klein' } })
    expect(container.querySelector('.strand-person-chip__name')?.textContent?.trim()).toBe('Maria Klein')
    expect(container.querySelector('.strand-person-chip__avatar')?.textContent?.trim()).toBe('MK')
  })

  it('takes explicit initials over the derived ones', () => {
    const { container } = render(PersonChip, { props: { name: 'Maria Klein', initials: 'MJ' } })
    expect(container.querySelector('.strand-person-chip__avatar')?.textContent?.trim()).toBe('MJ')
  })

  // Announcing "MK, Maria Klein" reads the same person twice.
  it('hides the initials circle from the accessibility tree', () => {
    const { container } = render(PersonChip, { props: { name: 'Maria Klein' } })
    expect(container.querySelector('.strand-person-chip__avatar')).toHaveAttribute('aria-hidden', 'true')
  })

  // A strip of thirty non-interactive chips would be thirty tab stops
  // promising an action that does not exist.
  it('is not a control when it does nothing', () => {
    const { container } = render(PersonChip, { props: { name: 'Maria Klein' } })
    expect(container.querySelector('.strand-person-chip')?.tagName).toBe('SPAN')
  })

  it('is a button when it is selectable', () => {
    const { container } = render(PersonChip, { props: { name: 'Maria Klein', selectable: true } })
    const el = container.querySelector('.strand-person-chip')
    expect(el?.tagName).toBe('BUTTON')
    expect(el).toHaveAttribute('type', 'button')
  })
  it('renders a secondary label beside the name, both readable', () => {
    const { container } = render(PersonChip, { props: { name: 'steady-kestrel-865', secondary: 'Grace' } })
    expect(container.querySelector('.strand-person-chip__name')?.textContent?.trim()).toBe('steady-kestrel-865')
    expect(container.querySelector('.strand-person-chip__secondary')?.textContent?.trim()).toBe('Grace')
  })

  it('omits the secondary element entirely when there is none', () => {
    const { container } = render(PersonChip, { props: { name: 'Maria Klein' } })
    expect(container.querySelector('.strand-person-chip__secondary')).toBeNull()
  })
})

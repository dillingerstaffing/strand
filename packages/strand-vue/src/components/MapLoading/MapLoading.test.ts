/*! Strand vue | MIT License | dillingerstaffing.com */
// Mirrors the canonical Preact assertions so the ports cannot drift.
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import MapLoading from './MapLoading.vue'

describe('MapLoading', () => {
  // Present is the safe state: a consumer that forgets to drive it shows a
  // loading screen rather than revealing a half-painted map.
  it('shows by default', () => {
    const { container } = render(MapLoading)
    const el = container.querySelector('.strand-map-loading')
    expect(el?.classList.contains('strand-map-loading--hidden')).toBe(false)
    expect(el).toHaveAttribute('aria-busy', 'true')
  })

  // Unmounting would cut the opacity transition and reveal the map
  // mid-paint; the class is what lets it fade.
  it('hides by class rather than by unmounting', () => {
    const { container } = render(MapLoading, { props: { visible: false } })
    const el = container.querySelector('.strand-map-loading')
    expect(el).not.toBeNull()
    expect(el?.classList.contains('strand-map-loading--hidden')).toBe(true)
    expect(el).toHaveAttribute('aria-busy', 'false')
  })

  it('announces its caption politely rather than changing state silently', () => {
    const { container } = render(MapLoading)
    const el = container.querySelector('.strand-map-loading')
    expect(el).toHaveAttribute('role', 'status')
    expect(el).toHaveAttribute('aria-live', 'polite')
  })

  it('uses instrument voice by default', () => {
    const { container } = render(MapLoading)
    expect(container.querySelector('.strand-map-loading__text')?.textContent?.trim()).toBe('Processing')
  })

  it('takes a caption', () => {
    const { container } = render(MapLoading, { props: { text: 'Scanning' } })
    expect(container.querySelector('.strand-map-loading__text')?.textContent?.trim()).toBe('Scanning')
  })

  it('hides its decorative parts from the accessibility tree', () => {
    const { container } = render(MapLoading)
    expect(container.querySelector('.strand-map-loading__spinner')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.strand-map-loading__bar')).toHaveAttribute('aria-hidden', 'true')
  })
})

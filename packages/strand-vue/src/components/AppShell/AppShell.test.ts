/*! Strand vue | MIT License | dillingerstaffing.com */
// Geometry (width, clipping) is asserted in the layout tier in real Chromium.
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import AppShell from './AppShell.vue'

describe('AppShell', () => {
  it('renders the frame', () => {
    const { container } = render(AppShell)
    expect(container.querySelector('.strand-app-shell')).not.toBeNull()
  })

  // A consumer must not reach for this when they want a reading measure,
  // and must not get 1024 when they want a frame.
  it('is not a content container', () => {
    const { container } = render(AppShell)
    expect(container.querySelector('.strand-app-shell')?.className).not.toContain('strand-container')
  })

  it('carries a consumer class without dropping its own', () => {
    const { container } = render(AppShell, { props: { className: 'x', class: 'x' } })
    const el = container.querySelector('.strand-app-shell')
    expect(el?.classList.contains('x')).toBe(true)
    expect(el?.classList.contains('strand-app-shell')).toBe(true)
  })
})

/*! Strand vue | MIT License | dillingerstaffing.com */
// Mirrors the canonical Preact assertions so the ports cannot drift.
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import ResultsPanel from './ResultsPanel.vue'

describe('ResultsPanel', () => {
  it('is a labelled region', () => {
    const { container } = render(ResultsPanel)
    const el = container.querySelector('.strand-results-panel')
    expect(el?.tagName).toBe('SECTION')
    expect(el).toHaveAttribute('aria-label', 'Results')
  })

  // Polite, not assertive: a count re-announcing on every keystroke of a
  // live search interrupts more than it informs.
  it('announces the count politely when a query re-runs', () => {
    const { container } = render(ResultsPanel, { props: { count: '12 matches detected' } })
    const el = container.querySelector('.strand-results-panel__count')
    expect(el?.textContent?.trim()).toBe('12 matches detected')
    expect(el).toHaveAttribute('aria-live', 'polite')
  })

  // Three states, not two. A failed request and an empty result are
  // different answers and the user is owed the difference.
  it('shows the state block instead of items when empty', () => {
    const { container } = render(ResultsPanel, {
      props: { state: 'empty', stateTitle: '0 matches detected', stateHint: 'Adjust parameters' },
    })
    expect(container.querySelector('.strand-results-panel__items')).toBeNull()
    expect(container.querySelector('.strand-results-panel__state-title')?.textContent?.trim()).toBe('0 matches detected')
  })

  it('offers a retry only in the error state', () => {
    const { container: empty } = render(ResultsPanel, {
      props: { state: 'empty', stateTitle: 'none', retryable: true },
    })
    // An empty result is not a failure, so there is nothing to retry.
    expect(empty.querySelector('.strand-results-panel__error-link')).toBeNull()

    const { container } = render(ResultsPanel, {
      props: { state: 'error', stateTitle: 'Process interrupted', retryable: true },
    })
    expect(container.querySelector('.strand-results-panel__error-link')).not.toBeNull()
  })

  it('shows no retry in the error state when the consumer gives no handler', () => {
    const { container } = render(ResultsPanel, { props: { state: 'error', stateTitle: 'x' } })
    expect(container.querySelector('.strand-results-panel__error-link')).toBeNull()
  })

  it('hides with the hidden attribute, leaving the accessibility tree', () => {
    const { container } = render(ResultsPanel, { props: { visible: false } })
    expect(container.querySelector('.strand-results-panel')?.hasAttribute('hidden')).toBe(true)
  })
})

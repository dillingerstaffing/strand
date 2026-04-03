/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Alert from './Alert.vue'

describe('Alert', () => {
  it('renders with default props', () => {
    const { container } = render(Alert, {
      slots: { default: 'Information message' },
    })
    const alert = container.querySelector('.strand-alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass('strand-alert--info')
    expect(alert).toHaveAttribute('role', 'status')
    const content = container.querySelector('.strand-alert__content')
    expect(content).toBeInTheDocument()
    expect(content).toHaveTextContent('Information message')
  })

  it('applies status variant classes', () => {
    const statuses = ['info', 'success', 'warning', 'error'] as const
    for (const status of statuses) {
      const { container } = render(Alert, {
        props: { status },
        slots: { default: 'Msg' },
      })
      expect(container.querySelector('.strand-alert')).toHaveClass(`strand-alert--${status}`)
    }
  })

  it('sets role="alert" for error status', () => {
    const { container } = render(Alert, {
      props: { status: 'error' },
      slots: { default: 'Error' },
    })
    expect(container.querySelector('.strand-alert')).toHaveAttribute('role', 'alert')
  })

  it('sets role="alert" for warning status', () => {
    const { container } = render(Alert, {
      props: { status: 'warning' },
      slots: { default: 'Warning' },
    })
    expect(container.querySelector('.strand-alert')).toHaveAttribute('role', 'alert')
  })

  it('sets role="status" for info status', () => {
    const { container } = render(Alert, {
      props: { status: 'info' },
      slots: { default: 'Info' },
    })
    expect(container.querySelector('.strand-alert')).toHaveAttribute('role', 'status')
  })

  it('sets role="status" for success status', () => {
    const { container } = render(Alert, {
      props: { status: 'success' },
      slots: { default: 'Success' },
    })
    expect(container.querySelector('.strand-alert')).toHaveAttribute('role', 'status')
  })

  it('shows dismiss button when dismissible', () => {
    const { container } = render(Alert, {
      props: { dismissible: true },
      slots: { default: 'Msg' },
    })
    const dismiss = container.querySelector('.strand-alert__dismiss')
    expect(dismiss).toBeInTheDocument()
    expect(dismiss).toHaveAttribute('type', 'button')
    expect(dismiss).toHaveAttribute('aria-label', 'Dismiss')
  })

  it('does not show dismiss button by default', () => {
    const { container } = render(Alert, {
      slots: { default: 'Msg' },
    })
    expect(container.querySelector('.strand-alert__dismiss')).not.toBeInTheDocument()
  })

  it('emits dismiss event when dismiss button clicked', async () => {
    const { container, emitted } = render(Alert, {
      props: { dismissible: true },
      slots: { default: 'Msg' },
    })
    const dismiss = container.querySelector('.strand-alert__dismiss') as HTMLButtonElement
    await fireEvent.click(dismiss)
    expect(emitted().dismiss).toHaveLength(1)
  })

  it('dismiss button contains close character', () => {
    const { container } = render(Alert, {
      props: { dismissible: true },
      slots: { default: 'Msg' },
    })
    const dismiss = container.querySelector('.strand-alert__dismiss')
    expect(dismiss).toHaveTextContent('\u00D7')
  })

  it('renders status prefix for info', () => {
    const { container } = render(Alert, {
      props: { status: 'info' },
      slots: { default: 'Info' },
    })
    const status = container.querySelector('.strand-alert__status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent('INFO')
  })

  it('renders status prefix for success as COMPLETE', () => {
    const { container } = render(Alert, {
      props: { status: 'success' },
      slots: { default: 'OK' },
    })
    const status = container.querySelector('.strand-alert__status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent('COMPLETE')
  })

  it('renders status prefix for warning', () => {
    const { container } = render(Alert, {
      props: { status: 'warning' },
      slots: { default: 'Warn' },
    })
    const status = container.querySelector('.strand-alert__status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent('WARNING')
  })

  it('renders status prefix for error', () => {
    const { container } = render(Alert, {
      props: { status: 'error' },
      slots: { default: 'Fail' },
    })
    const status = container.querySelector('.strand-alert__status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent('ERROR')
  })
})

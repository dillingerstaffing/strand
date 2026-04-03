/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import { defineComponent, h } from 'vue'
import Toast from './Toast.vue'
import ToastProvider from './ToastProvider.vue'
import { useToast } from './useToast'
import type { ToastStatus } from './useToast'

/** Helper component that triggers a toast via the composable */
const TestTrigger = defineComponent({
  props: {
    message: { type: String, default: 'Test message' },
    status: { type: String as () => ToastStatus | undefined, default: undefined },
    duration: { type: Number, default: undefined },
  },
  setup(props) {
    const { toast } = useToast()
    return { toast, props }
  },
  render() {
    return h(
      'button',
      {
        type: 'button',
        onClick: () =>
          this.toast({
            message: this.props.message,
            status: this.props.status,
            duration: this.props.duration,
          }),
      },
      'Trigger',
    )
  },
})

describe('Toast', () => {
  // -- Standalone Toast component --

  it('renders message text', () => {
    const { getByText } = render(Toast, {
      props: { message: 'Hello' },
    })
    expect(getByText('Hello')).toBeTruthy()
  })

  it('applies status class', () => {
    const { container } = render(Toast, {
      props: { message: 'OK', status: 'success' },
    })
    expect(container.querySelector('.strand-toast--success')).toBeTruthy()
  })

  it('has role status', () => {
    const { getByRole } = render(Toast, {
      props: { message: 'Info' },
    })
    expect(getByRole('status')).toBeTruthy()
  })

  it('error toast has aria-live assertive', () => {
    const { getByRole } = render(Toast, {
      props: { message: 'Fail', status: 'error' },
    })
    expect(getByRole('status')).toHaveAttribute('aria-live', 'assertive')
  })

  it('info toast has aria-live polite', () => {
    const { getByRole } = render(Toast, {
      props: { message: 'Note', status: 'info' },
    })
    expect(getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('warning toast has aria-live assertive', () => {
    const { getByRole } = render(Toast, {
      props: { message: 'Warn', status: 'warning' },
    })
    expect(getByRole('status')).toHaveAttribute('aria-live', 'assertive')
  })

  it('emits dismiss when dismiss button is clicked', async () => {
    const { getByLabelText, emitted } = render(Toast, {
      props: { message: 'Bye' },
    })
    await fireEvent.click(getByLabelText('Dismiss'))
    expect(emitted().dismiss).toHaveLength(1)
  })

  it('defaults to info status', () => {
    const { container } = render(Toast, {
      props: { message: 'Default' },
    })
    expect(container.querySelector('.strand-toast--info')).toBeTruthy()
  })

  it('renders status prefix for info', () => {
    const { container } = render(Toast, {
      props: { message: 'Note', status: 'info' },
    })
    const status = container.querySelector('.strand-toast__status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent('INFO')
  })

  it('renders status prefix for success as COMPLETE', () => {
    const { container } = render(Toast, {
      props: { message: 'OK', status: 'success' },
    })
    const status = container.querySelector('.strand-toast__status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent('COMPLETE')
  })

  it('renders status prefix for warning', () => {
    const { container } = render(Toast, {
      props: { message: 'Warn', status: 'warning' },
    })
    const status = container.querySelector('.strand-toast__status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent('WARNING')
  })

  it('renders status prefix for error', () => {
    const { container } = render(Toast, {
      props: { message: 'Fail', status: 'error' },
    })
    const status = container.querySelector('.strand-toast__status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent('ERROR')
  })
})

describe('ToastProvider + useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function renderWithProvider(triggerProps: Record<string, unknown> = {}) {
    return render(ToastProvider, {
      slots: {
        default: () =>
          h(TestTrigger, {
            message: 'Test message',
            ...triggerProps,
          }),
      },
    })
  }

  it('renders children', () => {
    const { getByText } = render(ToastProvider, {
      slots: { default: '<p>App content</p>' },
    })
    expect(getByText('App content')).toBeTruthy()
  })

  it('useToast adds a toast that renders message', async () => {
    const { getByText } = renderWithProvider({ message: 'Hello toast' })
    await fireEvent.click(getByText('Trigger'))
    expect(getByText('Hello toast')).toBeTruthy()
  })

  it('toast has correct status class', async () => {
    const { getByText, container } = renderWithProvider({
      message: 'Error occurred',
      status: 'error',
    })
    await fireEvent.click(getByText('Trigger'))
    expect(container.querySelector('.strand-toast--error')).toBeTruthy()
  })

  it('toast has role status', async () => {
    const { getByText, getAllByRole } = renderWithProvider({
      message: 'Status toast',
    })
    await fireEvent.click(getByText('Trigger'))
    const statuses = getAllByRole('status')
    expect(statuses.length).toBeGreaterThan(0)
  })

  it('error toast in provider has aria-live assertive', async () => {
    const { getByText, container } = renderWithProvider({
      message: 'Err',
      status: 'error',
    })
    await fireEvent.click(getByText('Trigger'))
    const toast = container.querySelector('.strand-toast--error')!
    expect(toast.getAttribute('aria-live')).toBe('assertive')
  })

  it('toast auto-dismisses after duration', async () => {
    const { getByText, queryByText } = renderWithProvider({
      message: 'Vanishing',
      duration: 3000,
    })
    await fireEvent.click(getByText('Trigger'))
    expect(getByText('Vanishing')).toBeTruthy()

    vi.advanceTimersByTime(3000)
    await vi.dynamicImportSettled()

    expect(queryByText('Vanishing')).toBeNull()
  })

  it('dismiss button removes toast', async () => {
    const { getByText, getByLabelText, queryByText } = renderWithProvider({
      message: 'Dismissable',
    })
    await fireEvent.click(getByText('Trigger'))
    expect(getByText('Dismissable')).toBeTruthy()

    await fireEvent.click(getByLabelText('Dismiss'))
    expect(queryByText('Dismissable')).toBeNull()
  })

  it('defaults to info status when none provided', async () => {
    const { getByText, container } = renderWithProvider({
      message: 'Default info',
    })
    await fireEvent.click(getByText('Trigger'))
    expect(container.querySelector('.strand-toast--info')).toBeTruthy()
  })

  it('multiple toasts stack', async () => {
    const { getByText, container } = renderWithProvider({
      message: 'First',
    })
    await fireEvent.click(getByText('Trigger'))
    await fireEvent.click(getByText('Trigger'))
    const toasts = container.querySelectorAll('.strand-toast')
    expect(toasts.length).toBe(2)
  })
})

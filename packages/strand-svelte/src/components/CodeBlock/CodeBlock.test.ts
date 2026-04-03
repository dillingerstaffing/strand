/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import CodeBlock from './CodeBlock.svelte'

describe('CodeBlock', () => {
  it('renders with default class', () => {
    const { container } = render(CodeBlock, { props: { code: 'const x = 1' } })
    expect(container.querySelector('.strand-code-block')).toBeInTheDocument()
  })

  it('renders code content', () => {
    const { container } = render(CodeBlock, { props: { code: 'console.log("hi")' } })
    const code = container.querySelector('.strand-code-block__pre code')
    expect(code).toHaveTextContent('console.log("hi")')
  })

  it('shows language label when provided', () => {
    const { container } = render(CodeBlock, { props: { code: 'x = 1', language: 'python' } })
    const label = container.querySelector('.strand-code-block__label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent('python')
  })

  it('does not show label when language is not provided', () => {
    const { container } = render(CodeBlock, { props: { code: 'x = 1' } })
    expect(container.querySelector('.strand-code-block__label')).not.toBeInTheDocument()
  })

  it('renders pre and code elements', () => {
    const { container } = render(CodeBlock, { props: { code: 'test' } })
    expect(container.querySelector('.strand-code-block__pre')).toBeInTheDocument()
    expect(container.querySelector('code')).toBeInTheDocument()
  })
})

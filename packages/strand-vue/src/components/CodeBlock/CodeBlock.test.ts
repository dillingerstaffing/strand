import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import CodeBlock from './CodeBlock.vue'

describe('CodeBlock', () => {
  // ── Rendering ──

  it('renders a div element', () => {
    const { container } = render(CodeBlock, {
      props: { code: 'console.log("hello")' },
    })
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('applies strand-code-block base class', () => {
    const { container } = render(CodeBlock, {
      props: { code: 'test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-code-block')
  })

  // ── Code content ──

  it('renders code content', () => {
    const { container } = render(CodeBlock, {
      props: { code: 'npm install' },
    })
    const codeEl = container.querySelector('code')
    expect(codeEl?.textContent).toBe('npm install')
  })

  it('renders a pre element containing code', () => {
    const { container } = render(CodeBlock, {
      props: { code: 'test' },
    })
    const pre = container.querySelector('.strand-code-block__pre')
    expect(pre).toBeTruthy()
    expect(pre?.tagName).toBe('PRE')
    expect(pre?.querySelector('code')).toBeTruthy()
  })

  // ── Language label ──

  it('renders language label when provided', () => {
    const { container } = render(CodeBlock, {
      props: { code: 'npm install', language: 'bash' },
    })
    const label = container.querySelector('.strand-code-block__label')
    expect(label).toBeTruthy()
    expect(label?.textContent).toBe('bash')
  })

  it('does not render label when language is omitted', () => {
    const { container } = render(CodeBlock, {
      props: { code: 'test' },
    })
    const label = container.querySelector('.strand-code-block__label')
    expect(label).toBeNull()
  })

  // ── Custom className ──

  it('merges custom className', () => {
    const { container } = render(CodeBlock, {
      props: { code: 'test', className: 'custom' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-code-block')
    expect(el?.className).toContain('custom')
  })

  // ── Code whitespace ──

  it('preserves whitespace in code content', () => {
    const code = 'function hello() {\n  return "world";\n}'
    const { container } = render(CodeBlock, {
      props: { code },
    })
    const codeEl = container.querySelector('code')
    expect(codeEl?.textContent).toBe(code)
  })

  // ── Props forwarding ──

  it('forwards additional attributes', () => {
    const { container } = render(CodeBlock, {
      props: { code: 'test' },
      attrs: { id: 'my-code' },
    })
    expect(container.firstElementChild?.getAttribute('id')).toBe('my-code')
  })
})

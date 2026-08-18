/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { cx } from "../../internal/index.js";

export interface CodeBlockProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "label"> {
  code: string;
  /** Language label, e.g. "html". */
  language?: string;
  /** Render the copy control. */
  copyable?: boolean;
}

const COPIED_DURATION_MS = 1500;

/**
 * Code display with a language label and copy-to-clipboard.
 *
 * @example
 * <CodeBlock code={`const x = 42;`} language="js" />
 */
export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(({ code, language, copyable = true, className = "", ...rest }, ref) => {
  const [copies, setCopies] = useState(0);
  const copied = copies > 0;
  useEffect(() => {
    if (!copies) return;
    const timer = setTimeout(() => setCopies(0), COPIED_DURATION_MS);
    return () => clearTimeout(timer);
  }, [copies]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopies((n) => n + 1);
    } catch {
      // A refused clipboard is not an error the caller can act on.
    }
  };
  return (
    <div ref={ref} className={cx("strand-code-block", className)} data-strand-copy={copyable ? "" : undefined} {...rest}>
      {language && <span className="strand-code-block__label">{language}</span>}
      <pre className="strand-code-block__pre">
        <code>{code}</code>
      </pre>
      {copyable && (
        <button
          type="button"
          className={cx("strand-code-block__copy", copied && "strand-code-block__copy--copied")}
          aria-label={copied ? "Copied" : "Copy code to clipboard"}
          onClick={copy}
        >
          <svg className="strand-code-block__copy-icon strand-code-block__copy-icon--clipboard" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M6 3 V2 a1 1 0 0 1 1-1 h2 a1 1 0 0 1 1 1 v1 M5 3 h6 a1 1 0 0 1 1 1 v9 a1 1 0 0 1 -1 1 h-6 a1 1 0 0 1 -1 -1 v-9 a1 1 0 0 1 1 -1 z" />
          </svg>
          <svg className="strand-code-block__copy-icon strand-code-block__copy-icon--check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M3 8 l3 3 l7 -7" />
          </svg>
        </button>
      )}
    </div>
  );
});
CodeBlock.displayName = "CodeBlock";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

export interface CodeBlockProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "label"> {
  /** The code content to display */
  code: string;
  /** Optional language label (e.g. "html", "css", "bash") */
  language?: string;
  /**
   * Render the one-click copy-to-clipboard button. Defaults to true so
   * every CodeBlock is copyable out of the box; pass false to opt out
   * for blocks that should not advertise a copy affordance (e.g. error
   * placeholders or dummy code).
   */
  copyable?: boolean;
}

const COPIED_DURATION_MS = 1500;

/**
 * Syntax-highlighted code display with optional language label and copy-to-clipboard.
 *
 * @example
 * ```tsx
 * import { CodeBlock } from '@dillingerstaffing/strand-ui';
 *
 * <CodeBlock
 *   code={`const x = 42;`}
 *   language="js"
 *   copyable
 * />
 * ```
 */
export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ code, language, copyable = true, className = "", ...rest }, ref) => {
    const classes = ["strand-code-block", className].filter(Boolean).join(" ");
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
      return () => {
        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
        }
      };
    }, []);

    const handleCopy = useCallback(async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(code);
        } else {
          // Legacy fallback for non-secure contexts (e.g. http://localhost
          // in some browsers). The textarea is taken out of layout so it
          // never affects scroll position.
          const ta = document.createElement("textarea");
          ta.value = code;
          ta.setAttribute("readonly", "");
          ta.style.position = "absolute";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        setCopied(true);
        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(() => {
          setCopied(false);
        }, COPIED_DURATION_MS);
      } catch {
        // Ignore: copy failure should never throw to the caller.
      }
    }, [code]);

    return (
      <div
        ref={ref}
        className={classes}
        data-strand-copy={copyable ? "" : undefined}
        {...rest}
      >
        {language && (
          <span className="strand-code-block__label">{language}</span>
        )}
        <pre className="strand-code-block__pre">
          <code>{code}</code>
        </pre>
        {copyable && (
          <button
            type="button"
            class={`strand-code-block__copy${copied ? " strand-code-block__copy--copied" : ""}`}
            aria-label={copied ? "Copied" : "Copy code to clipboard"}
            onClick={handleCopy}
          >
            <svg
              class="strand-code-block__copy-icon strand-code-block__copy-icon--clipboard"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M6 3 V2 a1 1 0 0 1 1-1 h2 a1 1 0 0 1 1 1 v1 M5 3 h6 a1 1 0 0 1 1 1 v9 a1 1 0 0 1 -1 1 h-6 a1 1 0 0 1 -1 -1 v-9 a1 1 0 0 1 1 -1 z" />
            </svg>
            <svg
              class="strand-code-block__copy-icon strand-code-block__copy-icon--check"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M3 8 l3 3 l7 -7" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

CodeBlock.displayName = "CodeBlock";

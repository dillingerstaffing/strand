/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useLayoutEffect, useRef } from "preact/hooks";
import { cx, mergeRefs } from "../../internal/index.js";

export interface TextareaProps extends Omit<JSX.HTMLAttributes<HTMLTextAreaElement>, "onInput" | "value"> {
  /** Grow to fit the content. */
  autoResize?: boolean;
  /** Show `length/maxLength`; needs `maxLength`. */
  showCount?: boolean;
  /** Error styling and `aria-invalid`. */
  error?: boolean;
  maxLength?: number;
  onInput?: JSX.GenericEventHandler<HTMLTextAreaElement>;
  disabled?: boolean;
  value?: string;
}

/** Fits a textarea's height to its content; the only imperative write, and it needs the box. */
function fit(el: HTMLTextAreaElement | null): void {
  if (!el) return;
  const previous = el.style.height;
  el.style.height = "auto";
  const content = el.scrollHeight;
  // A zero scrollHeight means no layout engine is running; leave the element as it was.
  if (content > 0) el.style.height = `${content}px`;
  else if (previous) el.style.height = previous;
  else if (el.style.length === 0 || (el.style.length === 1 && el.style.height === "auto")) el.removeAttribute("style");
}

/**
 * Multi-line text input with autosize and a character count.
 *
 * @example
 * <Textarea value={text} onInput={(e) => setText(e.currentTarget.value)} maxLength={500} showCount autoResize />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ autoResize = false, showCount = false, error = false, maxLength, disabled, className = "", value, onInput, ...rest }, ref) => {
    const own = useRef<HTMLTextAreaElement | null>(null);
    useLayoutEffect(() => {
      if (autoResize) fit(own.current);
    }, [autoResize, value]);
    return (
      <div className={cx("strand-textarea", error && "strand-textarea--error", disabled && "strand-textarea--disabled", autoResize && "strand-textarea--auto-resize", className)}>
        <textarea
          ref={mergeRefs(own, ref)}
          className="strand-textarea__field"
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          maxLength={maxLength}
          value={value}
          onInput={(e) => {
            if (autoResize) fit(e.currentTarget);
            onInput?.(e);
          }}
          {...rest}
        />
        {showCount && maxLength != null && (
          <span className="strand-textarea__count" aria-live="polite">
            {typeof value === "string" ? value.length : 0}/{maxLength}
          </span>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

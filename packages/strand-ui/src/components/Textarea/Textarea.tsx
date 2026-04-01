/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useCallback, useRef } from "preact/hooks";

export interface TextareaProps
  extends Omit<JSX.HTMLAttributes<HTMLTextAreaElement>, "onInput" | "value"> {
  /** Auto-resize to fit content */
  autoResize?: boolean;
  /** Show character count (requires maxLength) */
  showCount?: boolean;
  /** Show error styling */
  error?: boolean;
  /** Maximum character count */
  maxLength?: number;
  /** Input handler */
  onInput?: JSX.GenericEventHandler<HTMLTextAreaElement>;
  /** Disabled state */
  disabled?: boolean;
  /** Controlled value */
  value?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      autoResize = false,
      showCount = false,
      error = false,
      maxLength,
      disabled,
      className = "",
      value,
      onInput,
      ...rest
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const setRef = useCallback(
      (el: HTMLTextAreaElement | null) => {
        internalRef.current = el;
        if (typeof ref === "function") {
          ref(el);
        } else if (ref) {
          (ref as { current: HTMLTextAreaElement | null }).current = el;
        }
      },
      [ref],
    );

    const handleInput: JSX.GenericEventHandler<HTMLTextAreaElement> = useCallback(
      (e) => {
        if (autoResize && internalRef.current) {
          internalRef.current.style.height = "auto";
          internalRef.current.style.height = `${internalRef.current.scrollHeight}px`;
        }
        if (onInput) {
          onInput(e);
        }
      },
      [autoResize, onInput],
    );

    const wrapperClasses = [
      "strand-textarea",
      error && "strand-textarea--error",
      disabled && "strand-textarea--disabled",
      autoResize && "strand-textarea--auto-resize",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const currentLength =
      typeof value === "string" ? value.length : 0;

    return (
      <div className={wrapperClasses}>
        <textarea
          ref={setRef}
          className="strand-textarea__field"
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          maxLength={maxLength}
          value={value}
          onInput={handleInput}
          {...rest}
        />
        {showCount && maxLength != null && (
          <span className="strand-textarea__count" aria-live="polite">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export interface CodeBlockProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "label"> {
  /** The code content to display */
  code: string;
  /** Optional language label (e.g. "html", "css", "bash") */
  language?: string;
}

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ code, language, className = "", ...rest }, ref) => {
    const classes = ["strand-code-block", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        {language && (
          <span className="strand-code-block__label">{language}</span>
        )}
        <pre className="strand-code-block__pre">
          <code>{code}</code>
        </pre>
      </div>
    );
  },
);

CodeBlock.displayName = "CodeBlock";

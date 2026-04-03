import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { CodeBlock } from "./CodeBlock.js";

describe("CodeBlock", () => {
  // ── Rendering ──

  it("renders code content", () => {
    const { getByText } = render(
      <CodeBlock code="console.log('hello')" />,
    );
    expect(getByText("console.log('hello')")).toBeTruthy();
  });

  it("renders as a div element", () => {
    const { container } = render(
      <CodeBlock code="test" />,
    );
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("renders a pre element containing code", () => {
    const { container } = render(
      <CodeBlock code="test" />,
    );
    const pre = container.querySelector(".strand-code-block__pre");
    expect(pre).toBeTruthy();
    expect(pre?.tagName).toBe("PRE");
    expect(pre?.querySelector("code")).toBeTruthy();
  });

  // ── Base class ──

  it("applies strand-code-block base class", () => {
    const { container } = render(
      <CodeBlock code="test" />,
    );
    expect(container.firstElementChild?.className).toContain("strand-code-block");
  });

  // ── Language label ──

  it("renders language label when provided", () => {
    const { container } = render(
      <CodeBlock code="npm install" language="bash" />,
    );
    const label = container.querySelector(".strand-code-block__label");
    expect(label).toBeTruthy();
    expect(label?.textContent).toBe("bash");
  });

  it("does not render label when language is omitted", () => {
    const { container } = render(
      <CodeBlock code="test" />,
    );
    const label = container.querySelector(".strand-code-block__label");
    expect(label).toBeNull();
  });

  // ── Custom className ──

  it("merges custom className with component classes", () => {
    const { container } = render(
      <CodeBlock code="test" className="custom" />,
    );
    const el = container.firstElementChild;
    expect(el?.className).toContain("strand-code-block");
    expect(el?.className).toContain("custom");
  });

  // ── Code whitespace ──

  it("preserves whitespace in code content", () => {
    const code = "function hello() {\n  return 'world';\n}";
    const { container } = render(
      <CodeBlock code={code} />,
    );
    const codeEl = container.querySelector("code");
    expect(codeEl?.textContent).toBe(code);
  });

  // ── Forwarded props ──

  it("forwards additional props", () => {
    const { container } = render(
      <CodeBlock code="test" id="my-code" />,
    );
    expect(container.firstElementChild?.getAttribute("id")).toBe("my-code");
  });
});

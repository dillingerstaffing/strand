import { render } from "@testing-library/preact";
import type { ComponentChild } from "preact";

/** Serialize with attributes in name order, so a snapshot is order-independent. */
export function serialize(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return escapeText(node.textContent ?? "");
  if (node.nodeType === Node.COMMENT_NODE) return `<!--${node.textContent ?? ""}-->`;
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  const attrs = [...el.attributes]
    .map((a) => ({ name: a.name, value: a.value }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .map((a) => ` ${a.name}="${a.value.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"`)
    .join("");
  const children = [...el.childNodes].map(serialize).join("");
  return VOID.has(tag) ? `<${tag}${attrs}>` : `<${tag}${attrs}>${children}</${tag}>`;
}

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const escapeText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The HTML a node renders to. */
export function html(node: ComponentChild): string {
  const { container } = render(node);
  return [...container.childNodes].map(serialize).join("");
}

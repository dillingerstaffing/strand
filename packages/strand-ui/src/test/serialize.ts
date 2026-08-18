/** Serialize a DOM node with attributes in name order, so a comparison is order-independent. */
export function serialize(node: Node): string {
  if (node.nodeType === 3) return escapeText(node.textContent ?? "");
  if (node.nodeType === 8) return `<!--${node.textContent ?? ""}-->`;
  if (node.nodeType !== 1) return "";
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

const ID_ATTRS = ["id", "for", "aria-labelledby", "aria-describedby", "aria-controls", "aria-owns", "aria-activedescendant"];
const GENERATED_ID = /\b(?:P\d+-\d+|v-\d+|strand-[a-z-]+?-\d+|«r\d+»|:r\d+:)(?=[\s"-]|$)/g;

/**
 * The markup with framework artifacts removed: comment nodes, generated ids
 * (Preact `P0-0`, Vue `v-0`, module counters `strand-x-1`) replaced by `ID`,
 * the `value`, `checked` and `spellcheck` attributes of form controls (one
 * framework sets the property, another reflects it; the DOM state is the same),
 * and whitespace-only text between elements dropped.
 */
export function normalizeMarkup(html: string): string {
  let out = html.replace(/<!--[\s\S]*?-->/g, "");
  for (const attr of ID_ATTRS) {
    const re = new RegExp(`(\\s${attr}=")([^"]*)(")`, "g");
    out = out.replace(re, (_m, pre, value, post) => `${pre}${value.replace(GENERATED_ID, "ID")}${post}`);
  }
  out = out.replace(/<(input|textarea|select)\b([^>]*)>/g, (_m, tag, attrs) => `<${tag}${attrs.replace(/ (?:value|checked|spellcheck)="[^"]*"/g, "")}>`);
  return out.replace(/>\s+</g, "><").trim();
}

import { render } from "@testing-library/preact";
import type { ComponentChild } from "preact";
import { serialize } from "./serialize.js";

export { serialize } from "./serialize.js";

/** The HTML a node renders to. */
export function html(node: ComponentChild): string {
  const { container } = render(node);
  return [...container.childNodes].map(serialize).join("");
}

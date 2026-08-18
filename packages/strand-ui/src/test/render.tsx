import { render } from "@testing-library/preact";
import type { ComponentChild } from "preact";

/** The HTML a node renders to. */
export function html(node: ComponentChild): string {
  const { container } = render(node);
  return container.innerHTML;
}

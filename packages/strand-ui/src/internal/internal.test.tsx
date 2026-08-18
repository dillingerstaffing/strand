import { describe, expect, it } from "vitest";
import { createRef } from "preact";
import { html } from "../test/render.js";
import { cx, mergeRefs, styled } from "./index.js";

describe("cx", () => {
  it("joins the truthy parts", () => {
    expect(cx("a", false, "", null, undefined, 0, "b")).toBe("a b");
  });
});

describe("mergeRefs", () => {
  it("fills object refs and calls function refs", () => {
    const obj = createRef<HTMLDivElement>();
    let seen: HTMLDivElement | null = null;
    const el = document.createElement("div");
    mergeRefs<HTMLDivElement>(obj, (e) => {
      seen = e;
    }, null, undefined)(el);
    expect(obj.current).toBe(el);
    expect(seen).toBe(el);
  });
});

describe("styled", () => {
  const Box = styled("section", "strand-box", "Box");
  it("renders the tag with the base class, merges className, spreads rest, and forwards the ref", () => {
    const ref = createRef<HTMLElement>();
    const out = html(<Box ref={ref} className="extra" id="x">hi</Box>);
    expect(out).toContain('<section');
    expect(out).toContain('class="strand-box extra"');
    expect(out).toContain('id="x"');
    expect(out).toContain('>hi</section>');
    expect(ref.current?.tagName).toBe("SECTION");
    expect(Box.displayName).toBe("Box");
  });
});

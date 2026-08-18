import { describe, expect, it } from "vitest";
import { normalizeMarkup, serialize } from "./serialize.js";

describe("serialize", () => {
  it("writes attributes in name order and escapes text, so two frameworks' output can be compared", () => {
    const el = document.createElement("div");
    el.innerHTML = '<button type="button" class="a" aria-pressed="true">x &amp; y</button>';
    expect(serialize(el.firstChild as Node)).toBe('<button aria-pressed="true" class="a" type="button">x &amp; y</button>');
  });
});

describe("normalizeMarkup", () => {
  it("drops comment nodes and whitespace between elements", () => {
    expect(normalizeMarkup("<div><!--v-if--> <span>a</span>\n  <span>b</span></div>")).toBe("<div><span>a</span><span>b</span></div>");
  });

  it("replaces generated ids in id-carrying attributes only", () => {
    const html = '<button aria-controls="P0-0-panel-one" id="v-1-tab-one">One</button><div id="strand-tabs-3-panel-one" data-x="P0-0">p</div>';
    expect(normalizeMarkup(html)).toBe('<button aria-controls="ID-panel-one" id="ID-tab-one">One</button><div id="ID-panel-one" data-x="P0-0">p</div>');
  });

  it("drops the value, checked and spellcheck attributes of form controls, whose DOM state is the same either way", () => {
    expect(normalizeMarkup('<input checked="" class="x" type="checkbox" value="on"><option value="a">A</option>')).toBe('<input class="x" type="checkbox"><option value="a">A</option>');
  });
});

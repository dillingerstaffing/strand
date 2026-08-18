import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { ScrollReveal } from "./ScrollReveal.js";

describe("ScrollReveal", () => {
  // ── Rendering ──

  it("renders a div element", () => {
    const { container } = render(<ScrollReveal>Content</ScrollReveal>);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("DIV");
  });

  it("renders children", () => {
    const { getByText } = render(<ScrollReveal>Hello reveal</ScrollReveal>);
    expect(getByText("Hello reveal")).toBeTruthy();
  });

  // ── Custom className ──

  // ── Props forwarding ──

  it("forwards additional props", () => {
    const { container } = render(
      <ScrollReveal id="reveal-1" data-testid="reveal">
        Content
      </ScrollReveal>,
    );
    expect(container.firstElementChild?.getAttribute("id")).toBe("reveal-1");
  });

  // ── Props acceptance ──

  it("accepts threshold prop without error", () => {
    const { container } = render(
      <ScrollReveal threshold={0.5}>Content</ScrollReveal>,
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it("accepts once prop without error", () => {
    const { container } = render(
      <ScrollReveal once={false}>Content</ScrollReveal>,
    );
    expect(container.firstElementChild).toBeTruthy();
  });
});

describe("ScrollReveal manual reveal (CSS source guard)", () => {
  // Behavioral coverage lives in the consumer browser e2e (jsdom cannot compute
  // the @supports view-timeline cascade). This guard locks the source rule: a
  // manual reveal toggled --visible must set opacity:1 via a compound selector
  // that outranks the @supports base rule (which re-declares opacity:0 at equal
  // specificity, later in source order). Without it the reveal never appears and
  // replay does nothing.
  const css = readFileSync(resolve(__dirname, "./ScrollReveal.css"), "utf8").replace(
    /\s+/g,
    " ",
  );

  it("manual + visible sets opacity:1 with a compound selector that outranks the base rule", () => {
    expect(css).toContain(".strand-reveal--manual.strand-reveal--visible");
    expect(css).toContain(".strand-reveal-group--manual > .strand-reveal--visible");
    expect(css).toMatch(
      /\.strand-reveal-group--manual\s*>\s*\.strand-reveal--visible\s*\{[^}]*opacity:\s*1/,
    );
  });
});

// ── Reduced motion must out-specify every rule it undoes ──
//
// `prefers-reduced-motion` is a media query, not a browser behaviour. No UA
// suppresses an animation on its own, so the @media block in ScrollReveal.css
// is the entire mechanism. If it stops matching a selector, that reveal
// animates for a user who asked it not to.
//
// It had already stopped matching one. The reset listed `.strand-reveal`
// (0,1,0) while the group rule sets `animation` at `.strand-reveal-group >
// .strand-reveal` (0,2,0), so grouped reveals kept `animation-timeline:
// view()` and sat at opacity 0 under reduced motion. Verified in a browser
// before and after: grouped went opacity 0 / view() -> opacity 1 / none.
//
// The second-order cost is why this is guarded rather than just fixed. A
// scroll-driven reveal parks an element at partial opacity as a STABLE state,
// so any contrast audit run under emulated reduced motion on a page using
// reveal groups silently measures composited colours that belong to no token.
// It reports plausible numbers instead of failing, which is how a wrong
// diagnosis survives review.
describe("reduced motion covers every reveal selector", () => {
  const css = readFileSync(resolve(__dirname, "ScrollReveal.css"), "utf8");

  const reducedBlock = (() => {
    const start = css.indexOf("@media (prefers-reduced-motion: reduce)");
    if (start === -1) throw new Error("no reduced-motion block");
    // Walk braces so nested rules inside the media block are included.
    let depth = 0;
    for (let i = css.indexOf("{", start); i < css.length; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}" && --depth === 0) return css.slice(start, i + 1);
    }
    throw new Error("unbalanced reduced-motion block");
  })();

  it("finds the block and the animated selectors (guards the parse)", () => {
    expect(reducedBlock).toContain("prefers-reduced-motion");
    expect(css).toContain("animation-timeline: view()");
  });

  // Parse the block into real rules, because "the selector appears somewhere
  // in the block" is not the invariant. An earlier version of this test
  // asserted exactly that and survived a mutation that reintroduced the bug:
  // the group selector still appeared on the opacity rule while being removed
  // from the rule that kills the animation. The selector has to be attached to
  // the DECLARATION that undoes the motion.
  // Strip the @media wrapper first: parsing the block whole makes the media
  // query itself look like a selector and swallows the first inner rule.
  const blockBody = reducedBlock.slice(reducedBlock.indexOf("{") + 1, reducedBlock.lastIndexOf("}"));

  const rulesInBlock = [...blockBody.matchAll(/([^{}]+)\{([^}]*)\}/g)]
    .map(([, selector, body]) => ({
      selectors: selector.split(",").map((x) => x.trim()).filter(Boolean),
      body,
    }))
    .filter((r) => r.selectors.some((x) => x.startsWith(".strand-reveal")));

  const ruleSetting = (declaration: string) =>
    rulesInBlock.filter((r) => r.body.includes(declaration));

  it("neutralises the scroll-driven timeline for grouped reveals, not just plain ones", () => {
    const group = ".strand-reveal-group > .strand-reveal";
    for (const declaration of ["animation: none", "animation-timeline: auto", "opacity: 1"]) {
      const covering = ruleSetting(declaration);
      expect(covering.length, `no rule sets ${declaration}`).toBeGreaterThan(0);
      expect(
        covering.some((r) => r.selectors.includes(group)),
        `${group} is not covered by a rule setting ${declaration}`,
      ).toBe(true);
    }
  });

  it("kills the transition on manual reveals without forcing them visible", () => {
    // Manual reveals are consumer-driven. Reduced motion removes the motion;
    // it must not flip the toggle, or .strand-reveal--manual stops working.
    expect(reducedBlock).toMatch(/\.strand-reveal--manual/);
    expect(reducedBlock).toMatch(/:not\(\.strand-reveal--visible\)/);
  });

  it("covers every selector outside the block that drives reveal motion", () => {
    const animated = new Set<string>();
    const ruleRe = /([^{}]+)\{([^}]*)\}/g;
    const outside = css.split("@media (prefers-reduced-motion: reduce)")[0];
    let m = ruleRe.exec(outside);
    while (m !== null) {
      const [, selector, body] = m;
      if (/animation-timeline:\s*view\(\)|transition:\s*opacity/.test(body)) {
        for (const s of selector.split(",")) {
          const clean = s.trim();
          if (clean.startsWith(".strand-reveal")) animated.add(clean);
        }
      }
      m = ruleRe.exec(outside);
    }
    expect(animated.size).toBeGreaterThan(0);
    const uncovered = [...animated].filter((s) => !reducedBlock.includes(s));
    expect(uncovered, "reveal selectors with motion and no reduced-motion rule").toEqual([]);
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./ScrollReveal.fixtures.js";

snapshotFixtures(ScrollReveal, fixtures);

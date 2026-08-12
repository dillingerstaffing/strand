import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { BigMonoTime } from "./BigMonoTime.js";

// Figure ALIGNMENT is this primitive's reason to exist and jsdom cannot
// measure it; tabular-nums is a CSS fact asserted by the stylesheet. What
// is asserted here is the markup contract and the semantics.

describe("BigMonoTime", () => {
  it("renders the time", () => {
    const { container } = render(<BigMonoTime value="06:45" />);
    expect(container.querySelector(".strand-big-mono-time")?.textContent).toBe("06:45");
  });

  // A <time> without datetime asserts a machine-readable instant that is
  // not there, so the element type follows the data rather than the name.
  it("is a plain span when there is nothing machine-readable to carry", () => {
    const { container } = render(<BigMonoTime value="06:45" />);
    const el = container.querySelector(".strand-big-mono-time");
    expect(el?.tagName).toBe("SPAN");
    expect(el?.hasAttribute("datetime")).toBe(false);
  });

  it("is a <time> when given a machine-readable value", () => {
    const { container } = render(
      <BigMonoTime value="06:45" dateTime="2026-08-13T06:45" />,
    );
    const el = container.querySelector(".strand-big-mono-time");
    expect(el?.tagName).toBe("TIME");
    expect(el?.getAttribute("datetime")).toBe("2026-08-13T06:45");
  });

  it("renders a range with both ends", () => {
    const { container } = render(<BigMonoTime value="06:45" until="08:30" />);
    expect(container.textContent).toContain("06:45");
    expect(container.textContent).toContain("08:30");
  });

  // The dash is punctuation between two times. Announced, it interrupts
  // the reading of the pair; the surrounding label supplies "to".
  it("hides the range separator from the accessibility tree", () => {
    const { container } = render(<BigMonoTime value="06:45" until="08:30" />);
    expect(
      container.querySelector(".strand-big-mono-time__sep")?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("renders no separator for a single time", () => {
    const { container } = render(<BigMonoTime value="06:45" />);
    expect(container.querySelector(".strand-big-mono-time__sep")).toBeNull();
  });

  it("takes a size, and the default carries no modifier", () => {
    const { container: md } = render(<BigMonoTime value="06:45" />);
    expect(md.querySelector(".strand-big-mono-time")?.className).toBe(
      "strand-big-mono-time",
    );
    const { container: lg } = render(<BigMonoTime value="06:45" size="lg" />);
    expect(
      lg.querySelector(".strand-big-mono-time")?.classList.contains(
        "strand-big-mono-time--lg",
      ),
    ).toBe(true);
  });

  it("carries a consumer's class without dropping its own", () => {
    const { container } = render(<BigMonoTime value="06:45" className="x" />);
    const el = container.querySelector(".strand-big-mono-time");
    expect(el?.classList.contains("x")).toBe(true);
  });
});

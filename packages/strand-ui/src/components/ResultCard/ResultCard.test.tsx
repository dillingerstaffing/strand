import { fireEvent, render } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { ResultCard } from "./ResultCard.js";

describe("ResultCard", () => {
  it("renders the title and the optional lines", () => {
    const { container } = render(
      <ResultCard title="Systems Engineer" company="Acme" location="Oakland" salary="$120k" />,
    );
    expect(container.querySelector(".strand-result-card__title")?.textContent).toBe("Systems Engineer");
    expect(container.querySelector(".strand-result-card__company")?.textContent).toBe("Acme");
    expect(container.querySelector(".strand-result-card__location")?.textContent).toBe("Oakland");
    expect(container.querySelector(".strand-result-card__salary")?.textContent).toBe("$120k");
  });

  it("omits the meta row entirely when there is no metadata", () => {
    // An empty styled row would take vertical space and draw a border for
    // nothing, in a panel where every row competes for height.
    const { container } = render(<ResultCard title="Bare" />);
    expect(container.querySelector(".strand-result-card__meta")).toBeNull();
    expect(container.querySelector(".strand-result-card__company")).toBeNull();
  });

  it("renders badges with their variant tint", () => {
    const { container } = render(
      <ResultCard title="x" badges={[{ label: "Remote", variant: "remote" }, { label: "Feed" }]} />,
    );
    const badges = container.querySelectorAll(".strand-result-card__badge");
    expect(badges).toHaveLength(2);
    expect(badges[0].classList.contains("strand-result-card__badge--remote")).toBe(true);
    // A badge with no variant keeps the base class only, rather than
    // getting a `--undefined` modifier that matches no rule.
    expect(badges[1].className).toBe("strand-result-card__badge");
  });

  // A card that pans a map is a control and owes the keyboard the same
  // affordance as the mouse; a card that only displays is not.
  it("is an article when it does nothing", () => {
    const { container } = render(<ResultCard title="x" />);
    expect(container.querySelector(".strand-result-card")?.tagName).toBe("ARTICLE");
  });

  it("is a button when it is selectable, and reports activation", () => {
    const onSelect = vi.fn();
    const { container } = render(<ResultCard title="x" onSelect={onSelect} />);
    const el = container.querySelector(".strand-result-card") as HTMLElement;
    expect(el.tagName).toBe("BUTTON");
    expect(el.getAttribute("type")).toBe("button");
    fireEvent.click(el);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("announces the highlighted result rather than only tinting it", () => {
    const { container } = render(<ResultCard title="x" active />);
    const el = container.querySelector(".strand-result-card");
    expect(el?.classList.contains("strand-result-card--active")).toBe(true);
    expect(el?.getAttribute("aria-current")).toBe("true");
  });

  it("omits aria-current when it is not the active result", () => {
    const { container } = render(<ResultCard title="x" />);
    expect(container.querySelector(".strand-result-card")?.hasAttribute("aria-current")).toBe(false);
  });
});

import { fireEvent, render } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { ResultsPanel } from "./ResultsPanel.js";

describe("ResultsPanel", () => {
  it("is a labelled region", () => {
    const { container } = render(<ResultsPanel />);
    const el = container.querySelector(".strand-results-panel");
    expect(el?.tagName).toBe("SECTION");
    expect(el?.getAttribute("aria-label")).toBe("Results");
  });

  it("announces the count politely when a query re-runs", () => {
    // Polite, not assertive: a count re-announcing on every keystroke of a
    // live search interrupts more than it informs.
    const { container } = render(<ResultsPanel count="12 matches detected" />);
    const el = container.querySelector(".strand-results-panel__count");
    expect(el?.textContent).toBe("12 matches detected");
    expect(el?.getAttribute("aria-live")).toBe("polite");
  });

  it("renders its children in the results state", () => {
    const { container } = render(
      <ResultsPanel><div data-testid="row">one</div></ResultsPanel>,
    );
    expect(container.querySelector(".strand-results-panel__items")?.textContent).toBe("one");
  });

  // Three states, not two. A failed request and an empty result are
  // different answers and the user is owed the difference: "0 matches
  // detected" means the instrument ran, an error means it did not.
  it("shows the state block instead of items when empty", () => {
    const { container } = render(
      <ResultsPanel state="empty" stateTitle="0 matches detected" stateHint="Adjust parameters">
        <div>should not render</div>
      </ResultsPanel>,
    );
    expect(container.querySelector(".strand-results-panel__items")).toBeNull();
    expect(container.querySelector(".strand-results-panel__state-title")?.textContent).toBe("0 matches detected");
    expect(container.querySelector(".strand-results-panel__state-hint")?.textContent).toBe("Adjust parameters");
    expect(container.textContent).not.toContain("should not render");
  });

  it("offers a retry only in the error state", () => {
    const onRetry = vi.fn();
    const { container: empty } = render(
      <ResultsPanel state="empty" stateTitle="none" onRetry={onRetry} />,
    );
    // An empty result is not a failure, so there is nothing to retry.
    expect(empty.querySelector(".strand-results-panel__error-link")).toBeNull();

    const { container } = render(
      <ResultsPanel state="error" stateTitle="Process interrupted" onRetry={onRetry} />,
    );
    const btn = container.querySelector(".strand-results-panel__error-link") as HTMLElement;
    expect(btn).not.toBeNull();
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("shows no retry in the error state when the consumer gives no handler", () => {
    const { container } = render(<ResultsPanel state="error" stateTitle="x" />);
    expect(container.querySelector(".strand-results-panel__error-link")).toBeNull();
  });

  it("hides with the hidden attribute, leaving the accessibility tree", () => {
    const { container } = render(<ResultsPanel visible={false} />);
    expect(container.querySelector(".strand-results-panel")?.hasAttribute("hidden")).toBe(true);
  });
});

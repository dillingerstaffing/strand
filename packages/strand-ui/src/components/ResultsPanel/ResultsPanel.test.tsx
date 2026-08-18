import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/preact";
import { snapshotFixtures } from "../../test/snapshot.js";
import { ResultsPanel } from "./ResultsPanel.js";
import { fixtures } from "./ResultsPanel.fixtures.js";

snapshotFixtures(ResultsPanel, fixtures);

describe("ResultsPanel", () => {
  it("offers a retry only in the error state, and reports it", () => {
    const onRetry = vi.fn();
    const { getByRole, rerender, queryByRole } = render(<ResultsPanel state="error" stateTitle="Interrupted" onRetry={onRetry} />);
    fireEvent.click(getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    rerender(<ResultsPanel state="empty" stateTitle="0 matches" onRetry={onRetry} />);
    expect(queryByRole("button")).toBeNull();
  });
});

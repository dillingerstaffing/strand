import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/preact";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Alert } from "./Alert.js";
import { fixtures } from "./Alert.fixtures.js";

snapshotFixtures(Alert, fixtures);

describe("Alert", () => {
  it("the dismiss control calls onDismiss and takes its name from dismissLabel", () => {
    const onDismiss = vi.fn();
    const { getByRole } = render(<Alert dismissible onDismiss={onDismiss} dismissLabel="Close notice">x</Alert>);
    fireEvent.click(getByRole("button", { name: "Close notice" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("errors and warnings interrupt as alerts; the rest read as status", () => {
    const err = render(<Alert status="error">x</Alert>);
    expect(err.getByRole("alert")).toBeTruthy();
    err.unmount();
    const ok = render(<Alert status="success">x</Alert>);
    expect(ok.getByRole("status")).toBeTruthy();
  });

  it("sets a title above the message and an action after it", () => {
    const { getByRole, getByText } = render(
      <Alert title="Draft saved" action={<button type="button">Undo</button>}>
        Your changes are safe.
      </Alert>,
    );
    expect(getByText("Draft saved").className).toBe("strand-alert__title");
    expect(getByRole("button", { name: "Undo" }).closest(".strand-alert__action")).toBeTruthy();
  });
});

snapshotStylesheet(resolve(__dirname, "./Alert.css"));

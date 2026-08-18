import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/preact";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Alert } from "./Alert.js";
import { fixtures } from "./Alert.fixtures.js";

snapshotFixtures(Alert, fixtures);

describe("Alert", () => {
  it("the dismiss control calls onDismiss", () => {
    const onDismiss = vi.fn();
    const { getByRole } = render(<Alert dismissible onDismiss={onDismiss}>x</Alert>);
    fireEvent.click(getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

snapshotStylesheet(resolve(__dirname, "./Alert.css"));

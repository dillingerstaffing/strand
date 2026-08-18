import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Progress } from "./Progress.js";
import { fixtures } from "./Progress.fixtures.js";

describe("Progress", () => {
  it("is a progressbar named by label that reads valueText in place of the percentage", () => {
    const { getByRole } = render(<Progress value={30} label="Upload" valueText="3 of 10 files" />);
    const bar = getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "30");
    expect(bar).toHaveAttribute("aria-valuetext", "3 of 10 files");
  });

  it("omits aria-valuenow while indeterminate", () => {
    const { getByRole } = render(<Progress />);
    expect(getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });
});

snapshotFixtures(Progress, fixtures);

snapshotStylesheet(resolve(__dirname, "./Progress.css"));

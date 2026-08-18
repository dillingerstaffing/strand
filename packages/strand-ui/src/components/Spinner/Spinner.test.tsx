import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Spinner } from "./Spinner.js";
import { fixtures } from "./Spinner.fixtures.js";

describe("Spinner", () => {
  it("is a status region that reads Loading, or the given label", () => {
    const plain = render(<Spinner />);
    expect(plain.getByRole("status")).toHaveTextContent("Loading");
    plain.unmount();
    const named = render(<Spinner label="Loading events" />);
    expect(named.getByRole("status")).toHaveTextContent("Loading events");
  });
});

snapshotFixtures(Spinner, fixtures);

snapshotStylesheet(resolve(__dirname, "./Spinner.css"));

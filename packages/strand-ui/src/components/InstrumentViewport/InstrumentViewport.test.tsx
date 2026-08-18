import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { InstrumentViewport } from "./InstrumentViewport.js";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./InstrumentViewport.fixtures.js";

describe("InstrumentViewport", () => {
  it("renders children", () => {
    const { getByText } = render(<InstrumentViewport>Hello viewport</InstrumentViewport>);
    expect(getByText("Hello viewport")).toBeTruthy();
  });

  it("forwards additional props", () => {
    const { container } = render(
      <InstrumentViewport id="vp-1" data-testid="viewport">
        Content
      </InstrumentViewport>,
    );
    expect(container.firstElementChild?.getAttribute("id")).toBe("vp-1");
  });
});

snapshotFixtures(InstrumentViewport, fixtures);

snapshotStylesheet(resolve(__dirname, "./InstrumentViewport.css"));

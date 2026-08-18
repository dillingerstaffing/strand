import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Divider } from "./Divider.js";
import { fixtures } from "./Divider.fixtures.js";

describe("Divider", () => {
  it("is a horizontal rule that takes any attribute, and a labelled or vertical separator otherwise", () => {
    const plain = render(<Divider data-testid="d" />);
    expect(plain.getByTestId("d").tagName).toBe("HR");
    plain.unmount();
    const labelled = render(<Divider label={<em>or</em>} />);
    expect(labelled.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
    expect(labelled.container.querySelector(".strand-divider__label em")).toHaveTextContent("or");
    labelled.unmount();
    const vertical = render(<Divider direction="vertical" />);
    expect(vertical.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });
});

snapshotFixtures(Divider, fixtures);

snapshotStylesheet(resolve(__dirname, "./Divider.css"));

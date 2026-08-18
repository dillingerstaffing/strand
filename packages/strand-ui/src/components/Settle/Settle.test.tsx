import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Settle } from "./Settle.js";
import { fixtures } from "./Settle.fixtures.js";

snapshotFixtures(Settle, fixtures);

// jsdom runs no animations; the motion tier proves the fade. What jsdom can
// prove is the identity contract the fade rests on (DL 6.9.1): a changed `on`
// replaces the node, an unchanged one keeps it.
describe("Settle identity", () => {
  it("replaces the node when the value changes", () => {
    const { container, rerender } = render(<Settle as="span" on={6}>6 people</Settle>);
    const before = container.firstElementChild;
    rerender(<Settle as="span" on={7}>7 people</Settle>);
    expect(container.firstElementChild).not.toBe(before);
    expect(container.textContent).toContain("7 people");
  });
  it("keeps the node when the value did not change", () => {
    const { container, rerender } = render(<Settle as="span" on={6}>6 people</Settle>);
    const before = container.firstElementChild;
    rerender(<Settle as="span" on={6}>6 people</Settle>);
    expect(container.firstElementChild).toBe(before);
  });
  it("treats a changed branch name and a count falling to zero as changes", () => {
    const a = render(<Settle on="join">Join</Settle>);
    const before = a.container.firstElementChild;
    a.rerender(<Settle on="joined">Joined</Settle>);
    expect(a.container.firstElementChild).not.toBe(before);
    const b = render(<Settle on={1}>1</Settle>);
    const one = b.container.firstElementChild;
    b.rerender(<Settle on={0}>0</Settle>);
    expect(b.container.firstElementChild).not.toBe(one);
  });
});

snapshotStylesheet(resolve(__dirname, "./Settle.css"));

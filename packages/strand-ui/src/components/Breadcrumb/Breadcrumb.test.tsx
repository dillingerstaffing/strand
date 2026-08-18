import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/preact";
import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { Breadcrumb } from "./Breadcrumb.js";
import { fixtures } from "./Breadcrumb.fixtures.js";

describe("Breadcrumb", () => {
  it("is a navigation landmark named Breadcrumb, or by label, whose last item is the current page", () => {
    const { getByRole, container } = render(<Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Profile" }]} />);
    expect(getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    expect(getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(container.querySelector('[aria-current="page"]')).toHaveTextContent("Profile");
    const named = render(<Breadcrumb label="You are here" items={[{ label: "A" }]} />);
    expect(named.getByRole("navigation", { name: "You are here" })).toBeTruthy();
  });

  it("renders an item without an href as a button and calls its onClick", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<Breadcrumb items={[{ label: "Back", onClick }, { label: "Here" }]} />);
    fireEvent.click(getByRole("button", { name: "Back" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("puts the separator, hidden from assistive tech, between items", () => {
    const { container } = render(<Breadcrumb separator={<span data-sep />} items={[{ label: "A", href: "/a" }, { label: "B" }]} />);
    const seps = container.querySelectorAll(".strand-breadcrumb__separator[aria-hidden='true'] [data-sep]");
    expect(seps).toHaveLength(1);
  });
});

snapshotFixtures(Breadcrumb, fixtures);

snapshotStylesheet(resolve(__dirname, "./Breadcrumb.css"));

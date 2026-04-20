import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { KvEditorial } from "./KvEditorial.js";

describe("KvEditorial", () => {
  it("renders a div with the strand-kv base class", () => {
    const { container } = render(
      <KvEditorial label="Owner" value="DS" />,
    );
    expect(container.firstElementChild?.className).toContain("strand-kv");
  });

  it("applies the --editorial modifier", () => {
    const { container } = render(
      <KvEditorial label="Owner" value="DS" />,
    );
    expect(container.firstElementChild?.className).toContain(
      "strand-kv--editorial",
    );
  });

  it("renders label and value in separate spans", () => {
    const { container, getByText } = render(
      <KvEditorial label="Owner" value="DS" />,
    );
    const labelEl = container.querySelector(".strand-kv__label");
    const valueEl = container.querySelector(".strand-kv__value");
    expect(labelEl).toBeTruthy();
    expect(valueEl).toBeTruthy();
    expect(getByText("Owner")).toBeTruthy();
    expect(getByText("DS")).toBeTruthy();
  });

  it("does not apply --status modifier by default", () => {
    const { container } = render(
      <KvEditorial label="Owner" value="DS" />,
    );
    const valueEl = container.querySelector(".strand-kv__value");
    expect(valueEl?.className).not.toContain("strand-kv__value--status");
  });

  it("applies --status modifier to the value when status is true", () => {
    const { container } = render(
      <KvEditorial label="State" value="Live" status />,
    );
    const valueEl = container.querySelector(".strand-kv__value");
    expect(valueEl?.className).toContain("strand-kv__value--status");
  });

  it("merges custom className with base", () => {
    const { container } = render(
      <KvEditorial className="custom" label="A" value="B" />,
    );
    expect(container.firstElementChild?.className).toContain("custom");
    expect(container.firstElementChild?.className).toContain(
      "strand-kv--editorial",
    );
  });

  it("forwards additional props", () => {
    const { container } = render(
      <KvEditorial id="k-1" label="A" value="B" />,
    );
    expect(container.firstElementChild?.getAttribute("id")).toBe("k-1");
  });

  it("accepts ComponentChildren for label and value (node support)", () => {
    const { container } = render(
      <KvEditorial
        label={<strong>Label</strong>}
        value={<em>Value</em>}
      />,
    );
    expect(container.querySelector(".strand-kv__label strong")).toBeTruthy();
    expect(container.querySelector(".strand-kv__value em")).toBeTruthy();
  });
});

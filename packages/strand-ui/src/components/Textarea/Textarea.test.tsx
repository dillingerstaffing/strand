import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Textarea } from "./Textarea.js";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    const { container } = render(<Textarea aria-label="Message" />);
    expect(container.querySelector("textarea")).toBeTruthy();
  });

  it("displays placeholder text", () => {
    const { getByPlaceholderText } = render(
      <Textarea placeholder="Enter message" aria-label="Message" />
    );
    expect(getByPlaceholderText("Enter message")).toBeTruthy();
  });

  it("calls onInput when value changes", () => {
    const onInput = vi.fn();
    const { container } = render(
      <Textarea aria-label="Message" onInput={onInput} />
    );
    fireEvent.input(container.querySelector("textarea")!, {
      target: { value: "hello" },
    });
    expect(onInput).toHaveBeenCalled();
  });

  it("shows character count when showCount and maxLength are set", () => {
    const { container } = render(
      <Textarea aria-label="Message" showCount maxLength={100} value="hello" />
    );
    const count = container.querySelector(".strand-textarea__count");
    expect(count).toBeTruthy();
    expect(count!.textContent).toBe("5/100");
  });

  it("does not show character count without showCount", () => {
    const { container } = render(
      <Textarea aria-label="Message" maxLength={100} value="hello" />
    );
    expect(container.querySelector(".strand-textarea__count")).toBeNull();
  });

  it("applies auto-resize class when autoResize is true", () => {
    const { container } = render(
      <Textarea aria-label="Message" autoResize />
    );
    expect(
      container.querySelector(".strand-textarea--auto-resize")
    ).toBeTruthy();
  });

  it("applies error class when error is true", () => {
    const { container } = render(<Textarea aria-label="Message" error />);
    expect(
      container.querySelector(".strand-textarea--error")
    ).toBeTruthy();
  });

  it("sets aria-invalid when error is true", () => {
    const { container } = render(<Textarea aria-label="Message" error />);
    expect(container.querySelector("textarea")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("sets disabled attribute when disabled", () => {
    const { container } = render(<Textarea aria-label="Message" disabled />);
    expect(container.querySelector("textarea")).toBeDisabled();
  });

  it("applies disabled class when disabled", () => {
    const { container } = render(<Textarea aria-label="Message" disabled />);
    expect(
      container.querySelector(".strand-textarea--disabled")
    ).toBeTruthy();
  });

});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./Textarea.fixtures.js";

snapshotFixtures(Textarea, fixtures);

snapshotStylesheet(resolve(__dirname, "./Textarea.css"));

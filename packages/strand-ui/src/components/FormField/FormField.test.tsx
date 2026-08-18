import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { FormField } from "./FormField.js";

describe("FormField", () => {
  it("renders label text", () => {
    const { getByText } = render(
      <FormField label="Name" htmlFor="name">
        <input id="name" />
      </FormField>
    );
    expect(getByText("Name")).toBeTruthy();
  });

  it("renders children (input element)", () => {
    const { container } = render(
      <FormField label="Name" htmlFor="name">
        <input id="name" />
      </FormField>
    );
    expect(container.querySelector("input#name")).toBeTruthy();
  });

  it("shows hint text when provided", () => {
    const { getByText } = render(
      <FormField label="Name" htmlFor="name" hint="Enter your full name">
        <input id="name" />
      </FormField>
    );
    expect(getByText("Enter your full name")).toBeTruthy();
  });

  it("shows error text when provided", () => {
    const { getByText } = render(
      <FormField label="Name" htmlFor="name" error="Name is required">
        <input id="name" />
      </FormField>
    );
    expect(getByText("Name is required")).toBeTruthy();
  });

  it("shows required indicator when required", () => {
    const { container } = render(
      <FormField label="Name" htmlFor="name" required>
        <input id="name" />
      </FormField>
    );
    const indicator = container.querySelector(".strand-form-field__required");
    expect(indicator).toBeTruthy();
    expect(indicator!.textContent).toBe("*");
  });

  it("error replaces hint when both are present", () => {
    const { queryByText } = render(
      <FormField
        label="Name"
        htmlFor="name"
        hint="Enter your full name"
        error="Name is required"
      >
        <input id="name" />
      </FormField>
    );
    expect(queryByText("Name is required")).toBeTruthy();
    expect(queryByText("Enter your full name")).toBeNull();
  });

  it("label has htmlFor attribute", () => {
    const { container } = render(
      <FormField label="Email" htmlFor="email">
        <input id="email" />
      </FormField>
    );
    const label = container.querySelector("label");
    expect(label).toHaveAttribute("for", "email");
  });

  it("applies error class when error is present", () => {
    const { container } = render(
      <FormField label="Name" htmlFor="name" error="Required">
        <input id="name" />
      </FormField>
    );
    expect(
      container.querySelector(".strand-form-field--error")
    ).toBeTruthy();
  });

  // ── Success: the third message state ──

  it("confirms a checked value without shouting it", () => {
    // Polite, not assertive: this arrives while the member is still typing, so
    // an alert region would interrupt a screen reader to deliver good news.
    const { container } = render(
      <FormField label="Name" htmlFor="name" success="Available.">
        <input id="name" />
      </FormField>
    );
    const el = container.querySelector(".strand-form-field__success");
    expect(el?.textContent).toBe("Available.");
    expect(el?.getAttribute("role")).toBe("status");
  });

  it("shows the problem rather than the confirmation when both are set", () => {
    // A field reading "taken" above "Available." argues with itself.
    const { container } = render(
      <FormField label="Name" htmlFor="name" error="Taken" success="Available." hint="2 to 30">
        <input id="name" />
      </FormField>
    );
    expect(container.querySelector(".strand-form-field__error")?.textContent).toBe("Taken");
    expect(container.querySelector(".strand-form-field__success")).toBeNull();
    expect(container.querySelector(".strand-form-field__hint")).toBeNull();
  });

  it("replaces the hint, so one input never carries two instructions", () => {
    const { container } = render(
      <FormField label="Name" htmlFor="name" success="Available." hint="2 to 30">
        <input id="name" />
      </FormField>
    );
    expect(container.querySelector(".strand-form-field__success")).toBeTruthy();
    expect(container.querySelector(".strand-form-field__hint")).toBeNull();
  });

  // ── The control is actually described ──

  it("points the control at whichever message is showing", () => {
    // Every message this component has ever rendered was announced by nothing
    // on focus: the ids existed and no control referenced them.
    const hint = render(
      <FormField label="Name" htmlFor="name" hint="2 to 30">
        <input id="name" />
      </FormField>
    );
    expect(
      hint.container.querySelector("#name")?.getAttribute("aria-describedby")
    ).toBe("name-hint");

    const err = render(
      <FormField label="Name" htmlFor="name" hint="2 to 30" error="Taken">
        <input id="name" />
      </FormField>
    );
    expect(
      err.container.querySelector("#name")?.getAttribute("aria-describedby")
    ).toBe("name-error");
  });

  it("keeps a description the caller set themselves", () => {
    const { container } = render(
      <FormField label="Name" htmlFor="name" hint="2 to 30">
        <input id="name" aria-describedby="name-extra" />
      </FormField>
    );
    expect(
      container.querySelector("#name")?.getAttribute("aria-describedby")
    ).toBe("name-extra name-hint");
  });

  it("describes nothing when there is no message", () => {
    const { container } = render(
      <FormField label="Name" htmlFor="name">
        <input id="name" />
      </FormField>
    );
    expect(container.querySelector("#name")?.getAttribute("aria-describedby")).toBeNull();
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./FormField.fixtures.js";

snapshotFixtures(FormField, fixtures);

snapshotStylesheet(resolve(__dirname, "./FormField.css"));

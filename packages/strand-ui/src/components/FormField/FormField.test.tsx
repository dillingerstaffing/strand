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

  it("merges custom className", () => {
    const { container } = render(
      <FormField label="Name" htmlFor="name" className="custom">
        <input id="name" />
      </FormField>
    );
    const wrapper = container.querySelector(".strand-form-field");
    expect(wrapper?.className).toContain("strand-form-field");
    expect(wrapper?.className).toContain("custom");
  });
});

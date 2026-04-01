import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Alert } from "./Alert.js";

describe("Alert", () => {
  // ── Rendering ──

  it("renders children text", () => {
    const { getByRole } = render(<Alert>Something happened</Alert>);
    expect(getByRole("status")).toHaveTextContent("Something happened");
  });

  // ── Status classes ──

  it("applies info status class by default", () => {
    const { getByRole } = render(<Alert>Info</Alert>);
    expect(getByRole("status").className).toContain("strand-alert--info");
  });

  it("applies success status class", () => {
    const { getByRole } = render(<Alert status="success">OK</Alert>);
    expect(getByRole("status").className).toContain("strand-alert--success");
  });

  it("applies warning status class", () => {
    const { getByRole } = render(<Alert status="warning">Warn</Alert>);
    expect(getByRole("alert").className).toContain("strand-alert--warning");
  });

  it("applies error status class", () => {
    const { getByRole } = render(<Alert status="error">Fail</Alert>);
    expect(getByRole("alert").className).toContain("strand-alert--error");
  });

  // ── ARIA roles ──

  it("uses role alert for error status", () => {
    const { getByRole } = render(<Alert status="error">Err</Alert>);
    expect(getByRole("alert")).toBeTruthy();
  });

  it("uses role alert for warning status", () => {
    const { getByRole } = render(<Alert status="warning">Warn</Alert>);
    expect(getByRole("alert")).toBeTruthy();
  });

  it("uses role status for info status", () => {
    const { getByRole } = render(<Alert status="info">Info</Alert>);
    expect(getByRole("status")).toBeTruthy();
  });

  it("uses role status for success status", () => {
    const { getByRole } = render(<Alert status="success">OK</Alert>);
    expect(getByRole("status")).toBeTruthy();
  });

  // ── Dismissible ──

  it("shows dismiss button when dismissible", () => {
    const { getByLabelText } = render(
      <Alert dismissible>Dismissible</Alert>,
    );
    expect(getByLabelText("Dismiss")).toBeTruthy();
  });

  it("calls onDismiss when dismiss button is clicked", () => {
    const onDismiss = vi.fn();
    const { getByLabelText } = render(
      <Alert dismissible onDismiss={onDismiss}>
        Dismiss me
      </Alert>,
    );
    fireEvent.click(getByLabelText("Dismiss"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not show dismiss button when not dismissible", () => {
    const { queryByLabelText } = render(<Alert>Not dismissible</Alert>);
    expect(queryByLabelText("Dismiss")).toBeNull();
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { getByRole } = render(
      <Alert className="custom">Content</Alert>,
    );
    const el = getByRole("status");
    expect(el.className).toContain("strand-alert");
    expect(el.className).toContain("custom");
  });
});

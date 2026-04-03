import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/preact";
import { Toast, ToastProvider, useToast } from "./Toast.js";

/** Helper component that triggers a toast via the hook */
function TestTrigger({
  message = "Test message",
  status,
  duration,
}: {
  message?: string;
  status?: "info" | "success" | "warning" | "error";
  duration?: number;
}) {
  const { toast } = useToast();
  return (
    <button
      type="button"
      onClick={() => toast({ message, status, duration })}
    >
      Trigger
    </button>
  );
}

describe("Toast", () => {
  // ── Standalone Toast component ──

  it("renders message text", () => {
    const { getByText } = render(<Toast message="Hello" />);
    expect(getByText("Hello")).toBeTruthy();
  });

  it("applies status class", () => {
    const { container } = render(<Toast message="OK" status="success" />);
    expect(
      container.querySelector(".strand-toast--success"),
    ).toBeTruthy();
  });

  it("has role status", () => {
    const { getByRole } = render(<Toast message="Info" />);
    expect(getByRole("status")).toBeTruthy();
  });

  it("error toast has aria-live assertive", () => {
    const { getByRole } = render(
      <Toast message="Fail" status="error" />,
    );
    expect(getByRole("status")).toHaveAttribute("aria-live", "assertive");
  });

  it("info toast has aria-live polite", () => {
    const { getByRole } = render(
      <Toast message="Note" status="info" />,
    );
    expect(getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("warning toast has aria-live assertive", () => {
    const { getByRole } = render(
      <Toast message="Warn" status="warning" />,
    );
    expect(getByRole("status")).toHaveAttribute("aria-live", "assertive");
  });

  it("renders dismiss button when onDismiss provided", () => {
    const onDismiss = vi.fn();
    const { getByLabelText } = render(
      <Toast message="Bye" onDismiss={onDismiss} />,
    );
    fireEvent.click(getByLabelText("Dismiss"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("merges custom className", () => {
    const { container } = render(
      <Toast message="Styled" className="custom-toast" />,
    );
    const el = container.querySelector(".strand-toast")!;
    expect(el.className).toContain("custom-toast");
  });

  it("defaults to info status", () => {
    const { container } = render(<Toast message="Default" />);
    expect(
      container.querySelector(".strand-toast--info"),
    ).toBeTruthy();
  });

  it("renders status prefix for info", () => {
    const { container } = render(<Toast message="Note" status="info" />);
    const status = container.querySelector(".strand-toast__status");
    expect(status).toBeTruthy();
    expect(status!.textContent).toBe("INFO");
  });

  it("renders status prefix for success as COMPLETE", () => {
    const { container } = render(<Toast message="OK" status="success" />);
    const status = container.querySelector(".strand-toast__status");
    expect(status).toBeTruthy();
    expect(status!.textContent).toBe("COMPLETE");
  });

  it("renders status prefix for warning", () => {
    const { container } = render(<Toast message="Warn" status="warning" />);
    const status = container.querySelector(".strand-toast__status");
    expect(status).toBeTruthy();
    expect(status!.textContent).toBe("WARNING");
  });

  it("renders status prefix for error", () => {
    const { container } = render(<Toast message="Fail" status="error" />);
    const status = container.querySelector(".strand-toast__status");
    expect(status).toBeTruthy();
    expect(status!.textContent).toBe("ERROR");
  });
});

describe("ToastProvider + useToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders children", () => {
    const { getByText } = render(
      <ToastProvider>
        <p>App content</p>
      </ToastProvider>,
    );
    expect(getByText("App content")).toBeTruthy();
  });

  it("useToast adds a toast that renders message", () => {
    const { getByText } = render(
      <ToastProvider>
        <TestTrigger message="Hello toast" />
      </ToastProvider>,
    );
    fireEvent.click(getByText("Trigger"));
    expect(getByText("Hello toast")).toBeTruthy();
  });

  it("toast has correct status class", () => {
    const { getByText, container } = render(
      <ToastProvider>
        <TestTrigger message="Error occurred" status="error" />
      </ToastProvider>,
    );
    fireEvent.click(getByText("Trigger"));
    expect(
      container.querySelector(".strand-toast--error"),
    ).toBeTruthy();
  });

  it("toast has role status", () => {
    const { getByText, getAllByRole } = render(
      <ToastProvider>
        <TestTrigger message="Status toast" />
      </ToastProvider>,
    );
    fireEvent.click(getByText("Trigger"));
    const statuses = getAllByRole("status");
    expect(statuses.length).toBeGreaterThan(0);
  });

  it("error toast in provider has aria-live assertive", () => {
    const { getByText, container } = render(
      <ToastProvider>
        <TestTrigger message="Err" status="error" />
      </ToastProvider>,
    );
    fireEvent.click(getByText("Trigger"));
    const toast = container.querySelector(".strand-toast--error")!;
    expect(toast.getAttribute("aria-live")).toBe("assertive");
  });

  it("toast auto-dismisses after duration", () => {
    const { getByText, queryByText } = render(
      <ToastProvider>
        <TestTrigger message="Vanishing" duration={3000} />
      </ToastProvider>,
    );
    fireEvent.click(getByText("Trigger"));
    expect(getByText("Vanishing")).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(queryByText("Vanishing")).toBeNull();
  });

  it("dismiss button removes toast", () => {
    const { getByText, getByLabelText, queryByText } = render(
      <ToastProvider>
        <TestTrigger message="Dismissable" />
      </ToastProvider>,
    );
    fireEvent.click(getByText("Trigger"));
    expect(getByText("Dismissable")).toBeTruthy();

    fireEvent.click(getByLabelText("Dismiss"));
    expect(queryByText("Dismissable")).toBeNull();
  });

  it("defaults to info status when none provided", () => {
    const { getByText, container } = render(
      <ToastProvider>
        <TestTrigger message="Default info" />
      </ToastProvider>,
    );
    fireEvent.click(getByText("Trigger"));
    expect(
      container.querySelector(".strand-toast--info"),
    ).toBeTruthy();
  });

  it("multiple toasts stack", () => {
    const { getByText, container } = render(
      <ToastProvider>
        <TestTrigger message="First" />
      </ToastProvider>,
    );
    fireEvent.click(getByText("Trigger"));
    fireEvent.click(getByText("Trigger"));
    const toasts = container.querySelectorAll(".strand-toast");
    expect(toasts.length).toBe(2);
  });

  it("custom className on provider container", () => {
    const { getByText, container } = render(
      <ToastProvider className="custom-provider">
        <TestTrigger message="Styled" />
      </ToastProvider>,
    );
    fireEvent.click(getByText("Trigger"));
    const toastContainer = container.querySelector(
      ".strand-toast__container",
    )!;
    expect(toastContainer.className).toContain("custom-provider");
  });
});

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Dialog } from "./Dialog.js";

describe("Dialog", () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Ensure body overflow is restored
    document.body.style.overflow = "";
  });

  // ── Rendering ──

  it("renders nothing when closed", () => {
    const { container } = render(
      <Dialog open={false} onClose={defaultProps.onClose}>
        Content
      </Dialog>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders dialog when open", () => {
    const { getByRole } = render(
      <Dialog {...defaultProps}>Content</Dialog>,
    );
    expect(getByRole("dialog")).toBeTruthy();
  });

  it("renders children inside the dialog", () => {
    const { getByRole } = render(
      <Dialog {...defaultProps}>
        <p>Dialog content</p>
      </Dialog>,
    );
    expect(getByRole("dialog")).toHaveTextContent("Dialog content");
  });

  // ── ARIA ──

  it("has role dialog", () => {
    const { getByRole } = render(
      <Dialog {...defaultProps}>Content</Dialog>,
    );
    expect(getByRole("dialog")).toBeTruthy();
  });

  it("has aria-modal true", () => {
    const { getByRole } = render(
      <Dialog {...defaultProps}>Content</Dialog>,
    );
    expect(getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("renders title with aria-labelledby linkage", () => {
    const { getByRole, getByText } = render(
      <Dialog {...defaultProps} title="My Dialog">
        Content
      </Dialog>,
    );
    const dialog = getByRole("dialog");
    const titleEl = getByText("My Dialog");
    const titleId = titleEl.getAttribute("id");
    expect(dialog).toHaveAttribute("aria-labelledby", titleId);
  });

  it("does not set aria-labelledby when no title", () => {
    const { getByRole } = render(
      <Dialog {...defaultProps}>Content</Dialog>,
    );
    expect(getByRole("dialog").hasAttribute("aria-labelledby")).toBe(false);
  });

  // ── Title ──

  it("renders the title text", () => {
    const { getByText } = render(
      <Dialog {...defaultProps} title="Confirm Action">
        Content
      </Dialog>,
    );
    expect(getByText("Confirm Action")).toBeTruthy();
  });

  // ── Close button ──

  it("close button calls onClose", () => {
    const onClose = vi.fn();
    const { getByLabelText } = render(
      <Dialog open={true} onClose={onClose}>
        Content
      </Dialog>,
    );
    fireEvent.click(getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // ── Escape key ──

  it("Escape key calls onClose", () => {
    const onClose = vi.fn();
    const { getByRole } = render(
      <Dialog open={true} onClose={onClose}>
        Content
      </Dialog>,
    );
    fireEvent.keyDown(getByRole("dialog").parentElement!, {
      key: "Escape",
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Escape key does not call onClose when closeOnEscape is false", () => {
    const onClose = vi.fn();
    const { getByRole } = render(
      <Dialog open={true} onClose={onClose} closeOnEscape={false}>
        Content
      </Dialog>,
    );
    fireEvent.keyDown(getByRole("dialog").parentElement!, {
      key: "Escape",
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  // ── Outside click ──

  it("clicking backdrop calls onClose", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open={true} onClose={onClose}>
        Content
      </Dialog>,
    );
    const backdrop = container.querySelector(".strand-dialog__backdrop")!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("clicking inside dialog does not call onClose", () => {
    const onClose = vi.fn();
    const { getByRole } = render(
      <Dialog open={true} onClose={onClose}>
        Content
      </Dialog>,
    );
    fireEvent.click(getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("backdrop click disabled when closeOnOutsideClick is false", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open={true} onClose={onClose} closeOnOutsideClick={false}>
        Content
      </Dialog>,
    );
    const backdrop = container.querySelector(".strand-dialog__backdrop")!;
    fireEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { getByRole } = render(
      <Dialog {...defaultProps} className="custom-dialog">
        Content
      </Dialog>,
    );
    const dialog = getByRole("dialog");
    expect(dialog.className).toContain("strand-dialog__panel");
    expect(dialog.className).toContain("custom-dialog");
  });

  // ── Scroll lock ──

  it("sets body overflow hidden when open", () => {
    render(<Dialog {...defaultProps}>Content</Dialog>);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body overflow when closed", () => {
    const { rerender } = render(
      <Dialog {...defaultProps}>Content</Dialog>,
    );
    expect(document.body.style.overflow).toBe("hidden");
    rerender(
      <Dialog open={false} onClose={defaultProps.onClose}>
        Content
      </Dialog>,
    );
    expect(document.body.style.overflow).toBe("");
  });
});

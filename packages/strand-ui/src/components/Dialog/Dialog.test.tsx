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

  // ── Scroll lock compensation ──
  //
  // Hiding overflow removes the scrollbar, which widens the viewport and
  // shifts the entire page sideways the instant a dialog opens. jsdom does not
  // lay out, so the geometric truth lives in a real browser downstream; what
  // IS pinnable here is the compensation contract: which styles the lock
  // writes, on which element, and that every one of them is restored.

  // jsdom's CSS object has no `supports` at all (which is itself the proof
  // that the component's feature-detect must guard for absence), so these
  // stub the method by assignment and restore by deletion.
  const stubSupports = (impl: (prop: string, value?: string) => boolean) => {
    const css = CSS as unknown as Record<string, unknown>;
    const had = "supports" in css;
    const original = css.supports;
    css.supports = impl;
    return () => {
      if (had) css.supports = original;
      else delete css.supports;
    };
  };

  it("reserves the scrollbar gutter on the root when the engine supports it", () => {
    const restoreSupports = stubSupports(
      (prop, value) => prop === "scrollbar-gutter" && value === "stable",
    );
    const { rerender } = render(<Dialog {...defaultProps}>Content</Dialog>);
    expect(document.documentElement.style.scrollbarGutter).toBe("stable");
    expect(document.documentElement.style.overflow).toBe("hidden");
    rerender(
      <Dialog open={false} onClose={defaultProps.onClose}>
        Content
      </Dialog>,
    );
    expect(document.documentElement.style.scrollbarGutter).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
    restoreSupports();
  });

  it("pads the body by the measured scrollbar gap where the gutter is unsupported", () => {
    const restoreSupports = stubSupports(() => false);
    // jsdom reports no scrollbar; simulate a classic 15px one.
    const innerWidth = vi
      .spyOn(window, "innerWidth", "get")
      .mockReturnValue(1024);
    const clientWidth = vi
      .spyOn(document.documentElement, "clientWidth", "get")
      .mockReturnValue(1009);
    const { rerender } = render(<Dialog {...defaultProps}>Content</Dialog>);
    expect(document.body.style.paddingRight).toBe("15px");
    rerender(
      <Dialog open={false} onClose={defaultProps.onClose}>
        Content
      </Dialog>,
    );
    expect(document.body.style.paddingRight).toBe("");
    restoreSupports();
    innerWidth.mockRestore();
    clientWidth.mockRestore();
  });

  it("writes no compensation when there is no scrollbar to lose", () => {
    const restoreSupports = stubSupports(() => false);
    render(<Dialog {...defaultProps}>Content</Dialog>);
    // jsdom's gap is 0: overlay-scrollbar platforms take this path too.
    expect(document.body.style.paddingRight).toBe("");
    expect(document.body.style.overflow).toBe("hidden");
    restoreSupports();
  });
});

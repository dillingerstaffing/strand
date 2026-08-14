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
  //
  // There is deliberately NO scrollbar-gutter branch to test. The 0.36.3 lock
  // used one and it was inert by spec: the gutter is only reserved while
  // overflow is scroll or auto, so overflow: hidden voided it and
  // classic-scrollbar systems shifted anyway. The contract is padding plus
  // the --strand-scrollbar-gap custom property, and nothing on the root at
  // all.

  const simulateClassicScrollbar = () => {
    const innerWidth = vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
    const clientWidth = vi
      .spyOn(document.documentElement, "clientWidth", "get")
      .mockReturnValue(1009);
    return () => {
      innerWidth.mockRestore();
      clientWidth.mockRestore();
    };
  };

  it("pads the body by the measured gap and publishes it for fixed elements", () => {
    const restore = simulateClassicScrollbar();
    const { rerender } = render(<Dialog {...defaultProps}>Content</Dialog>);
    expect(document.body.style.paddingRight).toBe("15px");
    // Fixed chrome (.strand-nav--glass) sizes against the viewport, out of
    // body padding's reach; the custom property is its side of the contract.
    expect(
      document.documentElement.style.getPropertyValue("--strand-scrollbar-gap"),
    ).toBe("15px");
    rerender(
      <Dialog open={false} onClose={defaultProps.onClose}>
        Content
      </Dialog>,
    );
    expect(document.body.style.paddingRight).toBe("");
    expect(
      document.documentElement.style.getPropertyValue("--strand-scrollbar-gap"),
    ).toBe("");
    restore();
  });

  it("restores a pre-existing --strand-scrollbar-gap instead of deleting it", () => {
    const restore = simulateClassicScrollbar();
    document.documentElement.style.setProperty("--strand-scrollbar-gap", "7px");
    const { rerender } = render(<Dialog {...defaultProps}>Content</Dialog>);
    expect(
      document.documentElement.style.getPropertyValue("--strand-scrollbar-gap"),
    ).toBe("15px");
    rerender(
      <Dialog open={false} onClose={defaultProps.onClose}>
        Content
      </Dialog>,
    );
    expect(
      document.documentElement.style.getPropertyValue("--strand-scrollbar-gap"),
    ).toBe("7px");
    document.documentElement.style.removeProperty("--strand-scrollbar-gap");
    restore();
  });

  it("writes no compensation when there is no scrollbar to lose", () => {
    render(<Dialog {...defaultProps}>Content</Dialog>);
    // jsdom's gap is 0: overlay-scrollbar platforms take this path too.
    expect(document.body.style.paddingRight).toBe("");
    expect(
      document.documentElement.style.getPropertyValue("--strand-scrollbar-gap"),
    ).toBe("");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores focus without scrolling the page to the restore target", async () => {
    // The restore target is wherever focus sat before the dialog opened, and
    // when that is below the fold a default focus() yanks the page down to
    // it the instant the dialog closes (founder-reported on the palette,
    // 2026-08-11). Focus must move; the viewport must not.
    const anchor = document.createElement("button");
    document.body.appendChild(anchor);
    anchor.focus();
    const focusCalls: unknown[] = [];
    const originalFocus = anchor.focus.bind(anchor);
    anchor.focus = (opts?: FocusOptions) => {
      focusCalls.push(opts);
      originalFocus(opts);
    };
    const { rerender } = render(<Dialog {...defaultProps}>Content</Dialog>);
    rerender(
      <Dialog open={false} onClose={defaultProps.onClose}>
        Content
      </Dialog>,
    );
    expect(focusCalls).toContainEqual({ preventScroll: true });
    expect(document.activeElement).toBe(anchor);
    anchor.remove();
  });

  it("never touches the root's overflow", () => {
    const restore = simulateClassicScrollbar();
    const { rerender } = render(<Dialog {...defaultProps}>Content</Dialog>);
    // Body overflow propagates to the viewport when the root's stays visible,
    // so the lock needs nothing on the root; writing there is what the broken
    // gutter approach did.
    expect(document.documentElement.style.overflow).toBe("");
    rerender(
      <Dialog open={false} onClose={defaultProps.onClose}>
        Content
      </Dialog>,
    );
    expect(document.documentElement.style.overflow).toBe("");
    restore();
  });

  // ── Composition props ──
  //
  // Three consumer-side overrides of this one primitive, in one file, is what
  // produced these. Two separate overlays (a command palette and a search
  // locator) had written the identical three rules, which is the definition of
  // a missing input rather than a misuse.

  const panel = (c: HTMLElement) => c.querySelector(".strand-dialog__panel");

  it("centres its panel and pads it, unchanged, when asked for nothing", () => {
    // The defaults ARE the old rendering. A consumer who never heard of these
    // props must get byte-identical output, or this is a breaking change
    // wearing an additive diff.
    const { container } = render(<Dialog {...defaultProps}>Content</Dialog>);
    const el = panel(container as HTMLElement);
    expect(el?.classList.contains("strand-dialog__panel--align-start")).toBe(false);
    expect(el?.classList.contains("strand-dialog__panel--pad-lg")).toBe(true);
    expect(container.querySelector(".strand-dialog__close")).not.toBeNull();
  });

  it("drops the panel under the reader's gaze when aligned to start", () => {
    const { container } = render(
      <Dialog {...defaultProps} align="start">
        Content
      </Dialog>,
    );
    expect(panel(container as HTMLElement)?.classList.contains("strand-dialog__panel--align-start")).toBe(
      true,
    );
  });

  it("anchors the panel to the bottom edge when aligned to end", () => {
    const { container } = render(
      <Dialog {...defaultProps} align="end">
        Content
      </Dialog>,
    );
    expect(panel(container as HTMLElement)?.classList.contains("strand-dialog__panel--align-end")).toBe(
      true,
    );
  });

  it("the default emits no alignment class at all, so an untouched consumer is unchanged", () => {
    // The whole alignment axis is additive. If `center` ever started emitting
    // a class, every existing consumer's markup would change on a patch
    // release, which is a breaking change wearing a safe shape.
    const { container } = render(<Dialog {...defaultProps}>Content</Dialog>);
    const classes = panel(container as HTMLElement)?.className ?? "";
    expect(classes).not.toContain("--align-");
  });

  it("carries each rung of the padding ladder", () => {
    for (const padding of ["none", "sm", "md", "lg", "xl"] as const) {
      const { container } = render(
        <Dialog {...defaultProps} padding={padding}>
          Content
        </Dialog>,
      );
      expect(
        panel(container as HTMLElement)?.classList.contains(`strand-dialog__panel--pad-${padding}`),
      ).toBe(true);
    }
  });

  it("omits the close button entirely when not dismissible", () => {
    // NOT hidden. A `display: none` button is still in the DOM, and the focus
    // trap queries the DOM: Dialog focuses the first focusable element in its
    // panel, so a hidden close button still swallows the open focus and the
    // visitor types into a button they cannot see. That shipped once already
    // (gap #67's post-mortem). Absent is the only correct answer.
    const { container } = render(
      <Dialog {...defaultProps} dismissible={false}>
        <input aria-label="Query" />
      </Dialog>,
    );
    expect(container.querySelector(".strand-dialog__close")).toBeNull();
  });

  it("still closes on Escape and on the backdrop when not dismissible", () => {
    // `dismissible` hides a CONTROL. A reader who cannot leave a modal is
    // trapped, so the two dismissal paths that do not depend on that control
    // must be untouched by it.
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={onClose} dismissible={false}>
        Content
      </Dialog>,
    );
    const backdrop = container.querySelector(".strand-dialog__backdrop") as HTMLElement;
    fireEvent.keyDown(backdrop, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("lets the first focusable child take focus once the close button is gone", async () => {
    // The reason `dismissible` exists at all, stated as behaviour rather than
    // as a class name: an overlay whose interaction model is "open and type"
    // needs its input to be what focus lands on.
    const { container } = render(
      <Dialog {...defaultProps} dismissible={false}>
        <input aria-label="Query" />
      </Dialog>,
    );
    const input = container.querySelector("input") as HTMLInputElement;
    await new Promise((r) => requestAnimationFrame(r));
    expect(document.activeElement).toBe(input);
  });
});

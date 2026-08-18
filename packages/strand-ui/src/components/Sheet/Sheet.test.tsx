// WHICH TIER PROVES WHAT, because this component spans all three and the
// split is not a matter of taste.
//
// jsdom implements NO `PointerEvent`. Measured, not assumed:
// `fireEvent.pointerDown(el, { clientY: 100, pointerId: 7 })` delivers a plain
// Event whose `clientY` and `pointerId` are both null, and whose target has no
// `setPointerCapture`. A drag test written here does not test the drag; it
// asserts that nothing happened, and passes for the wrong reason.
//
// So: the DECISION is a pure function and is exhausted below at no cost. The
// GEOMETRY (bottom anchoring, the foot landing in the thumb zone) is in the
// browser layout tier, `pnpm test:layout`. The real gesture is driven by the
// consumer's Playwright e2e, where pointer events are real.

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { DISMISS_FRACTION, dragOutcome, Sheet } from "./Sheet.js";

describe("Sheet", () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    label: "Filters",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  // ── Rendering ──

  it("renders nothing when closed", () => {
    const { container } = render(
      <Sheet {...defaultProps} open={false}>
        Content
      </Sheet>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders its content in a scrolling body", () => {
    const { getByRole } = render(<Sheet {...defaultProps}>Body content</Sheet>);
    const body = getByRole("dialog").querySelector(".strand-sheet__body");
    expect(body).toBeTruthy();
    expect(body).toHaveTextContent("Body content");
  });

  it("anchors to the bottom edge, which is the whole pattern", () => {
    // The reader on a phone must be able to reach the committing control
    // with a thumb (DL 14.8). A centred panel cannot do that at any height,
    // so if this class is missing the component is a plain dialog wearing a
    // sheet's name.
    const { getByRole } = render(<Sheet {...defaultProps}>x</Sheet>);
    expect(getByRole("dialog").className).toContain("strand-dialog__panel--align-end");
  });

  it("carries no inner padding of its own, because its parts own their insets", () => {
    const { getByRole } = render(<Sheet {...defaultProps}>x</Sheet>);
    expect(getByRole("dialog").className).toContain("strand-dialog__panel--pad-none");
  });

  // ── Accessible name ──

  it("the reader using a screen reader is told what the sheet is", () => {
    const { getByRole } = render(<Sheet {...defaultProps}>x</Sheet>);
    expect(getByRole("dialog")).toHaveAttribute("aria-label", "Filters");
  });

  // ── The parts ──

  it("a sheet with an action renders it in a foot that does not scroll away", () => {
    const { getByTestId } = render(
      <Sheet {...defaultProps} action={<button type="button">Show 6 events</button>}>
        x
      </Sheet>,
    );
    const foot = getByTestId("sheet-foot");
    expect(foot).toHaveTextContent("Show 6 events");
  });

  it("a sheet with no action renders no foot at all, rather than an empty band", () => {
    const { queryByTestId } = render(<Sheet {...defaultProps}>x</Sheet>);
    expect(queryByTestId("sheet-foot")).toBeNull();
  });

  it("a sheet with head content renders it above the body", () => {
    const { getByTestId } = render(
      <Sheet {...defaultProps} head={<button type="button">Clear</button>}>
        x
      </Sheet>,
    );
    expect(getByTestId("sheet-head")).toHaveTextContent("Clear");
  });

  it("a sheet with no head content renders no head, so the body is the first row", () => {
    const { queryByTestId } = render(<Sheet {...defaultProps}>x</Sheet>);
    expect(queryByTestId("sheet-head")).toBeNull();
  });

  // ── The grabber ──

  it("the grabber is present, because a drag nobody can see is a gesture only its author knows", () => {
    const { getByTestId } = render(<Sheet {...defaultProps}>x</Sheet>);
    expect(getByTestId("sheet-grab")).toBeTruthy();
  });

  it("the grabber is hidden from assistive tech, which has Escape and the action", () => {
    const { getByTestId } = render(<Sheet {...defaultProps}>x</Sheet>);
    const bar = getByTestId("sheet-grab").querySelector(".strand-sheet__grabber");
    expect(bar).toHaveAttribute("aria-hidden", "true");
  });

  it("a sheet that cannot be dragged renders no grabber, rather than one that does nothing", () => {
    // An affordance that promises a gesture it does not have is worse than
    // no affordance at all.
    const { queryByTestId } = render(
      <Sheet {...defaultProps} draggable={false}>
        x
      </Sheet>,
    );
    expect(queryByTestId("sheet-grab")).toBeNull();
  });

  // ── The environment, pinned ──

  it("jsdom delivers no pointer coordinates, which is why the drag is a pure function", () => {
    // This assertion exists so the tier split cannot rot silently. If a future
    // jsdom implements PointerEvent, this fails and the next reader is told
    // that the gesture is now testable here, rather than discovering it by
    // trusting a suite that could not have failed.
    const seen: Array<unknown> = [];
    const { getByTestId } = render(
      <div data-testid="probe" onPointerDown={(e: PointerEvent) => seen.push(e.clientY)} />,
    );
    fireEvent.pointerDown(getByTestId("probe"), { clientY: 100, pointerId: 7 });
    // Asserted as "not a finite number" rather than against a literal, because
    // the literal is a trap: an earlier probe here printed `null` only because
    // JSON.stringify rewrites an undefined array entry that way. The value is
    // actually `undefined`, and the guard has to survive both.
    expect(seen).toHaveLength(1);
    expect(Number.isFinite(seen[0])).toBe(false);
  });

  it("a press with no usable coordinate starts no drag at all", () => {
    // The consequence of the line above. Without the guard, `startY` holds
    // null, every later handler's "has a drag begun" check answers yes, and
    // the arithmetic runs on null.
    const onClose = vi.fn();
    const { getByTestId, getByRole } = render(
      <Sheet {...defaultProps} onClose={onClose}>
        x
      </Sheet>,
    );
    const panel = getByRole("dialog").querySelector(".strand-sheet__panel") as HTMLElement;
    const grab = getByTestId("sheet-grab");
    fireEvent.pointerDown(grab, { clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(grab, { clientY: 400, pointerId: 1 });
    fireEvent.pointerUp(grab, { clientY: 400, pointerId: 1 });

    expect(onClose).not.toHaveBeenCalled();
    expect(panel.getAttribute("style") || "").not.toContain("translateY");
  });

  // ── Inherited behaviour, which is the reason this composes Dialog ──

  it("Escape closes the sheet, inherited rather than rebuilt", () => {
    const onClose = vi.fn();
    const { getByRole } = render(
      <Sheet {...defaultProps} onClose={onClose}>
        x
      </Sheet>,
    );
    fireEvent.keyDown(getByRole("dialog"), { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("the page behind cannot scroll while the sheet is open", () => {
    render(<Sheet {...defaultProps}>x</Sheet>);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("no close X is rendered, because the pattern dismisses by gesture, Escape or backdrop", () => {
    const { getByRole } = render(<Sheet {...defaultProps}>x</Sheet>);
    expect(getByRole("dialog").querySelector(".strand-dialog__close")).toBeNull();
  });
});

// ── The drag decision, exhausted ──
//
// Every rule the gesture has lives here, at no cost and with no DOM. The
// handlers above are the plumbing that feeds this; this is the behaviour.

describe("dragOutcome", () => {
  const HEIGHT = 500; // threshold at 0.28 is 140

  it("a drag past the threshold dismisses the sheet", () => {
    expect(dragOutcome(100, 400, HEIGHT).dismiss).toBe(true);
  });

  it("a short drag springs back, so a graze on the grabber is not a close", () => {
    expect(dragOutcome(100, 130, HEIGHT).dismiss).toBe(false);
  });

  it("exactly at the threshold does NOT dismiss, because a boundary has to fall somewhere", () => {
    expect(dragOutcome(0, HEIGHT * DISMISS_FRACTION, HEIGHT).dismiss).toBe(false);
  });

  it("one pixel past the threshold does dismiss", () => {
    expect(dragOutcome(0, HEIGHT * DISMISS_FRACTION + 1, HEIGHT).dismiss).toBe(true);
  });

  it("dragging UPWARD never dismisses, because the sheet is already at its height", () => {
    expect(dragOutcome(400, 100, HEIGHT).dismiss).toBe(false);
  });

  it("an upward drag reports zero travel rather than a negative offset", () => {
    // The travel value is written to `transform: translateY`. A negative one
    // would lift the panel off the edge it is anchored to.
    expect(dragOutcome(400, 100, HEIGHT).travelled).toBe(0);
  });

  it("the same gesture means the same thing on a short phone and a tall one", () => {
    // 200px is over the threshold on a 500px sheet and under it on a 1000px
    // one. A pixel constant would make the gesture mean different things on
    // different devices, which is the reason the rule is a fraction.
    expect(dragOutcome(0, 200, 500).dismiss).toBe(true);
    expect(dragOutcome(0, 200, 1000).dismiss).toBe(false);
  });

  it("a press that never began cannot dismiss anything", () => {
    expect(dragOutcome(null, 400, HEIGHT).dismiss).toBe(false);
  });

  it("an unmeasurable coordinate is NOT a drag of zero, it is no drag", () => {
    // The distinction is load-bearing: treating a missing coordinate as zero
    // makes the arithmetic run on null and the gesture die silently in any
    // environment that reports no coordinates.
    expect(dragOutcome(Number.NaN, 400, HEIGHT)).toEqual({ travelled: 0, dismiss: false });
    expect(dragOutcome(100, Number.NaN, HEIGHT)).toEqual({ travelled: 0, dismiss: false });
  });

  it("a sheet that measures zero cannot be dismissed by an idle press", () => {
    // A zero height would make the threshold zero, so ANY travel at all would
    // close the sheet, including the one-pixel jitter a resting thumb makes.
    expect(dragOutcome(100, 100, 0).dismiss).toBe(false);
  });

  it("the threshold is overridable, because a taller sheet may want a longer pull", () => {
    expect(dragOutcome(0, 300, HEIGHT, 0.5).dismiss).toBe(true);
    expect(dragOutcome(0, 200, HEIGHT, 0.5).dismiss).toBe(false);
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { fixtures } from "./Sheet.fixtures.js";

snapshotFixtures(Sheet, fixtures);

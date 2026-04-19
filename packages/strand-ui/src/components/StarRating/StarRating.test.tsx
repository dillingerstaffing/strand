import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { StarRating } from "./StarRating.js";

describe("StarRating", () => {
  it("renders five stars with radio role", () => {
    const { getAllByRole } = render(
      <StarRating value={0} onChange={() => {}} ariaLabel="Rate" />,
    );
    expect(getAllByRole("radio")).toHaveLength(5);
  });

  it("marks the selected star as aria-checked true", () => {
    const { getAllByRole } = render(
      <StarRating value={3} onChange={() => {}} ariaLabel="Rate" />,
    );
    const radios = getAllByRole("radio");
    expect(radios[2]).toHaveAttribute("aria-checked", "true");
    expect(radios[0]).toHaveAttribute("aria-checked", "false");
  });

  it("calls onChange with the star index on click", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <StarRating value={0} onChange={onChange} ariaLabel="Rate" />,
    );
    fireEvent.click(getAllByRole("radio")[3]);
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("does not call onChange in read-only mode", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <StarRating value={2} onChange={onChange} ariaLabel="Rate" readOnly />,
    );
    fireEvent.click(getAllByRole("radio")[4]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("activates a star on Space key", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <StarRating value={0} onChange={onChange} ariaLabel="Rate" />,
    );
    fireEvent.keyDown(getAllByRole("radio")[1], { key: " " });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("activates a star on Enter key", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <StarRating value={0} onChange={onChange} ariaLabel="Rate" />,
    );
    fireEvent.keyDown(getAllByRole("radio")[4], { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("applies active class to stars up to the value", () => {
    const { container } = render(
      <StarRating value={3} onChange={() => {}} ariaLabel="Rate" />,
    );
    const active = container.querySelectorAll(".strand-star-rating__star--active");
    expect(active).toHaveLength(3);
  });

  it("applies hover class on mouse enter", () => {
    const { container, getAllByRole } = render(
      <StarRating value={0} onChange={() => {}} ariaLabel="Rate" />,
    );
    fireEvent.mouseEnter(getAllByRole("radio")[3]);
    const active = container.querySelectorAll(".strand-star-rating__star--active");
    expect(active).toHaveLength(4);
  });

  it("resets hover state on mouse leave", () => {
    const { container, getAllByRole } = render(
      <StarRating value={2} onChange={() => {}} ariaLabel="Rate" />,
    );
    fireEvent.mouseEnter(getAllByRole("radio")[4]);
    fireEvent.mouseLeave(getAllByRole("radio")[4]);
    const active = container.querySelectorAll(".strand-star-rating__star--active");
    expect(active).toHaveLength(2);
  });

  it("applies the size modifier class", () => {
    const { container } = render(
      <StarRating value={0} onChange={() => {}} ariaLabel="Rate" size="lg" />,
    );
    expect(container.querySelector(".strand-star-rating--lg")).toBeTruthy();
  });

  it("defaults to md size", () => {
    const { container } = render(
      <StarRating value={0} onChange={() => {}} ariaLabel="Rate" />,
    );
    expect(container.querySelector(".strand-star-rating--md")).toBeTruthy();
  });

  it("applies readonly class when readOnly is set", () => {
    const { container } = render(
      <StarRating value={3} onChange={() => {}} ariaLabel="Rate" readOnly />,
    );
    expect(
      container.querySelector(".strand-star-rating--readonly"),
    ).toBeTruthy();
  });

  it("renders aria-label from prop", () => {
    const { container } = render(
      <StarRating value={0} onChange={() => {}} ariaLabel="Rate event" />,
    );
    expect(
      container.querySelector('[aria-label="Rate event"]'),
    ).toBeTruthy();
  });

  it("exposes data-strand-component attribute for vanilla hydration", () => {
    const { container } = render(
      <StarRating value={0} onChange={() => {}} ariaLabel="Rate" />,
    );
    expect(
      container.querySelector('[data-strand-component="star-rating"]'),
    ).toBeTruthy();
  });

  it("merges custom className", () => {
    const { container } = render(
      <StarRating
        value={0}
        onChange={() => {}}
        ariaLabel="Rate"
        className="custom"
      />,
    );
    expect(container.querySelector(".strand-star-rating")?.className).toContain(
      "custom",
    );
  });

  it("disables star buttons in read-only mode", () => {
    const { getAllByRole } = render(
      <StarRating value={3} onChange={() => {}} ariaLabel="Rate" readOnly />,
    );
    for (const star of getAllByRole("radio")) {
      expect(star).toBeDisabled();
    }
  });
});

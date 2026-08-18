import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { StarRating } from "./StarRating.js";

describe("StarRating", () => {
  it("renders five stars with radio role by default, or count stars", () => {
    const five = render(<StarRating value={0} onChange={() => {}} ariaLabel="Rate" />);
    expect(five.getAllByRole("radio")).toHaveLength(5);
    five.unmount();
    const ten = render(<StarRating value={0} onChange={() => {}} ariaLabel="Rate" count={10} />);
    expect(ten.getAllByRole("radio")).toHaveLength(10);
  });

  it("marks the selected star as aria-checked true", () => {
    const { getAllByRole } = render(<StarRating value={3} onChange={() => {}} ariaLabel="Rate" />);
    const radios = getAllByRole("radio");
    expect(radios[2]).toHaveAttribute("aria-checked", "true");
    expect(radios[0]).toHaveAttribute("aria-checked", "false");
  });

  it("keeps only the selected star, or the first when unset, in the tab order", () => {
    const set = render(<StarRating value={3} onChange={() => {}} ariaLabel="Rate" />);
    expect(set.getAllByRole("radio").map((r) => r.tabIndex)).toEqual([-1, -1, 0, -1, -1]);
    set.unmount();
    const unset = render(<StarRating value={0} onChange={() => {}} ariaLabel="Rate" />);
    expect(unset.getAllByRole("radio").map((r) => r.tabIndex)).toEqual([0, -1, -1, -1, -1]);
  });

  it("calls onChange with the star index on click", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(<StarRating value={0} onChange={onChange} ariaLabel="Rate" />);
    fireEvent.click(getAllByRole("radio")[3]);
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("clears the rating when the selected star is clicked again and allowClear is set", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(<StarRating value={4} onChange={onChange} ariaLabel="Rate" allowClear />);
    fireEvent.click(getAllByRole("radio")[3]);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("moves the rating and focus with the arrow keys, Home and End", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(<StarRating value={2} onChange={onChange} ariaLabel="Rate" />);
    const radios = getAllByRole("radio");
    fireEvent.keyDown(radios[1], { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith(3);
    expect(document.activeElement).toBe(radios[2]);
    fireEvent.keyDown(radios[1], { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(document.activeElement).toBe(radios[0]);
    fireEvent.keyDown(radios[1], { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith(5);
    fireEvent.keyDown(radios[1], { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith(1);
    fireEvent.keyDown(radios[1], { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith(3);
    fireEvent.keyDown(radios[1], { key: "ArrowDown" });
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it("does not move past the first or last star", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(<StarRating value={5} onChange={onChange} ariaLabel="Rate" />);
    fireEvent.keyDown(getAllByRole("radio")[4], { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith(5);
  });

  it("reads as an image named with the rating when read only, and takes no input", () => {
    const onChange = vi.fn();
    const { getByRole, queryAllByRole, container } = render(<StarRating value={4} onChange={onChange} ariaLabel="Rated" readOnly />);
    expect(getByRole("img", { name: "Rated, 4 of 5 stars" })).toBeTruthy();
    expect(queryAllByRole("radio")).toHaveLength(0);
    expect(container.querySelectorAll("button")).toHaveLength(0);
    expect(container.querySelectorAll(".strand-star-rating__star--active")).toHaveLength(4);
    expect(container.querySelector(".strand-star-rating--readonly")).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies active class to stars up to the value", () => {
    const { container } = render(<StarRating value={3} onChange={() => {}} ariaLabel="Rate" />);
    expect(container.querySelectorAll(".strand-star-rating__star--active")).toHaveLength(3);
  });

  it("previews the hovered rating and restores the value on mouse leave", () => {
    const { container, getAllByRole } = render(<StarRating value={2} onChange={() => {}} ariaLabel="Rate" />);
    fireEvent.mouseEnter(getAllByRole("radio")[4]);
    expect(container.querySelectorAll(".strand-star-rating__star--active")).toHaveLength(5);
    fireEvent.mouseLeave(getAllByRole("radio")[4]);
    expect(container.querySelectorAll(".strand-star-rating__star--active")).toHaveLength(2);
  });

  it("applies the size modifier class, md by default", () => {
    const lg = render(<StarRating value={0} onChange={() => {}} ariaLabel="Rate" size="lg" />);
    expect(lg.container.querySelector(".strand-star-rating--lg")).toBeTruthy();
    lg.unmount();
    const md = render(<StarRating value={0} onChange={() => {}} ariaLabel="Rate" />);
    expect(md.container.querySelector(".strand-star-rating--md")).toBeTruthy();
  });

  it("names the group from ariaLabel", () => {
    const { getByRole } = render(<StarRating value={0} onChange={() => {}} ariaLabel="Rate event" />);
    expect(getByRole("radiogroup", { name: "Rate event" })).toBeTruthy();
  });

  it("exposes data-strand-component attribute for vanilla hydration", () => {
    const { container } = render(<StarRating value={0} onChange={() => {}} ariaLabel="Rate" />);
    expect(container.querySelector('[data-strand-component="star-rating"]')).toBeTruthy();
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./StarRating.fixtures.js";

snapshotFixtures(StarRating, fixtures);

snapshotStylesheet(resolve(__dirname, "./StarRating.css"));

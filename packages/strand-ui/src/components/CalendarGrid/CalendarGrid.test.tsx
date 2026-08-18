import { resolve } from "node:path";
import { fireEvent, render } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { buildMonthGrid, CalendarGrid } from "./CalendarGrid.js";

// GEOMETRY -- that every well is the same size, and that a well past its
// capacity does not grow its row -- belongs to the layout tier in real
// Chromium. jsdom does not lay out. What this file covers is the date
// arithmetic, the ARIA grid contract, and 10.6's counted remainder.

describe("buildMonthGrid", () => {
  // August 2026 starts on a Saturday, so a Sunday-start month needs six
  // leading days and spills into September.
  it("pads the first week with the previous month's days", () => {
    const weeks = buildMonthGrid(2026, 7);
    expect(weeks[0]).toHaveLength(7);
    expect(weeks[0][0].adjacent).toBe(true);
    expect(weeks[0][6].day).toBe(1);
    expect(weeks[0][6].adjacent).toBe(false);
  });

  it("every row is exactly seven days", () => {
    // The invariant the whole production rests on: a week has seven days
    // at every viewport and in every month.
    for (const [y, m] of [[2026, 0], [2026, 1], [2026, 7], [2027, 11]]) {
      for (const week of buildMonthGrid(y, m)) expect(week).toHaveLength(7);
    }
  });

  // The case a naive implementation gets wrong: a month already starting on
  // the week start must NOT gain a blank leading row.
  it("adds no leading week when the month starts on the week start", () => {
    // February 2026 starts on a Sunday.
    const weeks = buildMonthGrid(2026, 1, 0);
    expect(weeks[0][0].day).toBe(1);
    expect(weeks[0][0].adjacent).toBe(false);
  });

  it("honours a Monday week start", () => {
    const weeks = buildMonthGrid(2026, 1, 1);
    // With Monday first, a Sunday-starting month gains six leading days.
    expect(weeks[0][0].adjacent).toBe(true);
    expect(weeks[0][6].day).toBe(1);
  });

  it("gives a six-row month six rows and a five-row month five", () => {
    // A fixed six rows would append a whole trailing week to most months;
    // a fixed five would truncate the ones that genuinely need six.
    expect(buildMonthGrid(2026, 7).length).toBe(6);
    expect(buildMonthGrid(2026, 1).length).toBe(4);
  });

  // A property sweep rather than a handful of examples. The row-count bug
  // this caught -- February 2026 is 28 days starting on the week start, so
  // it fills exactly four weeks and the grid grew a fifth row of March --
  // was invisible to every example test that happened to pick a month
  // ending mid-week, which is eleven months in twelve.
  it("holds its invariants for every month across seven years, both week starts", () => {
    let checked = 0;
    for (let y = 2024; y <= 2030; y++) {
      for (let m = 0; m < 12; m++) {
        for (const ws of [0, 1] as const) {
          const weeks = buildMonthGrid(y, m, ws);
          const days = weeks.flat();
          const own = days.filter((d) => !d.adjacent);
          const daysInMonth = new Date(y, m + 1, 0).getDate();

          // Every row is a full week.
          expect(days).toHaveLength(weeks.length * 7);
          // Every day of the month appears exactly once, in order, and no
          // day of the month is ever marked adjacent.
          expect(own).toHaveLength(daysInMonth);
          expect(own.map((d) => d.day)).toEqual(
            Array.from({ length: daysInMonth }, (_, i) => i + 1),
          );
          // A month needs at least four rows and never more than six.
          expect(weeks.length).toBeGreaterThanOrEqual(4);
          expect(weeks.length).toBeLessThanOrEqual(6);
          // Every row starts on the configured week start.
          for (const week of weeks) expect(week[0].date.getDay()).toBe(ws);
          checked++;
        }
      }
    }
    // An empty sweep reporting success is the failure mode this guards
    // against in others.
    expect(checked).toBe(7 * 12 * 2);
  });

  // ── fixedWeeks: the grid must not resize the page when the month turns ──
  //
  // Measured on a consumer: paging from a six-row month to a five-row month
  // resizes the region by ~112px and moves everything beneath it. That is
  // 6.6.1's space contract and 10.6's argument one level up -- 10.6 says a
  // bounded cell must not grow its row, this says the grid must not grow
  // its page.

  it("pads every month to the same row count when asked", () => {
    // The three shapes a month can take: six rows, five, and four.
    for (const [y, m] of [[2026, 7], [2026, 8], [2026, 1]]) {
      expect(buildMonthGrid(y, m, 0, 6)).toHaveLength(6);
    }
  });

  it("pads from the adjacent months rather than emitting a blank band", () => {
    // The grid already renders and already marks adjacent days, so a padded
    // row is the same context the first and last rows always carry.
    const weeks = buildMonthGrid(2026, 1, 0, 6);
    const trailing = weeks[5];
    expect(trailing).toHaveLength(7);
    expect(trailing.every((d) => d.adjacent)).toBe(true);
    expect(trailing[0].date.getMonth()).toBe(2);
  });

  it("still contains every day of the month exactly once when padded", () => {
    // The padding must not cost or duplicate a real day.
    const own = buildMonthGrid(2026, 1, 0, 6).flat().filter((d) => !d.adjacent);
    expect(own.map((d) => d.day)).toEqual(
      Array.from({ length: 28 }, (_, i) => i + 1),
    );
  });

  it("keeps the variable row count when fixedWeeks is unset", () => {
    // The old behaviour is the default, so this is additive for consumers
    // that were relying on a month-sized grid.
    expect(buildMonthGrid(2026, 1)).toHaveLength(4);
    expect(buildMonthGrid(2026, 7)).toHaveLength(6);
  });

  it("never truncates a month at six, which is the most any month needs", () => {
    let maxRows = 0;
    for (let y = 2024; y <= 2030; y++) {
      for (let m = 0; m < 12; m++) {
        for (const ws of [0, 1] as const) {
          maxRows = Math.max(maxRows, buildMonthGrid(y, m, ws).length);
          const padded = buildMonthGrid(y, m, ws, 6);
          const own = padded.flat().filter((d) => !d.adjacent);
          expect(own).toHaveLength(new Date(y, m + 1, 0).getDate());
        }
      }
    }
    expect(maxRows).toBe(6);
  });

  it("handles a leap February", () => {
    const days = buildMonthGrid(2028, 1).flat().filter((d) => !d.adjacent);
    expect(days).toHaveLength(29);
    expect(days[28].day).toBe(29);
  });

  // new Date("2026-08-01") parses as UTC midnight and renders as July 31
  // for anyone west of Greenwich. Constructing from y/m/d avoids it, and
  // the iso string must agree with the local date it was built from.
  it("emits an iso key that matches the local date, not a UTC shift", () => {
    const weeks = buildMonthGrid(2026, 7);
    for (const day of weeks.flat()) {
      const [y, m, d] = day.iso.split("-").map(Number);
      expect(y).toBe(day.date.getFullYear());
      expect(m).toBe(day.date.getMonth() + 1);
      expect(d).toBe(day.date.getDate());
    }
  });

  it("zero-pads the iso key so it sorts lexically", () => {
    const jan = buildMonthGrid(2026, 0).flat().find((d) => d.day === 5 && !d.adjacent);
    expect(jan?.iso).toBe("2026-01-05");
  });
});

const BASE = {
  year: 2026,
  month: 7,
  label: "August 2026",
  today: new Date(2026, 7, 12),
};

describe("CalendarGrid", () => {
  it("is a named grid of rows and cells", () => {
    // Unnamed, a grid is announced as an unlabelled table of numbers.
    const { container } = render(<CalendarGrid {...BASE} />);
    const grid = container.querySelector('[role="grid"]');
    expect(grid?.getAttribute("aria-label")).toBe("August 2026");
    expect(container.querySelectorAll('[role="row"]').length).toBeGreaterThan(1);
    expect(container.querySelectorAll('[role="columnheader"]')).toHaveLength(7);
  });

  it("names each column in full for a screen reader", () => {
    // "Mon" read aloud is not a weekday. abbr carries the full name.
    const { container } = render(<CalendarGrid {...BASE} />);
    const first = container.querySelector('[role="columnheader"]');
    // The full name is present for a screen reader and hidden from sight;
    // the abbreviation is present for sight and hidden from the reader.
    expect(first?.querySelector(".strand-sr-only")?.textContent).toBe("Sunday");
    expect(first?.querySelector('[aria-hidden="true"]')?.textContent).toBe("Sun");
  });

  // The roving tabindex. Thirty-one tab stops in a month would make the
  // keyboard path through any page carrying a calendar unusable.
  it("is exactly one tab stop", () => {
    const { container } = render(<CalendarGrid {...BASE} />);
    const reachable = container.querySelectorAll('[role="gridcell"][tabindex="0"]');
    expect(reachable).toHaveLength(1);
  });

  it("puts the tab stop on the selected day when there is one", () => {
    const { container } = render(<CalendarGrid {...BASE} selected="2026-08-20" />);
    const reachable = container.querySelector('[role="gridcell"][tabindex="0"]');
    expect(reachable?.getAttribute("data-iso")).toBe("2026-08-20");
  });

  it("marks today with aria-current, not only with a colour", () => {
    const { container } = render(<CalendarGrid {...BASE} />);
    const marked = container.querySelectorAll('[aria-current="date"]');
    expect(marked).toHaveLength(1);
    expect(marked[0].getAttribute("data-iso")).toBe("2026-08-12");
  });

  it("marks the selection with aria-selected", () => {
    const { container } = render(<CalendarGrid {...BASE} selected="2026-08-03" />);
    expect(
      container.querySelector('[aria-selected="true"]')?.getAttribute("data-iso"),
    ).toBe("2026-08-03");
  });

  it("reports the day that was chosen", () => {
    const onSelect = vi.fn();
    const { container } = render(<CalendarGrid {...BASE} onSelect={onSelect} />);
    fireEvent.click(container.querySelector('[data-iso="2026-08-14"]') as HTMLElement);
    expect(onSelect).toHaveBeenCalledWith("2026-08-14");
  });

  it("chooses a day from the keyboard", () => {
    const onSelect = vi.fn();
    const { container } = render(<CalendarGrid {...BASE} onSelect={onSelect} />);
    const cell = container.querySelector('[data-iso="2026-08-14"]') as HTMLElement;
    fireEvent.keyDown(cell, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith("2026-08-14");
  });

  it("changes month when arrowing off the end", () => {
    // The grid shows adjacent days, so arrowing past the last of the month
    // must tell the consumer to advance rather than silently doing nothing.
    const onMonthChange = vi.fn();
    const { container } = render(
      <CalendarGrid {...BASE} onMonthChange={onMonthChange} />,
    );
    const last = container.querySelector('[data-iso="2026-08-31"]') as HTMLElement;
    fireEvent.keyDown(last, { key: "ArrowRight" });
    expect(onMonthChange).toHaveBeenCalledWith(2026, 8);
  });

  it("pages by month", () => {
    const onMonthChange = vi.fn();
    const { container } = render(
      <CalendarGrid {...BASE} onMonthChange={onMonthChange} />,
    );
    const cell = container.querySelector('[data-iso="2026-08-12"]') as HTMLElement;
    fireEvent.keyDown(cell, { key: "PageDown" });
    expect(onMonthChange).toHaveBeenCalledWith(2026, 8);
    fireEvent.keyDown(cell, { key: "PageUp" });
    expect(onMonthChange).toHaveBeenCalledWith(2026, 6);
  });

  it("crosses the year boundary correctly", () => {
    const onMonthChange = vi.fn();
    const { container } = render(
      <CalendarGrid
        year={2026}
        month={11}
        label="December 2026"
        today={new Date(2026, 11, 1)}
        onMonthChange={onMonthChange}
      />,
    );
    const cell = container.querySelector('[data-iso="2026-12-01"]') as HTMLElement;
    fireEvent.keyDown(cell, { key: "PageDown" });
    expect(onMonthChange).toHaveBeenCalledWith(2027, 0);
  });

  // ── 10.6, the reason this needed a design-language change ──

  it("states the remainder as a count rather than clipping it", () => {
    // The obligation: content beyond capacity is information the reader can
    // act on, not information they never learn exists.
    const { container } = render(
      <CalendarGrid {...BASE} capacity={2} counts={{ "2026-08-12": 5 }} />,
    );
    const cell = container.querySelector('[data-iso="2026-08-12"]');
    expect(cell?.querySelector(".strand-calendar-grid__remainder")?.textContent).toBe(
      "+3 more",
    );
  });

  it("shows no remainder when everything fits", () => {
    const { container } = render(
      <CalendarGrid {...BASE} capacity={2} counts={{ "2026-08-12": 2 }} />,
    );
    expect(
      container.querySelector('[data-iso="2026-08-12"] .strand-calendar-grid__remainder'),
    ).toBeNull();
  });

  it("never renders a negative or zero remainder", () => {
    const { container } = render(
      <CalendarGrid {...BASE} capacity={5} counts={{ "2026-08-12": 1 }} />,
    );
    expect(container.textContent).not.toContain("more");
  });

  it("renders per-day content through the consumer's callback", () => {
    const { container } = render(
      <CalendarGrid
        {...BASE}
        renderDay={(d) => (d.iso === "2026-08-12" ? <span>ship</span> : null)}
      />,
    );
    expect(
      container.querySelector('[data-iso="2026-08-12"]')?.textContent,
    ).toContain("ship");
  });

  it("marks adjacent days so they read as context", () => {
    const { container } = render(<CalendarGrid {...BASE} />);
    const adjacent = container.querySelectorAll(
      ".strand-calendar-grid__day--adjacent",
    );
    expect(adjacent.length).toBeGreaterThan(0);
    // August 1 2026 is a Saturday, so the six days before it are July's.
    expect(adjacent[0].getAttribute("data-iso")).toBe("2026-07-26");
  });

});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./CalendarGrid.fixtures.js";

snapshotFixtures(CalendarGrid, fixtures);

snapshotStylesheet(resolve(__dirname, "./CalendarGrid.css"));

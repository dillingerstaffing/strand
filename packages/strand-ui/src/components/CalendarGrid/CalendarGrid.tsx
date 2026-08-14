/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX, VNode } from "preact";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";

export interface CalendarDay {
  /** Calendar date this well represents. */
  date: Date;
  /** Day of the month, 1-31. */
  day: number;
  /** True when the day belongs to the previous or next month. */
  adjacent: boolean;
  /** `YYYY-MM-DD`, stable across time zones and usable as a key. */
  iso: string;
}

/**
 * The weeks of a month, including the leading and trailing days needed to
 * complete the first and last weeks.
 *
 * Pure and exported so the arithmetic is testable without rendering. The
 * cases that break naive implementations are a month starting on the week
 * start (which must NOT gain a blank leading week), February in a leap
 * year, and a 31-day month starting late enough to need six rows.
 *
 * Dates are constructed with local y/m/d rather than parsed from strings:
 * `new Date("2026-08-01")` is parsed as UTC midnight and renders as the
 * previous day for anyone west of Greenwich, which turns a calendar off
 * by one for half the world.
 *
 * @param year  Full year, e.g. 2026.
 * @param month Zero-based month, matching `Date.getMonth()`.
 * @param weekStartsOn 0 = Sunday, 1 = Monday. Default 0.
 * @param fixedWeeks Pad to exactly this many rows. Unset means "as many
 *   as the month needs", which changes the grid's height between months.
 */
export function buildMonthGrid(
  year: number,
  month: number,
  weekStartsOn = 0,
  fixedWeeks?: number,
): CalendarDay[][] {
  const pad = (n: number) => String(n).padStart(2, "0");
  const toDay = (d: Date, adjacent: boolean): CalendarDay => ({
    date: d,
    day: d.getDate(),
    adjacent,
    iso: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
  });

  const first = new Date(year, month, 1);
  // How many days of the previous month complete the first week. The
  // modulo is what keeps a month that already starts on the week start
  // from gaining an empty leading row.
  const lead = (first.getDay() - weekStartsOn + 7) % 7;

  const weeks: CalendarDay[][] = [];
  const cursor = new Date(year, month, 1 - lead);

  // Rows until the month is exhausted, then stop. A fixed six rows would
  // append a whole week of next-month days to most months, and a fixed
  // five would truncate the ones that need six.
  //
  // The termination compares against the LAST DAY OF THE MONTH, not
  // against the week's month. Testing "the week ended outside this month"
  // is subtly wrong for a month that ends exactly on a week boundary:
  // February 2026 is 28 days starting on a Sunday, so its fourth week
  // ends on the 28th, still inside February, and the grid grew a fifth
  // row of March. Day 0 of the next month is the last day of this one.
  const lastOfMonth = new Date(year, month + 1, 0);

  while (true) {
    const week: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
      week.push(toDay(d, d.getMonth() !== month));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
    if (fixedWeeks != null) {
      if (weeks.length >= fixedWeeks) break;
    } else if (week[6].date >= lastOfMonth) {
      break;
    }
  }
  return weeks;
}

export interface CalendarGridProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Full year of the month shown. */
  year: number;
  /** Zero-based month shown, matching `Date.getMonth()`. */
  month: number;
  /** 0 = Sunday, 1 = Monday. Default 0. */
  weekStartsOn?: 0 | 1;
  /**
   * Render exactly this many week rows, padding from the adjacent months.
   *
 * A month is four to six weeks long, so a grid that stops when the month
 * is covered CHANGES HEIGHT as the reader pages: six rows for August
 * 2026, five for September, four for February. At ~112px a row that
 * resizes the region and moves everything beneath it, every time someone
 * turns the month.
 *
 * `fixedWeeks` pads to a constant row count instead. This is 6.6.1's
 * space contract and 10.6's argument one level up: 10.6 says a bounded
 * cell must not grow its row, and this says the grid must not grow its
 * page. Same obligation, different scale, so it needs no new rule.
 *
 * Six is the value that never truncates, because six is the most rows any
 * month can need. Padding is drawn from the adjacent months, which the
 * grid already renders and already marks, so a padded row is not a blank
 * band -- it is the same context the first and last rows always carry.
   *
   * Unset keeps the old behaviour: as many rows as the month needs.
   */
  fixedWeeks?: number;
  /**
   * Accessible name for the grid, e.g. "August 2026". Required: a grid
   * with no name is announced as an unlabelled table of numbers.
   */
  label: string;
  /** Column headings, week-start first. Default English short names. */
  dayNames?: string[];
  /** Full column names for `abbr`, so a reader hears "Monday" not "Mon". */
  dayNamesLong?: string[];
  /** Currently selected day, as `YYYY-MM-DD`. */
  selected?: string;
  /**
   * The day treated as today. Pass it explicitly for a deterministic
   * server render; left unset it is computed when the component renders,
   * which makes the server and client disagree across midnight.
   */
  today?: Date;
  /** Renders the contents of one day. Return null for an empty day. */
  renderDay?: (day: CalendarDay) => VNode | null;
  /**
   * How many items a day shows before the rest become a count. This is
   * 10.6's declared capacity, and it is measured at the SMALLEST
   * sanctioned size: a value that fits on a desktop and clips on a phone
   * is the wrong value.
   */
  capacity?: number;
  /** Items per day, keyed by `YYYY-MM-DD`. Drives the remainder count. */
  counts?: Record<string, number>;
  /** Called with `YYYY-MM-DD` when a day is activated. */
  onSelect?: (iso: string) => void;
  /** Called when arrow navigation leaves the month shown. */
  onMonthChange?: (year: number, month: number) => void;
  className?: string;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * A month laid out as a well plate: seven columns because a week has
 * seven days, and as many rows as the month needs.
 *
 * Implements the `well-plate` production (design-language.md Part XI-B
 * 11.10) and 10.6 Bounded Cells. A day is a bounded cell: its size comes
 * from the structure rather than from its contents, so it declares a
 * capacity and states the rest as a count. It never clips silently and
 * never grows its row.
 *
 * Keyboard: the ARIA grid pattern (14.5). The whole grid is ONE tab stop
 * with a roving `tabindex`; arrows move by day and week, Home and End
 * move within the week, PageUp and PageDown change month.
 *
 * Set the cell floor with `--strand-calendar-grid-day-size` (default
 * `--strand-space-20`) when the month IS the page rather than a panel
 * inside one -- at full screen, six rows of the default leave the grid
 * shorter than the viewport. Reach for `strand-calendar-grid--compact`
 * instead when the whole density should drop: that changes padding too.
 *
 * @example
 * ```tsx
 * import { CalendarGrid } from '@dillingerstaffing/strand-ui';
 *
 * <CalendarGrid
 *   year={2026} month={7} label="August 2026"
 *   selected={selected} onSelect={setSelected}
 *   capacity={2} counts={countsByDay}
 *   renderDay={(d) => <EventChips iso={d.iso} />}
 * />
 * ```
 */
export function CalendarGrid({
  year,
  month,
  weekStartsOn = 0,
  fixedWeeks,
  label,
  dayNames,
  dayNamesLong,
  selected,
  today,
  renderDay,
  capacity = 2,
  counts,
  onSelect,
  onMonthChange,
  className = "",
  ...rest
}: CalendarGridProps) {
  const weeks = useMemo(
    () => buildMonthGrid(year, month, weekStartsOn, fixedWeeks),
    [year, month, weekStartsOn, fixedWeeks],
  );

  const gridRef = useRef<HTMLDivElement>(null);

  // The roving tabindex's holder. Defaults to the selected day when it is
  // in view, else the first day of the month, so a keyboard user arrives
  // somewhere meaningful rather than on a trailing day of the last month.
  const firstOfMonth = weeks.flat().find((d) => !d.adjacent)?.iso;
  const [focused, setFocused] = useState<string | undefined>(undefined);
  const rovingIso =
    focused ?? (selected && weeks.flat().some((d) => d.iso === selected) ? selected : firstOfMonth);

  const todayIso = useMemo(() => {
    const t = today ?? new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
  }, [today]);

  const names = dayNames ?? DAY_NAMES;
  const namesLong = dayNamesLong ?? DAY_NAMES_LONG;
  const ordered = Array.from({ length: 7 }, (_, i) => (i + weekStartsOn) % 7);

  const move = useCallback(
    (from: CalendarDay, deltaDays: number) => {
      const next = new Date(
        from.date.getFullYear(),
        from.date.getMonth(),
        from.date.getDate() + deltaDays,
      );
      const pad = (n: number) => String(n).padStart(2, "0");
      const iso = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
      setFocused(iso);
      if (next.getMonth() !== month || next.getFullYear() !== year) {
        onMonthChange?.(next.getFullYear(), next.getMonth());
      }
      // Focus follows the roving index. Deferred to the next frame because
      // a month change re-renders the grid and the target does not exist
      // until it has.
      requestAnimationFrame(() => {
        gridRef.current
          ?.querySelector<HTMLElement>(`[data-iso="${iso}"]`)
          ?.focus();
      });
    },
    [month, year, onMonthChange],
  );

  const onKeyDown = (event: KeyboardEvent, day: CalendarDay) => {
    const deltas: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: 7,
      ArrowUp: -7,
    };
    if (event.key in deltas) {
      event.preventDefault();
      move(day, deltas[event.key]);
      return;
    }
    // Home and End are within the WEEK, per the grid pattern: a row's
    // first and last cell. Not the month, which PageUp/PageDown covers.
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const offset = (day.date.getDay() - weekStartsOn + 7) % 7;
      move(day, event.key === "Home" ? -offset : 6 - offset);
      return;
    }
    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      const delta = event.key === "PageUp" ? -1 : 1;
      const target = new Date(year, month + delta, 1);
      setFocused(undefined);
      onMonthChange?.(target.getFullYear(), target.getMonth());
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(day.iso);
    }
  };

  const classes = [
    "strand-calendar-grid",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={gridRef} class={classes} role="grid" aria-label={label} {...rest}>
      <div class="strand-calendar-grid__header" role="row">
        {ordered.map((i) => (
          // The visible text is an abbreviation, and "Mon" read aloud is
          // not a weekday. `abbr` would be the answer in a real <table>,
          // but it is only valid on <th> and does nothing on a div with
          // role="columnheader". A visually-hidden full name is used
          // instead of aria-label because it survives translation tools
          // and user stylesheets that aria-label does not.
          <span key={i} class="strand-calendar-grid__axis" role="columnheader">
            <span aria-hidden="true">{names[i]}</span>
            <span class="strand-sr-only">{namesLong[i]}</span>
          </span>
        ))}
      </div>

      {weeks.map((week) => (
        <div key={week[0].iso} class="strand-calendar-grid__week" role="row">
          {week.map((day) => {
            const total = counts?.[day.iso] ?? 0;
            const hidden = Math.max(0, total - capacity);
            const dayClasses = [
              "strand-calendar-grid__day",
              day.adjacent ? "strand-calendar-grid__day--adjacent" : "",
              day.iso === todayIso ? "strand-calendar-grid__day--today" : "",
              day.iso === selected ? "strand-calendar-grid__day--selected" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={day.iso}
                class={dayClasses}
                role="gridcell"
                data-iso={day.iso}
                // The roving tabindex: exactly one cell is reachable by
                // Tab and the arrows move between them. Thirty-one tab
                // stops would make the keyboard path through a page
                // carrying a calendar unusable.
                tabIndex={day.iso === rovingIso ? 0 : -1}
                aria-selected={day.iso === selected ? "true" : undefined}
                aria-current={day.iso === todayIso ? "date" : undefined}
                onKeyDown={(e) => onKeyDown(e as unknown as KeyboardEvent, day)}
                onClick={() => onSelect?.(day.iso)}
                onFocus={() => setFocused(day.iso)}
              >
                <span class="strand-calendar-grid__date">{day.day}</span>
                {renderDay && (
                  <div class="strand-calendar-grid__content">{renderDay(day)}</div>
                )}
                {hidden > 0 && (
                  <span class="strand-calendar-grid__remainder">+{hidden} more</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

CalendarGrid.displayName = "CalendarGrid";

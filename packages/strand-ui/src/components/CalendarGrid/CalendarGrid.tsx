/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX, VNode } from "preact";
import { forwardRef } from "preact/compat";
import { useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import { cx } from "../../internal/index.js";

export interface CalendarDay {
  date: Date;
  /** Day of the month, 1 to 31. */
  day: number;
  /** Belongs to the previous or next month. */
  adjacent: boolean;
  /** `YYYY-MM-DD`; stable across time zones and usable as a key. */
  iso: string;
}

const pad = (n: number) => String(n).padStart(2, "0");
const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/**
 * The weeks of a month, including the leading and trailing days that complete them (cf: calendar-grid-arithmetic).
 * @param month zero-based, as `Date.getMonth()`
 * @param weekStartsOn 0 Sunday, 1 Monday
 * @param fixedWeeks pad to exactly this many rows
 */
export function buildMonthGrid(year: number, month: number, weekStartsOn = 0, fixedWeeks?: number): CalendarDay[][] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const cursor = new Date(year, month, 1 - lead);
  const lastOfMonth = new Date(year, month + 1, 0);
  const weeks: CalendarDay[][] = [];
  while (true) {
    const week: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
      week.push({ date: d, day: d.getDate(), adjacent: d.getMonth() !== month, iso: isoOf(d) });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
    if (fixedWeeks != null ? weeks.length >= fixedWeeks : week[6].date >= lastOfMonth) break;
  }
  return weeks;
}

export interface CalendarGridProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  year: number;
  /** Zero-based, as `Date.getMonth()`. */
  month: number;
  weekStartsOn?: 0 | 1;
  /** Render exactly this many rows so the grid keeps its height across months (DL 6.6.1); six never truncates. */
  fixedWeeks?: number;
  /** Accessible name, e.g. "August 2026". */
  label: string;
  /** Column headings, week-start first. */
  dayNames?: string[];
  /** Full column names for assistive tech. */
  dayNamesLong?: string[];
  /** Selected day, `YYYY-MM-DD`. */
  selected?: string;
  /** The day treated as today; pass it for a deterministic server render. */
  today?: Date;
  /** Renders the contents of one day. */
  renderDay?: (day: CalendarDay) => VNode | null;
  /** Items a day shows before the rest become a count (DL 10.6). */
  capacity?: number;
  /** Items per day, keyed by `YYYY-MM-DD`. */
  counts?: Record<string, number>;
  /** Called with `YYYY-MM-DD` when a day is activated. */
  onSelect?: (iso: string) => void;
  /** Called when arrow navigation leaves the month shown. */
  onMonthChange?: (year: number, month: number) => void;
  className?: string;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * A month as a grid of bounded day cells (DL 11.10, 10.6) with the ARIA grid keyboard pattern.
 *
 * @example
 * <CalendarGrid year={2026} month={7} label="August 2026" selected={selected} onSelect={setSelected} counts={countsByDay} renderDay={(d) => <EventChips iso={d.iso} />} />
 */
export const CalendarGrid = forwardRef<HTMLDivElement, CalendarGridProps>(
  (
    { year, month, weekStartsOn = 0, fixedWeeks, label, dayNames, dayNamesLong, selected, today, renderDay, capacity = 2, counts, onSelect, onMonthChange, className = "", ...rest },
    ref,
  ) => {
    const weeks = useMemo(() => buildMonthGrid(year, month, weekStartsOn, fixedWeeks), [year, month, weekStartsOn, fixedWeeks]);
    const cells = useRef(new Map<string, HTMLDivElement>());
    const [focused, setFocused] = useState<string | undefined>(undefined);
    const firstOfMonth = weeks.flat().find((d) => !d.adjacent)?.iso;
    const rovingIso = focused ?? (selected && weeks.flat().some((d) => d.iso === selected) ? selected : firstOfMonth);
    const todayIso = useMemo(() => isoOf(today ?? new Date()), [today]);
    const names = dayNames ?? DAY_NAMES;
    const namesLong = dayNamesLong ?? DAY_NAMES_LONG;
    const ordered = Array.from({ length: 7 }, (_, i) => (i + weekStartsOn) % 7);

    // Focus follows the roving index once the target cell exists.
    useLayoutEffect(() => {
      if (focused) cells.current.get(focused)?.focus();
    }, [focused, weeks]);

    const move = (from: CalendarDay, deltaDays: number) => {
      const next = new Date(from.date.getFullYear(), from.date.getMonth(), from.date.getDate() + deltaDays);
      setFocused(isoOf(next));
      if (next.getMonth() !== month || next.getFullYear() !== year) onMonthChange?.(next.getFullYear(), next.getMonth());
    };
    const onKeyDown = (event: KeyboardEvent, day: CalendarDay) => {
      const deltas: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
      if (event.key in deltas) {
        event.preventDefault();
        return move(day, deltas[event.key]);
      }
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        const offset = (day.date.getDay() - weekStartsOn + 7) % 7;
        return move(day, event.key === "Home" ? -offset : 6 - offset);
      }
      if (event.key === "PageUp" || event.key === "PageDown") {
        event.preventDefault();
        const target = new Date(year, month + (event.key === "PageUp" ? -1 : 1), 1);
        setFocused(undefined);
        return onMonthChange?.(target.getFullYear(), target.getMonth());
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect?.(day.iso);
      }
    };

    return (
      <div ref={ref} className={cx("strand-calendar-grid", className)} role="grid" aria-label={label} {...rest}>
        <div className="strand-calendar-grid__header" role="row">
          {ordered.map((i) => (
            <span key={i} className="strand-calendar-grid__axis" role="columnheader">
              <span aria-hidden="true">{names[i]}</span>
              <span className="strand-sr-only">{namesLong[i]}</span>
            </span>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={week[0].iso} className="strand-calendar-grid__week" role="row">
            {week.map((day) => {
              const hidden = Math.max(0, (counts?.[day.iso] ?? 0) - capacity);
              return (
                <div
                  key={day.iso}
                  ref={(el) => {
                    if (el) cells.current.set(day.iso, el);
                    else cells.current.delete(day.iso);
                  }}
                  className={cx(
                    "strand-calendar-grid__day",
                    day.adjacent && "strand-calendar-grid__day--adjacent",
                    day.iso === todayIso && "strand-calendar-grid__day--today",
                    day.iso === selected && "strand-calendar-grid__day--selected",
                  )}
                  role="gridcell"
                  data-iso={day.iso}
                  tabIndex={day.iso === rovingIso ? 0 : -1}
                  aria-selected={day.iso === selected ? "true" : undefined}
                  aria-current={day.iso === todayIso ? "date" : undefined}
                  onKeyDown={(e) => onKeyDown(e as unknown as KeyboardEvent, day)}
                  onClick={() => onSelect?.(day.iso)}
                  onFocus={() => setFocused(day.iso)}
                >
                  <span className="strand-calendar-grid__date">{day.day}</span>
                  {renderDay && <div className="strand-calendar-grid__content">{renderDay(day)}</div>}
                  {hidden > 0 && <span className="strand-calendar-grid__remainder">+{hidden} more</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  },
);
CalendarGrid.displayName = "CalendarGrid";

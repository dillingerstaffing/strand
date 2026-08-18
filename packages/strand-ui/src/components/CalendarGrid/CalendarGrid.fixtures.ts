import type { Fixture } from "../../test/fixtures.js";

export const fixtures: Fixture[] = [
  { name: "august 2026", props: { year: 2026, month: 7, label: "August 2026", today: new Date("2026-08-18T12:00:00") } },
  { name: "monday start with selection and today", props: { year: 2026, month: 1, label: "February 2026", weekStartsOn: 1, selected: "2026-02-10", today: new Date("2026-02-03T12:00:00") } },
  { name: "fixed six weeks with counts", props: { year: 2026, month: 8, label: "September 2026", fixedWeeks: 6, capacity: 1, counts: { "2026-09-04": 3, "2026-09-05": 1 }, today: new Date("2026-09-01T12:00:00") } },
];

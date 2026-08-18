# The month grid stops at the last day of the month and builds dates locally

`buildMonthGrid` ends when the week just built reaches the LAST DAY OF THE MONTH (day 0 of the next month), never when "the week ended outside this month": a month that ends exactly on a week boundary (February 2026, 28 days from a Sunday) would otherwise grow a whole row of March. The lead of previous-month days is `(firstDay - weekStartsOn + 7) % 7`, so a month that starts on the week start gains no blank leading row. Dates are constructed with local `year, month, day`, never parsed from strings: `new Date("2026-08-01")` is UTC midnight and renders as the previous day west of Greenwich.

Where: `packages/strand-ui/src/components/CalendarGrid/CalendarGrid.tsx`

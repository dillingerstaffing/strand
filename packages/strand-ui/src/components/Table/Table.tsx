/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useState, useCallback } from "preact/hooks";

export interface TableColumn {
  /** Unique key matching the data field */
  key: string;
  /** Display header text */
  header: string;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Optional fixed width */
  width?: string;
}

export interface TableProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "data"> {
  /** Column definitions */
  columns: TableColumn[];
  /** Row data */
  data: Array<Record<string, any>>;
  /** Called when a sortable column header is clicked */
  onSort?: (key: string, direction: "asc" | "desc") => void;
}

export const Table = forwardRef<HTMLDivElement, TableProps>(
  ({ columns, data, onSort, className = "", ...rest }, ref) => {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleSort = useCallback(
      (key: string) => {
        const nextDirection =
          sortKey === key && sortDirection === "asc" ? "desc" : "asc";
        setSortKey(key);
        setSortDirection(nextDirection);
        onSort?.(key, nextDirection);
      },
      [sortKey, sortDirection, onSort],
    );

    const wrapperClasses = ["strand-table-wrapper", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={wrapperClasses} {...rest}>
        <table className="strand-table">
          <thead className="strand-table__head">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="strand-table__th"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className="strand-table__sort-btn"
                      onClick={() => handleSort(col.key)}
                      aria-label={`Sort by ${col.header}`}
                    >
                      {col.header}
                      <span
                        className="strand-table__sort-indicator"
                        aria-hidden="true"
                      >
                        {sortKey === col.key
                          ? sortDirection === "asc"
                            ? "\u2191"
                            : "\u2193"
                          : "\u2195"}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="strand-table__body">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="strand-table__row">
                {columns.map((col) => (
                  <td key={col.key} className="strand-table__td">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);

Table.displayName = "Table";

/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useState } from "preact/hooks";
import { cx } from "../../internal/index.js";

export interface TableColumn {
  /** Field key in each row. */
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
}

export interface TableProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "data"> {
  columns: TableColumn[];
  data: Array<Record<string, unknown>>;
  /** Called with the column key and the direction after a sortable header is pressed. */
  onSort?: (key: string, direction: "asc" | "desc") => void;
}

/**
 * Data table with sortable headers.
 *
 * @example
 * <Table columns={[{ key: "name", header: "Name", sortable: true }]} data={rows} onSort={sortBy} />
 */
export const Table = forwardRef<HTMLDivElement, TableProps>(({ columns, data, onSort, className = "", ...rest }, ref) => {
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const handleSort = (key: string) => {
    const direction = sort?.key === key && sort.direction === "asc" ? "desc" : "asc";
    setSort({ key, direction });
    onSort?.(key, direction);
  };
  return (
    <div ref={ref} className={cx("strand-table-wrapper", className)} {...rest}>
      <table className="strand-table">
        <thead className="strand-table__head">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="strand-table__th" style={col.width ? { width: col.width } : undefined}>
                {col.sortable ? (
                  <button type="button" className="strand-table__sort-btn" onClick={() => handleSort(col.key)} aria-label={`Sort by ${col.header}`}>
                    {col.header}
                    <span className="strand-table__sort-indicator" aria-hidden="true">
                      {sort?.key === col.key ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}
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
                  {row[col.key] as JSX.Element | string | number | null | undefined}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
Table.displayName = "Table";

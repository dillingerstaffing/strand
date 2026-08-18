import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Table } from "./Table.js";

const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "role", header: "Role" },
  { key: "status", header: "Status", sortable: true },
];

const data = [
  { name: "Alice", role: "Engineer", status: "Active" },
  { name: "Bob", role: "Designer", status: "Away" },
];

describe("Table", () => {
  // ── Rendering ──

  it("renders a table element", () => {
    const { container } = render(<Table columns={columns} data={data} />);
    expect(container.querySelector("table")).toBeTruthy();
  });

  it("renders column headers", () => {
    const { getByText } = render(<Table columns={columns} data={data} />);
    expect(getByText("Name")).toBeTruthy();
    expect(getByText("Role")).toBeTruthy();
    expect(getByText("Status")).toBeTruthy();
  });

  it("renders data rows", () => {
    const { getByText } = render(<Table columns={columns} data={data} />);
    expect(getByText("Alice")).toBeTruthy();
    expect(getByText("Bob")).toBeTruthy();
  });

  it("renders correct number of cells", () => {
    const { container } = render(<Table columns={columns} data={data} />);
    const cells = container.querySelectorAll(".strand-table__td");
    // 2 rows x 3 columns = 6 cells
    expect(cells.length).toBe(6);
  });

  it("renders correct number of header cells", () => {
    const { container } = render(<Table columns={columns} data={data} />);
    const headers = container.querySelectorAll(".strand-table__th");
    expect(headers.length).toBe(3);
  });

  // ── Sorting ──

  it("renders sort button for sortable columns", () => {
    const { container } = render(<Table columns={columns} data={data} />);
    const sortButtons = container.querySelectorAll(".strand-table__sort-btn");
    // "Name" and "Status" are sortable
    expect(sortButtons.length).toBe(2);
  });

  it("does not render sort button for non-sortable columns", () => {
    const nonSortable = [{ key: "role", header: "Role" }];
    const { container } = render(
      <Table columns={nonSortable} data={data} />,
    );
    const sortButtons = container.querySelectorAll(".strand-table__sort-btn");
    expect(sortButtons.length).toBe(0);
  });

  it("calls onSort with key and asc direction on first click", () => {
    const onSort = vi.fn();
    const { container } = render(
      <Table columns={columns} data={data} onSort={onSort} />,
    );
    const sortButtons = container.querySelectorAll(".strand-table__sort-btn");
    fireEvent.click(sortButtons[0]);
    expect(onSort).toHaveBeenCalledWith("name", "asc");
  });

  it("toggles sort direction on second click of same column", () => {
    const onSort = vi.fn();
    const { container } = render(
      <Table columns={columns} data={data} onSort={onSort} />,
    );
    const sortButtons = container.querySelectorAll(".strand-table__sort-btn");
    fireEvent.click(sortButtons[0]); // asc
    fireEvent.click(sortButtons[0]); // desc
    expect(onSort).toHaveBeenLastCalledWith("name", "desc");
  });

  // ── Responsive ──

  it("wraps table in overflow-x scroll container", () => {
    const { container } = render(<Table columns={columns} data={data} />);
    const wrapper = container.querySelector(".strand-table-wrapper");
    expect(wrapper).toBeTruthy();
  });

  // ── Custom className ──

  // ── Empty state ──

  it("says so, in one full-width cell, when there are no rows", () => {
    const { container, getByText } = render(<Table columns={columns} data={[]} emptyLabel="Nothing yet" />);
    const cell = getByText("Nothing yet");
    expect(cell.getAttribute("colspan")).toBe(String(columns.length));
    expect(container.querySelectorAll(".strand-table__row").length).toBe(1);
  });

  it("names itself for assistive technology through a hidden caption, or shows a visible one", () => {
    const { container, rerender } = render(<Table columns={columns} data={[]} label="People" />);
    const caption = container.querySelector("caption")!;
    expect(caption.textContent).toBe("People");
    expect(caption.className).toContain("strand-sr-only");
    rerender(<Table columns={columns} data={[]} caption={<span>Visible caption</span>} />);
    expect(container.querySelector("caption")!.className).not.toContain("strand-sr-only");
  });

  it("announces the sorted column and direction on the header cell", () => {
    const { container, getByLabelText } = render(<Table columns={columns} data={data} />);
    const th = container.querySelector("th")!;
    expect(th.getAttribute("aria-sort")).toBe("none");
    fireEvent.click(getByLabelText("Sort by Name"));
    expect(th.getAttribute("aria-sort")).toBe("ascending");
    fireEvent.click(getByLabelText("Sort by Name"));
    expect(th.getAttribute("aria-sort")).toBe("descending");
    expect(container.querySelectorAll("th[aria-sort]").length).toBe(columns.filter((c) => c.sortable).length);
  });

  it("shows the sort its owner holds when the sort is controlled", () => {
    const onSort = vi.fn();
    const { container, getByLabelText, rerender } = render(<Table columns={columns} data={data} sort={{ key: "name", direction: "desc" }} onSort={onSort} />);
    expect(container.querySelector("th")!.getAttribute("aria-sort")).toBe("descending");
    fireEvent.click(getByLabelText("Sort by Name"));
    expect(onSort).toHaveBeenCalledWith("name", "asc");
    expect(container.querySelector("th")!.getAttribute("aria-sort")).toBe("descending");
    rerender(<Table columns={columns} data={data} sort={null} onSort={onSort} />);
    expect(container.querySelector("th")!.getAttribute("aria-sort")).toBe("none");
  });

  it("renders a cell from the whole row when the column asks", () => {
    const cols = [{ key: "name", header: "Name", render: (row: Record<string, unknown>) => <strong>{String(row.name).toUpperCase()}</strong> }];
    const { container } = render(<Table columns={cols} data={[{ name: "ada" }]} />);
    expect(container.querySelector("td strong")!.textContent).toBe("ADA");
  });

  it("keys rows by the field or function it is given", () => {
    const rows = [{ id: "b", name: "Bee" }, { id: "a", name: "Ay" }];
    const { container, rerender } = render(<Table columns={[{ key: "name", header: "Name" }]} data={rows} rowKey="id" />);
    const first = container.querySelector("tbody tr")!;
    rerender(<Table columns={[{ key: "name", header: "Name" }]} data={[...rows].reverse()} rowKey="id" />);
    // The node that was first is now second: keyed rows move rather than being rewritten in place.
    expect(container.querySelectorAll("tbody tr")[1]).toBe(first);
  });

  // ── Column width ──

  it("applies width style to column headers", () => {
    const cols = [{ key: "name", header: "Name", width: "200px" }];
    const { container } = render(<Table columns={cols} data={[]} />);
    const th = container.querySelector(".strand-table__th") as HTMLElement;
    expect(th?.style.width).toBe("200px");
  });

  // ── Sort indicator ──

  it("shows sort indicator on sortable columns", () => {
    const { container } = render(<Table columns={columns} data={data} />);
    const indicators = container.querySelectorAll(
      ".strand-table__sort-indicator",
    );
    expect(indicators.length).toBe(2);
  });
});

import { snapshotFixtures } from "../../test/snapshot.js";
import { snapshotStylesheet } from "../../test/stylesheet.js";
import { fixtures } from "./Table.fixtures.js";

snapshotFixtures(Table, fixtures);

snapshotStylesheet(resolve(__dirname, "./Table.css"));

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx"; // Import xlsx

export const exportToExcel = (
  rows: any[],
  columnVisibilityModel: { [key: string]: any },
  reportName: string
) => {
  // Filter rows to include only the visible columns
  const filteredRows = rows.map((row) => {
    const newRow: any = {};
    for (const col in row) {
      if (columnVisibilityModel[col.toLowerCase()] !== false) {
        // Include only if the column is visible
        newRow[col] = row[col];
      }
    }
    return newRow;
  });
  console.log(filteredRows);

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(filteredRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  // Write to file
  XLSX.writeFile(workbook, `${reportName}.xlsx`);
};

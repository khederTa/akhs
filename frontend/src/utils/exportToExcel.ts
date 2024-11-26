/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx"; // Import xlsx

export const exportToExcel = (
  rows: any[],
  reportName: string
) => {
  
  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  // Write to file
  XLSX.writeFile(workbook, `${reportName}.xlsx`);
};

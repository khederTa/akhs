import * as XLSX from "xlsx"; // Import xlsx

export const exportToExcel = (rows: any, reportName:string) => {
  console.log("exporting...");
  const worksheet = XLSX.utils.json_to_sheet(rows); // Convert rows to worksheet
  const workbook = XLSX.utils.book_new(); // Create a new workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users"); // Append the worksheet to the workbook
  XLSX.writeFile(workbook, `${reportName}.xlsx`); // Write the workbook to a file
  console.log("Done!");
};

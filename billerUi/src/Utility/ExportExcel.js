import ExcelJS from "exceljs";

export const exportStyledExcel = async (data, fileName, headers, title) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Add title (merged cells)
  worksheet.mergeCells(1, 1, 2, headers.length);
  const titleCell = worksheet.getCell(1, 1);
  titleCell.value = title;
  titleCell.font = { bold: true, size: 16 };
  titleCell.fill ={
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFB0C4DE" }, // Light blue
  }
  titleCell.alignment = { horizontal: "center" };

  // Add headers (bold + background)
  worksheet.addRow(headers);
  const headerRow = worksheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, size: 14 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" }, // Light gray
    };
  });

  // Add data
  data.forEach((row) => {
    worksheet.addRow(headers.map((key) => row[key] || ""));
  });

  // --- Browser-Specific File Saving ---
  if (typeof window !== "undefined") {
    // For browsers: Generate Blob and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    // For Node.js: Use writeFile
    await workbook.xlsx.writeFile(`${fileName}.xlsx`);
  }
};
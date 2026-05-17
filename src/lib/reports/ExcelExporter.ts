import * as XLSX from "xlsx-js-style";
import { ReportExporter } from "./ReportExporter";

/* ─── Paleta de colores corporativa ──────────────────────── */
const COLORS = {
  headerBg:   { rgb: "0F172A" },   // slate-900
  headerText: { rgb: "FFFFFF" },
  titleBg:    { rgb: "1E293B" },   // slate-800
  titleText:  { rgb: "F8FAFC" },
  subtitleText:{ rgb: "94A3B8" },  // slate-400
  oddRowBg:   { rgb: "F8FAFC" },   // slate-50
  evenRowBg:  { rgb: "FFFFFF" },
  borderColor:{ rgb: "E2E8F0" },   // slate-200
  bodyText:   { rgb: "334155" },   // slate-700
  accentBg:   { rgb: "EFF6FF" },   // blue-50
  accentText: { rgb: "1D4ED8" },   // blue-700
};

const THIN_BORDER = {
  top:    { style: "thin" as const, color: COLORS.borderColor },
  bottom: { style: "thin" as const, color: COLORS.borderColor },
  left:   { style: "thin" as const, color: COLORS.borderColor },
  right:  { style: "thin" as const, color: COLORS.borderColor },
};

export class ExcelExporter<T> extends ReportExporter<T> {
  protected async generateFile(rows: string[][], headers: string[]): Promise<Blob> {
    const cleanedRows = rows.map(row =>
      row.map(cell => {
        const val = String(cell).trim();
        if (val.startsWith("<svg") && val.includes("</svg>")) {
          return "[Imagen SVG]";
        }
        return cell;
      })
    );

    const colCount = headers.length;

    /* ── Filas de cabecera del reporte ────────────────────── */
    const titleRow = [this.title, ...Array(colCount - 1).fill("")];
    const dateRow  = [`Generado el: ${new Date().toLocaleString()}`, ...Array(colCount - 1).fill("")];
    const countRow = [`Total registros: ${cleanedRows.length}`, ...Array(colCount - 1).fill("")];
    const emptyRow = Array(colCount).fill("");

    const dataMatrix = [titleRow, dateRow, countRow, emptyRow, headers, ...cleanedRows];

    const worksheet = XLSX.utils.aoa_to_sheet(dataMatrix);

    /* ── Merge de celdas del título ──────────────────────── */
    const lastCol = colCount - 1;
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: lastCol } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: lastCol } },
    ];

    /* ── Anchos de columna inteligentes ──────────────────── */
    const colWidths = headers.map((h, i) => {
      const maxLen = Math.max(
        h.length,
        ...cleanedRows.map(row => (row[i] ? String(row[i]).length : 0))
      );
      return { wch: Math.min(55, Math.max(12, maxLen + 4)) };
    });
    worksheet["!cols"] = colWidths;

    /* ── Alto de filas ───────────────────────────────────── */
    worksheet["!rows"] = [
      { hpt: 32 },  // título
      { hpt: 18 },  // fecha
      { hpt: 18 },  // conteo
      { hpt: 8 },   // separador
      { hpt: 24 },  // headers
      ...cleanedRows.map(() => ({ hpt: 20 })),
    ];

    /* ── Aplicar estilos celda por celda ─────────────────── */
    const HEADER_DATA_ROW = 4; 

    for (let r = 0; r < dataMatrix.length; r++) {
      for (let c = 0; c < colCount; c++) {
        const cellRef = XLSX.utils.encode_cell({ r, c });
        if (!worksheet[cellRef]) {
          worksheet[cellRef] = { v: "", t: "s" };
        }
        const cell = worksheet[cellRef];

        // Fila del título
        if (r === 0) {
          cell.s = {
            font: { bold: true, sz: 16, color: COLORS.titleText },
            fill: { fgColor: COLORS.titleBg },
            alignment: { horizontal: "left", vertical: "center" },
          };
        }
        // Fila de fecha
        else if (r === 1) {
          cell.s = {
            font: { sz: 9, color: COLORS.subtitleText },
            fill: { fgColor: COLORS.titleBg },
            alignment: { horizontal: "left", vertical: "center" },
          };
        }
        // Fila de conteo
        else if (r === 2) {
          cell.s = {
            font: { sz: 9, color: COLORS.subtitleText },
            fill: { fgColor: COLORS.titleBg },
            alignment: { horizontal: "left", vertical: "center" },
          };
        }
        // Fila separador
        else if (r === 3) {
          cell.s = {
            fill: { fgColor: { rgb: "FFFFFF" } },
          };
        }
        // Fila de headers de tabla
        else if (r === HEADER_DATA_ROW) {
          cell.s = {
            font: { bold: true, sz: 10, color: COLORS.headerText },
            fill: { fgColor: COLORS.headerBg },
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: THIN_BORDER,
          };
        }
        // Filas de datos
        else if (r > HEADER_DATA_ROW) {
          const isOdd = (r - HEADER_DATA_ROW) % 2 === 1;
          cell.s = {
            font: { sz: 10, color: COLORS.bodyText },
            fill: { fgColor: isOdd ? COLORS.oddRowBg : COLORS.evenRowBg },
            alignment: { horizontal: "left", vertical: "center", wrapText: true },
            border: THIN_BORDER,
          };
        }
      }
    }

    /* ── Generar workbook ────────────────────────────────── */
    const workbook = XLSX.utils.book_new();
    const sheetName = this.title.substring(0, 31) || "Reporte";
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }
}

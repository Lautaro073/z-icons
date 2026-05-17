export * from "./ReportExporter";
export * from "./CsvExporter";
export * from "./ExcelExporter";
export * from "./PdfExporter";

// import { CsvExporter } from "./CsvExporter";
import { ExcelExporter } from "./ExcelExporter";
import { PdfExporter } from "./PdfExporter";
import { ExportFormat, ReportColumn, ReportExporter } from "./ReportExporter";

export function createExporter<T>(
  format: ExportFormat,
  title: string,
  columns: ReportColumn<T>[]
): ReportExporter<T> {
  switch (format) {
    // case 'csv':
    //   return new CsvExporter<T>(title, columns);
    case 'xlsx':
      return new ExcelExporter<T>(title, columns);
    case 'pdf':
      return new PdfExporter<T>(title, columns);
    default:
      throw new Error(`Formato de exportación no soportado: ${format}`);
  }
}

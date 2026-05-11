import { ReportExporter } from "./ReportExporter";

/**
 * Concrete Strategy: Exportador CSV nativo.
 */
export class CsvExporter<T> extends ReportExporter<T> {
  /**
   * Genera una cadena delimitada por comas encapsulada en un Blob.
   * Incluye la marca de orden de bytes (BOM) UTF-8 para soporte de Excel/idioma.
   */
  protected async generateFile(rows: string[][], headers: string[]): Promise<Blob> {
    const escapeCsvField = (field: string) => {
      // Si es código SVG, lo reemplazamos para no ensuciar la planilla con XML crudo
      if (field.trim().startsWith("<svg") && field.includes("</svg>")) {
        return "[Imagen SVG]";
      }
      
      const cleaned = field.replace(/"/g, '""');
      // Envolver en comillas si contiene comas, comillas o saltos de línea
      if (cleaned.includes(',') || cleaned.includes('"') || cleaned.includes('\n')) {
        return `"${cleaned}"`;
      }
      return cleaned;
    };

    // Generar header row
    const headerCsv = headers.map(escapeCsvField).join(',');

    // Generar data rows
    const contentCsv = rows
      .map((row) => row.map(escapeCsvField).join(','))
      .join('\n');

    const fullCsvString = `${headerCsv}\n${contentCsv}`;

    // Agregar el marcador UTF-8 BOM (\uFEFF) para que Excel reconozca acentos correctamente
    return new Blob(['\uFEFF' + fullCsvString], {
      type: 'text/csv;charset=utf-8',
    });
  }
}

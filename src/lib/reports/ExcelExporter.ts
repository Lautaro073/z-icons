import * as XLSX from "xlsx";
import { ReportExporter } from "./ReportExporter";

/**
 * Concrete Strategy: Exportador Excel nativo usando SheetJS.
 */
export class ExcelExporter<T> extends ReportExporter<T> {
  /**
   * Crea el libro y dispara la escritura directamente mediante SheetJS utilities.
   * Retorna Blob para ser gestionado por el Template Method de la clase base.
   */
  protected async generateFile(rows: string[][], headers: string[]): Promise<Blob> {
    // Limpiamos códigos SVG para no arruinar la planilla Excel con XML ilegible
    const cleanedRows = rows.map(row => 
      row.map(cell => {
        const val = String(cell).trim();
        if (val.startsWith("<svg") && val.includes("</svg>")) {
          return "[Imagen SVG]";
        }
        return cell;
      })
    );

    // Combinamos las cabeceras como la fila inicial
    const dataMatrix = [headers, ...cleanedRows];
    
    // Creamos hoja a partir de la matriz de arrays
    const worksheet = XLSX.utils.aoa_to_sheet(dataMatrix);
    
    // Autocalcular anchos de columnas básicos
    const colWidths = headers.map((h, i) => {
      // Longitud máxima de caracteres en la columna i (incluyendo el header)
      const maxLen = Math.max(
        h.length,
        ...rows.map(row => (row[i] ? String(row[i]).length : 0))
      );
      return { wch: Math.min(50, maxLen + 2) }; // Máximo 50 chars
    });
    
    worksheet['!cols'] = colWidths;

    // Crear libro
    const workbook = XLSX.utils.book_new();
    
    // Añadir hoja al libro con nombre limitado a 31 char por especificación Excel
    const sheetName = this.title.substring(0, 31) || "Reporte";
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // XLSX.writeFile dispara automáticamente la descarga en el frontend (no necesita Blob wrapper en el base exporter)
    // El nombre final se pasará desde el invocador, por lo que aquí usaremos el título como fallback seguro.
    // Nota: El invocador tiene el nombre final como parámetro. Como writeFile bloquea, forzamos el nombre directo.
    
    // Para mantener la interfaz limpia y que el exporter base conozca el nombre si quisiera,
    // podríamos convertir a binary, pero writeFile es más seguro/integrado.
    
    // Truco: Usamos write con type array para que genere el Blob y el Base class maneje el triggerDownload,
    // así mantenemos el flujo consistente.
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    return new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  }
}

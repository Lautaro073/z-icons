export interface ReportColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number | boolean | null | undefined);
}

export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

/**
 * Template Method / Strategy Pattern: Clase Base Abstracta para Exportadores
 */
export abstract class ReportExporter<T> {
  protected title: string;
  protected columns: ReportColumn<T>[];

  constructor(title: string, columns: ReportColumn<T>[]) {
    this.title = title;
    this.columns = columns;
  }

  /**
   * El Template Method: Define el esqueleto del algoritmo de exportación.
   * Ahora asíncrono para soportar generación de recursos (imágenes, canvas).
   */
  public async export(data: T[], filename: string): Promise<void> {
    if (!data || data.length === 0) {
      console.warn("No hay datos para exportar");
      return;
    }

    try {
      const headers = this.columns.map(col => col.header);
      const rows = this.transformData(data);
      
      // Paso abstracto delegado a las subclases (Polimorfismo)
      const blobOrVoid = await this.generateFile(rows, headers);
      
      // Si devolvió un Blob (ej: CSV), desencadenar descarga
      if (blobOrVoid instanceof Blob) {
        this.triggerDownload(blobOrVoid, filename);
      }
    } catch (error) {
      console.error(`Error exportando reporte ${this.title}:`, error);
      throw error;
    }
  }

  /**
   * Transforma los datos tipados en una matriz de strings bidimensional plana.
   * (Encapsulamiento y lógica compartida)
   */
  protected transformData(data: T[]): string[][] {
    return data.map((item) => {
      return this.columns.map((column) => {
        let value: unknown;
        
        if (typeof column.accessor === 'function') {
          value = column.accessor(item);
        } else {
          value = item[column.accessor];
        }

        // Normalizar nulls/undefineds a string vacío
        if (value === null || value === undefined) return "";
        
        // Formato booleano si aplica
        if (typeof value === 'boolean') return value ? "Sí" : "No";
        
        return String(value);
      });
    });
  }

  /**
   * Método Gancho/Abstracto que deben implementar las subclases.
   */
  protected abstract generateFile(rows: string[][], headers: string[]): Promise<Blob | void>;

  /**
   * Lógica de navegador compartida para disparar la descarga física del archivo.
   */
  private triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

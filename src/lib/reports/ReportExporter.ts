export interface ReportColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number | boolean | null | undefined);
}

export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

export abstract class ReportExporter<T> {
  protected title: string;
  protected columns: ReportColumn<T>[];

  constructor(title: string, columns: ReportColumn<T>[]) {
    this.title = title;
    this.columns = columns;
  }

  public async export(data: T[], filename: string): Promise<void> {
    if (!data || data.length === 0) {
      console.warn("No hay datos para exportar");
      return;
    }

    try {
      const headers = this.columns.map(col => col.header);
      const rows = this.transformData(data);
      
      const blobOrVoid = await this.generateFile(rows, headers);
      
      if (blobOrVoid instanceof Blob) {
        this.triggerDownload(blobOrVoid, filename);
      }
    } catch (error) {
      console.error(`Error exportando reporte ${this.title}:`, error);
      throw error;
    }
  }

  protected transformData(data: T[]): string[][] {
    return data.map((item) => {
      return this.columns.map((column) => {
        let value: unknown;
        
        if (typeof column.accessor === 'function') {
          value = column.accessor(item);
        } else {
          value = item[column.accessor];
        }

        if (value === null || value === undefined) return "";
        
        if (typeof value === 'boolean') return value ? "Sí" : "No";
        
        return String(value);
      });
    });
  }

  protected abstract generateFile(rows: string[][], headers: string[]): Promise<Blob | void>;

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

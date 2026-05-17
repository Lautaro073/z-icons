import { ReportExporter } from "./ReportExporter";

export class CsvExporter<T> extends ReportExporter<T> {
  protected async generateFile(rows: string[][], headers: string[]): Promise<Blob> {
    const escapeCsvField = (field: string) => {
      if (field.trim().startsWith("<svg") && field.includes("</svg>")) {
        return "[Imagen SVG]";
      }
      const cleaned = field.replace(/"/g, '""');
      if (cleaned.includes(",") || cleaned.includes('"') || cleaned.includes("\n") || cleaned.includes(";")) {
        return `"${cleaned}"`;
      }
      return cleaned;
    };

    const sep = ",";
    const lines: string[] = [];

    /* ── Cabecera del reporte ────────────────────────────── */
    lines.push(escapeCsvField(this.title));
    lines.push(escapeCsvField(`Generado el: ${new Date().toLocaleString()}`));
    lines.push(escapeCsvField(`Total registros: ${rows.length}`));
    lines.push(""); // línea vacía como separador visual

    /* ── Headers de columna ──────────────────────────────── */
    lines.push(headers.map(escapeCsvField).join(sep));

    /* ── Separador decorativo ────────────────────────────── */
    lines.push(headers.map(h => "-".repeat(h.length)).join(sep));

    /* ── Filas de datos ──────────────────────────────────── */
    for (const row of rows) {
      lines.push(row.map(escapeCsvField).join(sep));
    }

    /* ── Línea final de cierre ───────────────────────────── */
    lines.push("");
    lines.push(escapeCsvField(`--- Fin del reporte: ${this.title} ---`));

    const fullCsv = lines.join("\n");

    return new Blob(["\uFEFF" + fullCsv], {
      type: "text/csv;charset=utf-8",
    });
  }
}

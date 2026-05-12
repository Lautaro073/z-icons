"use client";

import { useState } from "react";
import { Upload, FileText, FileSpreadsheet, FileJson } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  createExporter, 
  ExportFormat, 
  ReportColumn 
} from "@/lib/reports";

export interface ExportButtonProps<T> {
  data?: T[];
  fetchData?: () => Promise<T[]>;
  columns: ReportColumn<T>[];
  filename: string;
  reportTitle: string;
  label?: string;
  // Traducciones o labels básicos
  labels?: {
    trigger?: string;
    csv?: string;
    excel?: string;
    pdf?: string;
    success?: string;
    error?: string;
    fetching?: string;
  };
}

/**
 * Componente genérico de exportación que consume el patrón Strategy/Factory de Reportes.
 * Soporta datos estáticos o un método `fetchData` para carga diferida (ej: todos los registros).
 */
export function ExportButton<T>({
  data,
  fetchData,
  columns,
  filename,
  reportTitle,
  labels,
}: ExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setOpen(false);

    try {
      let exportData: T[] = [];

      if (fetchData) {
        exportData = await fetchData();
      } else if (data) {
        exportData = data;
      }

      if (!exportData || exportData.length === 0) {
        toast.warning("No hay datos disponibles para exportar");
        setIsExporting(false);
        return;
      }

      // Lógica Polimórfica: No sabemos qué clase instancia el Factory, 
      // pero sabemos que todas tienen el método .export().
      const exporter = createExporter<T>(format, reportTitle, columns);
      
      // Calcular extensión final
      const finalFilename = `${filename}.${format === 'xlsx' ? 'xlsx' : format}`;
      
      await exporter.export(exportData, finalFilename);
      
      toast.success(labels?.success || `Exportación ${format.toUpperCase()} completada`);
    } catch (error) {
      console.error("Error en exportación visual:", error);
      toast.error(labels?.error || "Ocurrió un error al generar el reporte");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full gap-2 text-xs"
          disabled={isExporting}
        >
          <Upload className="size-3.5" />
          <span>{isExporting ? (labels?.fetching || "Exportando...") : (labels?.trigger || "Exportar")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 rounded-[1.4rem] p-2 overflow-hidden">
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => handleExport('csv')}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-colors hover:bg-muted text-foreground"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <FileJson className="size-4" />
            </div>
            <span className="font-medium">{labels?.csv || "CSV (.csv)"}</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleExport('xlsx')}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-colors hover:bg-muted text-foreground"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <FileSpreadsheet className="size-4" />
            </div>
            <span className="font-medium">{labels?.excel || "Excel (.xlsx)"}</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-colors hover:bg-muted text-foreground"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
              <FileText className="size-4" />
            </div>
            <span className="font-medium">{labels?.pdf || "PDF (.pdf)"}</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

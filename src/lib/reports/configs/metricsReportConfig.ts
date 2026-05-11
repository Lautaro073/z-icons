import { ReportColumn } from "../ReportExporter";
import { AdminMetricsTimeseriesPoint } from "@/lib/api/backend";

/**
 * Devuelve la definición de columnas para el reporte de Estadísticas/Métricas.
 */
export const getMetricsReportColumns = (
  t: (key: string) => string,
  formatDateFn?: (date: string) => string,
  formatCurrencyFn?: (amount: number) => string
): ReportColumn<AdminMetricsTimeseriesPoint>[] => [
  {
    header: t("period"), // Ej: Período / Fecha
    accessor: (m) => formatDateFn ? formatDateFn(m.bucketStart) : new Date(m.bucketStart).toLocaleDateString(),
  },
  {
    header: t("registrations"),
    accessor: "registrations",
  },
  {
    header: t("sales"),
    accessor: "salesCount",
  },
  {
    header: t("grossRevenue"),
    accessor: (m) => formatCurrencyFn ? formatCurrencyFn(m.grossRevenue) : `$${m.grossRevenue.toFixed(2)}`,
  },
  {
    header: t("netRevenue"),
    accessor: (m) => formatCurrencyFn ? formatCurrencyFn(m.netRevenue) : `$${m.netRevenue.toFixed(2)}`,
  }
];

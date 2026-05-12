import { IconEntity } from "@/features/icons-explorer/models/IconEntity";
import { ReportColumn } from "@/lib/reports/ReportExporter";

/**
 * Devuelve la definición de columnas para el reporte de iconos inyectando traducciones.
 */
export const getIconsReportColumns = (
  t: (key: string) => string,
  getUserNameFn: (icon: IconEntity) => string,
  formatDateFn?: (date: string) => string
): ReportColumn<IconEntity>[] => [
  {
    header: "Icono",
    accessor: (icon) => icon.svgContent || "",
  },
  {
    header: t("name"),
    accessor: "name",
  },
  {
    header: t("category"),
    accessor: "category",
  },
  {
    header: t("is_premium"),
    accessor: (icon) => {
      const isPrem = icon.isPremium();
      return isPrem ? t("premium") : t("free");
    },
  },
  {
    header: t("status"),
    accessor: (icon) => icon.raw.status,
  },
  {
    header: t("creator"),
    accessor: (icon) => getUserNameFn(icon),
  },
  {
    header: t("createdAt"),
    accessor: (icon) => formatDateFn ? formatDateFn(icon.raw.created_at) : new Date(icon.raw.created_at).toLocaleDateString(),
  }
];

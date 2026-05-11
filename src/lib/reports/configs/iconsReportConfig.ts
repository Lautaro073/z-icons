import { ReportColumn } from "../ReportExporter";
import { CustomIcon } from "@/lib/api/backend";

/**
 * Devuelve la definición de columnas para el reporte de iconos inyectando traducciones.
 */
export const getIconsReportColumns = (
  t: (key: string) => string,
  getUserNameFn: (icon: CustomIcon) => string,
  formatDateFn?: (date: string) => string
): ReportColumn<CustomIcon>[] => [
  {
    header: "Icono",
    accessor: (icon) => icon.svg_content || "",
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
      const isPrem = icon.is_premium === true || icon.is_premium === 1 || String(icon.is_premium) === "true";
      return isPrem ? t("premium") : t("free");
    },
  },
  {
    header: t("status"),
    accessor: "status",
  },
  {
    header: t("creator"),
    accessor: (icon) => getUserNameFn(icon),
  },
  {
    header: t("createdAt"),
    accessor: (icon) => formatDateFn ? formatDateFn(icon.created_at) : new Date(icon.created_at).toLocaleDateString(),
  }
];

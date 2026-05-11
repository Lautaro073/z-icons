import { ReportColumn } from "../ReportExporter";
import { AdminUser } from "@/lib/api/backend";

/**
 * Devuelve la definición de columnas para el reporte de usuarios inyectando traducciones.
 */
export const getUserReportColumns = (
  t: (key: string) => string,
  formatDateFn?: (date: string) => string
): ReportColumn<AdminUser>[] => [
  {
    header: t("username"),
    accessor: "username",
  },
  {
    header: t("email"),
    accessor: "email",
  },
  {
    header: t("role"),
    accessor: "role_name",
  },
  {
    header: t("accountStatus"),
    accessor: (u) => u.accountStatus === "active" ? t("active") : t("disabled"),
  },
  {
    header: t("plan"),
    accessor: (u) => u.subscriptionStatus ? t(`states.${u.subscriptionStatus}`) : "-",
  },
  {
    header: t("createdAt"),
    accessor: (u) => formatDateFn ? formatDateFn(u.created_at) : new Date(u.created_at).toLocaleDateString(),
  }
];

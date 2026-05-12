import { AdminPlanType } from "@/types/admin";
import { UserEntity } from "@/features/user/models/UserEntity";
import { ReportColumn } from "@/lib/reports/ReportExporter";

/**
 * Devuelve la definición de columnas para el reporte de usuarios inyectando traducciones.
 */
export const getUserReportColumns = (
  t: (key: string, data?: Record<string, unknown>) => string,
  formatDateFn: (date: string | null | undefined) => string,
  planByEmail?: Map<string, AdminPlanType>
): ReportColumn<UserEntity>[] => [
  {
    header: t("username"),
    accessor: (u) => u.displayName,
  },
  {
    header: t("email"),
    accessor: "email",
  },
  {
    header: t("role"),
    accessor: (u) => t(`role.${u.role}`),
  },
  {
    header: t("accountStatus"),
    accessor: (u) => u.isDisabled() ? t("accountStatus.disabled") : t("accountStatus.active"),
  },
  {
    header: t("subscriptionStatus"),
    accessor: (u) => u.raw.subscriptionStatus ? t(`states.${u.raw.subscriptionStatus}`) : "-",
  },
  {
    header: t("plan"),
    accessor: (u) => {
      const subPlan = planByEmail?.get(u.email);
      if (subPlan) return t(`plan.${subPlan}`);
      if (u.isPro()) return t("plan.pro");
      return t("plan.free") || "-";
    },
  },
  {
    header: t("tokenExpiry"),
    accessor: (u) => formatDateFn(u.raw.token_finish_date),
  },
  {
    header: t("createdAt"),
    accessor: (u) => formatDateFn(u.raw.created_at),
  }
];

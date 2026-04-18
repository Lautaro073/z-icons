import type { AdminPreferenceColumnKey } from "@/lib/api/backend";

export interface AdminTableHeaderProps {
  columnOptions: Array<{ key: AdminPreferenceColumnKey; label: string }>;
  visibleColumns: Record<AdminPreferenceColumnKey, boolean>;
  admin: (key: string) => string;
}

export function AdminTableHeader({ columnOptions, visibleColumns, admin }: AdminTableHeaderProps) {
  return (
    <thead className="sticky top-0 z-10 border-b border-border/60 text-[11px]">
      <tr className="border-b border-border/60 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {columnOptions.map(
          (columnOption) =>
            visibleColumns[columnOption.key] && (
              <th key={columnOption.key} className="px-3 py-3">
                {columnOption.label}
              </th>
            )
        )}
        <th className="px-3 py-3 text-right">{admin("table.users.actions")}</th>
      </tr>
    </thead>
  );
}

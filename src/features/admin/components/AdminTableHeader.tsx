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
                <th className="sticky right-0 relative px-3 py-3 text-right">
                    <div className="absolute inset-0 -z-20 bg-background" />
                    <div className="absolute inset-0 -z-10 bg-surface" />
                    <span className="relative z-10">{admin("table.users.actions")}</span>
                </th>
            </tr>
        </thead>
    );
}

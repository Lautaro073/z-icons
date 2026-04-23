import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { AdminPreferenceColumnKey } from "@/lib/api/backend";

export interface AdminTableColumnsControlProps {
    columnOptions: Array<{ key: AdminPreferenceColumnKey; label: string }>;
    visibleColumns: Record<AdminPreferenceColumnKey, boolean>;
    visibleColumnCount: number;
    onToggleColumnVisibility: (key: AdminPreferenceColumnKey) => void;
    admin: (key: string) => string;
}

export function AdminTableColumnsControl({
    columnOptions,
    visibleColumns,
    visibleColumnCount,
    onToggleColumnVisibility,
    admin,
}: AdminTableColumnsControlProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                    {admin("table.users.columnsControl")}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 rounded-[1.4rem] p-3">
                <div className="grid gap-2">
                    {columnOptions.map((columnOption) => (
                        <label key={columnOption.key} className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                className="h-4 w-4 accent-primary"
                                checked={visibleColumns[columnOption.key]}
                                onChange={() => onToggleColumnVisibility(columnOption.key)}
                                disabled={visibleColumnCount === 1 && visibleColumns[columnOption.key]}
                            />
                            <span>{columnOption.label}</span>
                        </label>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

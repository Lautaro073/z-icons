import { Button } from "@/components/ui/button";
import { ZIcon } from "@zcorvus/z-icons/react";
import type { AdminPagination } from "../types/table.types";

export interface AdminTablePaginationProps {
    usersPagination: AdminPagination;
    common: (key: string) => string;
    onUsersPageChange: (page: number) => void;
}

export function AdminTablePagination({ usersPagination, common, onUsersPageChange }: AdminTablePaginationProps) {
    return (
        <div className="mt-5 flex items-center justify-between border-t border-surface-border/50 pt-5">
            <p className="text-sm font-medium text-muted-foreground">
                Página {usersPagination.page} de {usersPagination.totalPages}
            </p>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    disabled={!usersPagination.hasPrev}
                    onClick={() => onUsersPageChange(Math.max(1, usersPagination.page - 1))}
                    className="h-8 w-8 rounded-full p-0 sm:w-auto sm:px-3"
                >
                    <ZIcon type="mina" name="chevron-left" className="size-4 sm:mr-1" />
                    <span className="hidden sm:inline">{common("actions.previous")}</span>
                </Button>
                <Button
                    variant="outline"
                    disabled={!usersPagination.hasNext}
                    onClick={() => onUsersPageChange(usersPagination.page + 1)}
                    className="h-8 w-8 rounded-full p-0 sm:w-auto sm:px-3"
                >
                    <span className="hidden sm:inline">{common("actions.next")}</span>
                    <ZIcon type="mina" name="chevron-right" className="size-4 sm:ml-1" />
                </Button>
            </div>
        </div>
    );
}

import { Button } from "@/components/ui/button";

export interface AdminPagination {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface AdminTablePaginationProps {
  usersPagination: AdminPagination;
  common: (key: string) => string;
  onUsersPageChange: (page: number) => void;
}

export function AdminTablePagination({ usersPagination, common, onUsersPageChange }: AdminTablePaginationProps) {
  return (
    <div className="mt-5 flex items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground">
        {usersPagination.page} / {usersPagination.totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!usersPagination.hasPrev}
          onClick={() => onUsersPageChange(Math.max(1, usersPagination.page - 1))}
          className="rounded-full"
        >
          {common("actions.previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!usersPagination.hasNext}
          onClick={() => onUsersPageChange(usersPagination.page + 1)}
          className="rounded-full"
        >
          {common("actions.next")}
        </Button>
      </div>
    </div>
  );
}

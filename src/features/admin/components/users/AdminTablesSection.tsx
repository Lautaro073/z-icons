"use client";

import { useMemo } from "react";
import type {
  AdminPreferenceColumnKey,
  AdminPlanType,
  GetAdminUsersParams,
  AdminUser,
} from "@/lib/api/backend";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAdminTables } from "@/features/admin/index";
import { ConfirmActionModal, EditUserModal } from "./AdminTablesModals";
import { AdminDataTableBase } from "../AdminDataTableBase";
import { getAdminUserColumns } from "./AdminUserColumns";
import { AdminTableColumnsControl } from "../AdminTableColumnsControl";
import { AdminTablesPlaceholder } from "../AdminTablesPlaceholder";
import { ZIcon } from "@zcorvus/z-icons/react";

type UserColumnKey = AdminPreferenceColumnKey;

interface AdminTablesSectionProps {
  usersParams: GetAdminUsersParams;
  planType?: AdminPlanType;
  enabled?: boolean;
  onUsersPageChange: (page: number) => void;
  visibleColumns: Record<UserColumnKey, boolean>;
  onToggleColumnVisibility: (key: UserColumnKey) => void;
}

const defaultVisibleColumns: Record<UserColumnKey, boolean> = {
  username: true,
  email: true,
  role: true,
  accountStatus: true,
  status: true,
  plan: true,
  startDate: true,
  tokenExpiry: true,
};

export { defaultVisibleColumns };
export type { UserColumnKey };

export function AdminTablesSection({
  usersParams,
  planType,
  enabled = true,
  onUsersPageChange,
  visibleColumns,
  onToggleColumnVisibility,
}: AdminTablesSectionProps) {
  const {
    admin,
    common,
    currentUser,
    filteredUsers,
    subscriptionByEmail,
    planByEmail,
    usersPagination,
    isLoading,
    isError,
    isPlanFilterEnabled,
    isDisabledAccountsView,
    isEmpty,
    formatDate,
    columnOptions,
    visibleColumnCount,
    editingUser,
    editDraft,
    setEditDraft,
    setEditingUser,
    pendingAction,
    setPendingAction,
    openEditModal,
    submitEditModal,
    confirmPendingAction,
    updateMutation,
    disableMutation,
    reEnableMutation,
    deleteMutation,
    modalLabels,
    confirmLabels,
  } = useAdminTables({ usersParams, planType, enabled });

  const finalColumns = useMemo(() => {
    const baseColumns = getAdminUserColumns({
      admin,
      common,
      formatDate,
      subscriptionByEmail,
      planByEmail,
      currentUserId: currentUser?.id ?? undefined,
      openEditModal,
      setPendingAction,
      reEnableMutation,
      disableMutation,
      deleteMutation,
      updateMutationIsPending: updateMutation.isPending,
      editingUser,
      pendingAction,
      isDisabledAccountsView,
    });

    return baseColumns.filter(col => 
      col.id === "actions" || visibleColumns[col.id as UserColumnKey]
    );
  }, [
    admin,
    common,
    formatDate,
    subscriptionByEmail,
    planByEmail,
    currentUser?.id,
    openEditModal,
    setPendingAction,
    reEnableMutation,
    disableMutation,
    deleteMutation,
    updateMutation.isPending,
    editingUser,
    pendingAction,
    isDisabledAccountsView,
    visibleColumns
  ]);

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        <AdminDataTableBase<AdminUser>
          data={filteredUsers}
          columns={finalColumns}
          title={admin("table.users.title")}
          isLoading={isLoading}
          isError={isError}
          isEmptyOverride={isEmpty}
          headerActions={
            !isLoading && !isError && !isEmpty && (
              <AdminTableColumnsControl
                columnOptions={columnOptions}
                visibleColumns={visibleColumns}
                visibleColumnCount={visibleColumnCount}
                onToggleColumnVisibility={onToggleColumnVisibility}
                admin={admin}
              />
            )
          }
          loadingComponent={
            <AdminTablesPlaceholder type="loading" isPlanFilterEnabled={isPlanFilterEnabled} admin={admin} />
          }
          errorComponent={
            <div className="rounded-[1.25rem] border border-destructive/30 bg-destructive/5 p-6 text-center flex flex-col items-center justify-center gap-2">
              <ZIcon type="mina" name="danger-triangle" className="size-6 text-destructive mb-2" />
              <p className="text-sm text-destructive font-medium">
                {isPlanFilterEnabled ? admin("errors.loadSubscriptions") : admin("errors.loadUsers")}
              </p>
            </div>
          }
          emptyComponent={
            <div className="rounded-[1.25rem] border border-border/60 bg-muted/10 p-8 text-center flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground font-medium">
                {admin("states.emptyUsers")}
              </p>
            </div>
          }
          pagination={usersPagination ?? null}
          common={common}
          onPageChange={onUsersPageChange}
          tableMinWidthClassName="w-full min-w-304 text-left text-sm md:min-w-6xl"
        />

        <EditUserModal
          open={Boolean(editingUser)}
          user={editingUser}
          draft={editDraft}
          onDraftChange={setEditDraft}
          onClose={() => {
            if (!updateMutation.isPending) {
              setEditingUser(null);
            }
          }}
          onSubmit={submitEditModal}
          isPending={updateMutation.isPending}
          labels={modalLabels}
        />

        <ConfirmActionModal
          pendingAction={pendingAction}
          onClose={() => {
            if (!disableMutation.isPending && !deleteMutation.isPending) {
              setPendingAction(null);
            }
          }}
          onConfirm={confirmPendingAction}
          isPending={disableMutation.isPending || deleteMutation.isPending}
          labels={confirmLabels}
        />
      </div>
    </TooltipProvider>
  );
}

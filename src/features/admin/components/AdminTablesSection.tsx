"use client";

import type {
  AdminPreferenceColumnKey,
  AdminPlanType,
  GetAdminUsersParams,
} from "@/lib/api/backend";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAdminTables } from "@/features/admin/index";
import { ConfirmActionModal, EditUserModal } from "./AdminTablesModals";
import { AdminTablesView } from "./AdminTablesView";

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

  return (
    <TooltipProvider>
      <AdminTablesView
        admin={admin}
        common={common}
        currentUserId={currentUser?.id ?? undefined}
        filteredUsers={filteredUsers}
        subscriptionByEmail={subscriptionByEmail}
        planByEmail={planByEmail}
        usersPagination={usersPagination ?? null}
        isLoading={isLoading}
        isError={isError}
        isPlanFilterEnabled={isPlanFilterEnabled}
        isDisabledAccountsView={isDisabledAccountsView}
        isEmpty={isEmpty}
        formatDate={formatDate}
        columnOptions={columnOptions}
        visibleColumnCount={visibleColumnCount}
        visibleColumns={visibleColumns}
        onToggleColumnVisibility={onToggleColumnVisibility}
        openEditModal={openEditModal}
        setPendingAction={setPendingAction}
        reEnableMutation={reEnableMutation}
        disableMutation={disableMutation}
        deleteMutation={deleteMutation}
        updateMutationIsPending={updateMutation.isPending}
        editingUser={editingUser}
        pendingAction={pendingAction}
        onUsersPageChange={onUsersPageChange}
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
    </TooltipProvider>
  );
}

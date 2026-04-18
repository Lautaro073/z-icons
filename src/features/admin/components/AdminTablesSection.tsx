"use client";

import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAdminTables } from "@/features/admin/index";
import type {
  AdminPreferenceColumnKey,
  AdminPlanType,
  GetAdminUsersParams,
} from "@/lib/api/backend";
import { AdminTableColumnsControl } from "./AdminTableColumnsControl";
import { AdminTableRow } from "./AdminTableRow";
import { ConfirmActionModal, EditUserModal } from "./AdminTablesModals";
import { AdminTablesPlaceholder } from "./AdminTablesPlaceholder";

interface AdminTablesSectionProps {
  usersParams: GetAdminUsersParams;
  planType?: AdminPlanType;
  enabled?: boolean;
  onUsersPageChange: (page: number) => void;
  visibleColumns: Record<UserColumnKey, boolean>;
  onToggleColumnVisibility: (key: UserColumnKey) => void;
}

type UserColumnKey = AdminPreferenceColumnKey;

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
      <section className="grid gap-4 overflow-x-clip">
        <article className="ui-surface-panel flex min-h-[30rem] min-w-0 flex-col rounded-[1.85rem] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div />

            {!isLoading && !isError && !isEmpty && (
              <AdminTableColumnsControl
                columnOptions={columnOptions}
                visibleColumns={visibleColumns}
                visibleColumnCount={visibleColumnCount}
                onToggleColumnVisibility={onToggleColumnVisibility}
                admin={admin}
              />
            )}
          </div>

          <div className="mt-4 min-h-80 min-w-0">
            {isLoading && (
              <AdminTablesPlaceholder type="loading" isPlanFilterEnabled={isPlanFilterEnabled} admin={admin} />
            )}

            {isError && (
              <AdminTablesPlaceholder type="error" isPlanFilterEnabled={isPlanFilterEnabled} admin={admin} />
            )}

            {isEmpty && (
              <AdminTablesPlaceholder type="empty" isPlanFilterEnabled={isPlanFilterEnabled} admin={admin} />
            )}

            {!isLoading && !isError && !isEmpty && (
              <div className="overflow-x-auto overscroll-x-contain">
                <table className="w-full min-w-304 text-left text-sm md:min-w-6xl">
                  <thead className="sticky top-0 z-10 border-b border-border/60 text-[11px]">
                    <tr className="border-b border-border/60 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {visibleColumns.username && <th className="px-3 py-3">{admin("table.users.username")}</th>}
                      {visibleColumns.email && <th className="px-3 py-3">{admin("table.users.email")}</th>}
                      {visibleColumns.role && <th className="px-3 py-3">{admin("table.users.role")}</th>}
                      {visibleColumns.accountStatus && <th className="px-3 py-3">{admin("table.users.accountStatus")}</th>}
                      {visibleColumns.status && <th className="px-3 py-3">{admin("table.users.status")}</th>}
                      {visibleColumns.plan && <th className="px-3 py-3">{admin("table.subscriptions.plan")}</th>}
                      {visibleColumns.startDate && <th className="px-3 py-3">{admin("table.users.startDate")}</th>}
                      {visibleColumns.tokenExpiry && <th className="px-3 py-3">{admin("table.users.tokenExpiry")}</th>}
                      <th className="px-3 py-3 text-right">{admin("table.users.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((item) => (
                      <AdminTableRow
                        key={item.id}
                        item={item}
                        currentUserId={currentUser?.id}
                        subscriptionByEmail={subscriptionByEmail}
                        planByEmail={planByEmail}
                        visibleColumns={visibleColumns}
                        admin={admin}
                        common={common}
                        formatDate={formatDate}
                        openEditModal={openEditModal}
                        setPendingAction={setPendingAction}
                        reEnableMutation={reEnableMutation}
                        disableMutation={disableMutation}
                        deleteMutation={deleteMutation}
                        updateMutationIsPending={updateMutation.isPending}
                        editingUser={editingUser}
                        pendingAction={pendingAction}
                        isDisabledAccountsView={isDisabledAccountsView}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {usersPagination && (
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
          )}
        </article>
      </section>

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

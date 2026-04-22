import type {
  AdminPlanType,
  AdminPreferenceColumnKey,
  AdminSubscription,
  AdminUser,
} from "@/lib/api/backend";
import type { MutationState, PendingAction } from "@/types";
import { AdminTableColumnsControl } from "./AdminTableColumnsControl";
import { AdminTableHeader } from "./AdminTableHeader";
import { AdminTablePagination, type AdminPagination } from "./AdminTablePagination";
import { AdminTableRow } from "./AdminTableRow";
import { AdminTablesPlaceholder } from "./AdminTablesPlaceholder";

interface AdminTablesViewProps {
  admin: (key: string) => string;
  common: (key: string) => string;
  currentUserId?: string;
  filteredUsers: AdminUser[];
  subscriptionByEmail: Map<string, AdminSubscription>;
  planByEmail: Map<string, AdminPlanType>;
  usersPagination: AdminPagination | null;
  isLoading: boolean;
  isError: boolean;
  isPlanFilterEnabled: boolean;
  isDisabledAccountsView: boolean;
  isEmpty: boolean;
  formatDate: (rawDate?: string | null) => string;
  columnOptions: Array<{ key: AdminPreferenceColumnKey; label: string }>;
  visibleColumnCount: number;
  visibleColumns: Record<AdminPreferenceColumnKey, boolean>;
  onToggleColumnVisibility: (key: AdminPreferenceColumnKey) => void;
  openEditModal: (user: AdminUser) => void;
  setPendingAction: (action: PendingAction) => void;
  reEnableMutation: MutationState<string>;
  disableMutation: MutationState<string>;
  deleteMutation: MutationState<string>;
  updateMutationIsPending: boolean;
  editingUser: AdminUser | null;
  pendingAction: PendingAction;
  onUsersPageChange: (page: number) => void;
}

export function AdminTablesView({
  admin,
  common,
  currentUserId,
  filteredUsers,
  subscriptionByEmail,
  planByEmail,
  isLoading,
  isError,
  isPlanFilterEnabled,
  isEmpty,
  formatDate,
  columnOptions,
  visibleColumns,
  visibleColumnCount,
  onToggleColumnVisibility,
  openEditModal,
  setPendingAction,
  reEnableMutation,
  disableMutation,
  deleteMutation,
  updateMutationIsPending,
  editingUser,
  pendingAction,
  usersPagination,
  onUsersPageChange,
  isDisabledAccountsView,
}: AdminTablesViewProps) {
  return (
    <section className="grid gap-4 overflow-x-clip">
      <article className="ui-surface-panel flex min-h-120 min-w-0 flex-col rounded-[1.85rem] p-4 sm:p-5">
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

        <div className="mt-4 min-h-120 min-w-0">
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
                <AdminTableHeader columnOptions={columnOptions} visibleColumns={visibleColumns} admin={admin} />
                <tbody>
                  {filteredUsers.map((item) => (
                    <AdminTableRow
                      key={item.id}
                      item={item}
                      currentUserId={currentUserId}
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
                      updateMutationIsPending={updateMutationIsPending}
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
          <AdminTablePagination
            usersPagination={usersPagination}
            common={common}
            onUsersPageChange={onUsersPageChange}
          />
        )}
      </article>
    </section>
  );
}

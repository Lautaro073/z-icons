import type {
    AdminPlanType,
    AdminPreferenceColumnKey,
    AdminSubscription,
    AdminUser,
} from "@/lib/api/backend";
import type { MutationState, PendingAction } from "@/types";
import { AdminTableRowCells } from "./AdminTableRowCells";

export interface AdminTableRowProps {
    item: AdminUser;
    currentUserId?: string;
    subscriptionByEmail: Map<string, AdminSubscription>;
    planByEmail: Map<string, AdminPlanType>;
    visibleColumns: Record<AdminPreferenceColumnKey, boolean>;
    admin: (key: string) => string;
    common: (key: string) => string;
    formatDate: (rawDate?: string | null) => string;
    openEditModal: (user: AdminUser) => void;
    setPendingAction: (action: PendingAction) => void;
    reEnableMutation: MutationState<string>;
    disableMutation: MutationState<string>;
    deleteMutation: MutationState<string>;
    updateMutationIsPending: boolean;
    editingUser: AdminUser | null;
    pendingAction: PendingAction;
    isDisabledAccountsView: boolean;
}

export function AdminTableRow({
    item,
    currentUserId,
    subscriptionByEmail,
    planByEmail,
    visibleColumns,
    admin,
    common,
    formatDate,
    openEditModal,
    setPendingAction,
    reEnableMutation,
    disableMutation,
    deleteMutation,
    updateMutationIsPending,
    editingUser,
    pendingAction,
    isDisabledAccountsView,
}: AdminTableRowProps) {
    return (
        <tr className="border-b border-border/40 transition-colors duration-150 hover:bg-muted/16">
            <AdminTableRowCells
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
        </tr>
    );
}
